'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import {
  heroCamera,
  heroCameraCompact,
  matchingCamera,
  matchingCameraCompact,
  networkCamera,
  networkCameraCompact,
  safetyCamera,
  safetyCameraCompact,
  seatsCamera,
  technologyCamera,
  type CameraSpec,
} from './lib/layouts';
import { attachPointer, pointer } from './lib/pointer';
import { sceneLoaders } from './registry';
import type { SceneFailure } from './SceneCanvas';
import type { BaseSceneProps, SceneName, ScenePropsMap, SceneTier } from './types';
import styles from './SceneCanvas.module.css';

interface CameraSetup {
  spec: CameraSpec;
  /** Used when the canvas is narrow or portrait (phones, stacked layouts). */
  compact?: CameraSpec;
  /** Strength of the pointer parallax, in world units. */
  parallax: number;
}

const cameras: Record<SceneName, CameraSetup> = {
  mobility: { spec: heroCamera, compact: heroCameraCompact, parallax: 0.45 },
  matching: { spec: matchingCamera, compact: matchingCameraCompact, parallax: 0.25 },
  safety: { spec: safetyCamera, compact: safetyCameraCompact, parallax: 0.3 },
  seats: { spec: seatsCamera, parallax: 0.25 },
  network: { spec: networkCamera, compact: networkCameraCompact, parallax: 0.5 },
  technology: { spec: technologyCamera, parallax: 0.35 },
};

type AnyScene = ComponentType<BaseSceneProps & Record<string, unknown>>;

/** One lazy component per scene, created once at module scope (the registry ties props to names). */
const lazyScenes = Object.fromEntries(
  (Object.keys(sceneLoaders) as SceneName[]).map((name) => [name, lazy(sceneLoaders[name] as () => Promise<{ default: AnyScene }>)]),
) as Record<SceneName, LazyExoticComponent<AnyScene>>;

interface SceneRendererProps<N extends SceneName> {
  scene: N;
  sceneProps: ScenePropsMap[N];
  tier: SceneTier;
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onFailure: (reason: SceneFailure) => void;
}

/** Frames the scene for the canvas aspect ratio and adds a gentle pointer parallax. */
function CameraRig({ setup, parallax }: { setup: CameraSetup; parallax: boolean }) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  // Desktop framings leave room for side-by-side text; stacked (narrow or portrait) canvases centre the scene.
  const stacked = size.width < 768 || size.width / Math.max(1, size.height) < 1.05;
  const spec = setup.compact && stacked ? setup.compact : setup.spec;
  const base = useMemo(() => new Vector3(...spec.position), [spec]);
  const target = useMemo(() => new Vector3(...spec.target), [spec]);
  const desired = useMemo(() => new Vector3(), []);

  useLayoutEffect(() => {
    camera.position.copy(base);
    camera.fov = spec.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(target);
    invalidate();
  }, [camera, base, target, spec, invalidate]);

  useFrame((_, delta) => {
    if (!parallax) return;
    desired.set(base.x + pointer.x * setup.parallax, base.y - pointer.y * setup.parallax * 0.5, base.z);
    camera.position.lerp(desired, 1 - Math.exp(-Math.min(delta, 0.1) * 2.2));
    camera.lookAt(target);
  });

  return null;
}

/** Caps rendering at `fps` on reduced-tier devices (frameloop="demand"). */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    let frame = 0;
    let last = 0;
    const interval = 1000 / fps;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last >= interval - 2) {
        last = now;
        invalidate();
      }
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [fps, invalidate]);
  return null;
}

/** Pre-compiles shaders, then reports readiness after two presented frames. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const frames = useRef(0);

  useEffect(() => {
    gl.compile(scene, camera);
    invalidate();
  }, [gl, scene, camera, invalidate]);

  useFrame(() => {
    if (frames.current > 2) return;
    frames.current += 1;
    if (frames.current === 2) onReady();
    else invalidate();
  });
  return null;
}

export default function SceneRenderer<N extends SceneName>({
  scene,
  sceneProps,
  tier,
  active,
  reducedMotion,
  onReady,
  onFailure,
}: SceneRendererProps<N>) {
  const Scene: LazyExoticComponent<AnyScene> = lazyScenes[scene];
  const maxDpr = tier === 'high' ? 1.75 : 1.25;
  // Each performance decline steps the resolution down by 0.5×, never below 1×.
  const [declines, setDeclines] = useState(0);
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, maxDpr) - declines * 0.5);
  const setup = cameras[scene];
  const animate = active && !reducedMotion;

  useEffect(() => {
    if (!reducedMotion) attachPointer();
  }, [reducedMotion]);

  const frameloop = !active ? 'never' : animate && tier === 'high' ? 'always' : 'demand';

  return (
    <Canvas
      className={styles.canvas}
      dpr={dpr}
      frameloop={frameloop}
      flat
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: setup.spec.fov, position: setup.spec.position, near: 0.1, far: 80 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
            onFailure('context-lost');
          },
          { once: true },
        );
      }}
    >
      <CameraRig setup={setup} parallax={animate && setup.parallax > 0} />
      {animate && tier === 'low' ? <FrameLimiter fps={30} /> : null}
      {animate && tier === 'high' ? (
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDeclines((count) => count + 1)}
          onFallback={() => onFailure('performance')}
        />
      ) : null}
      <Suspense fallback={null}>
        <Scene {...(sceneProps as Record<string, unknown>)} tier={tier} reducedMotion={reducedMotion} />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
