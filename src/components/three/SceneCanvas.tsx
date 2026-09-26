'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { detectDeviceTier, lowerDeviceTier, useDeviceTier } from '@/hooks/useDeviceTier';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useUserEngaged } from '@/hooks/useUserEngaged';
import { useViewportPresence } from '@/hooks/useViewportPresence';
import { tierAtLeast } from '@/lib/device-capability';
import { cn } from '@/lib/cn';
import type { SceneName, ScenePropsMap, SceneTier } from './types';
import styles from './SceneCanvas.module.css';

const SceneRenderer = dynamic(() => import('./SceneRenderer'), { ssr: false, loading: () => null });

export type SceneFailure = 'context-lost' | 'performance' | 'error';

interface SceneCanvasProps<N extends SceneName> {
  scene: N;
  sceneProps: ScenePropsMap[N];
  /** Server-rendered static illustration: shown first, while loading, and whenever WebGL is unavailable. */
  fallback: ReactNode;
  /** What the visual communicates, for assistive technology. */
  label: string;
  /** Lowest device tier that gets WebGL for this scene. */
  minTier?: SceneTier;
  className?: string;
  /** Called with `true` once the live 3D scene is showing, `false` while the static version is. */
  onLiveChange?: (live: boolean) => void;
  /** DOM content layered above the visual (legends, captions). */
  children?: ReactNode;
}

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Progressive 3D: static SVG → (near viewport, capable device) lazy WebGL scene → crossfade.
 * The scene pauses whenever it is offscreen and falls back to the SVG on any failure.
 */
export function SceneCanvas<N extends SceneName>({
  scene,
  sceneProps,
  fallback,
  label,
  minTier = 'low',
  className,
  onLiveChange,
  children,
}: SceneCanvasProps<N>) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const reducedMotion = usePrefersReducedMotion();
  const { near, visible } = useViewportPresence(ref);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onLiveChange?.(ready);
  }, [ready, onLiveChange]);

  // Never let WebGL compete with first paint and hydration: start once the browser is idle,
  // and on reduced-tier (mobile) devices only after the visitor starts interacting.
  const engaged = useUserEngaged();
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!near || idle) return;
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(
        () => {
          detectDeviceTier();
          setIdle(true);
        },
        { timeout: 2000 },
      );
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(() => {
      detectDeviceTier();
      setIdle(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [near, idle]);

  const webglTier: SceneTier | null =
    tier && tier !== 'static' && tierAtLeast(tier, minTier) && !failed ? tier : null;

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback((reason: SceneFailure) => {
    setReady(false);
    if (reason === 'performance') {
      // Sustained low frame rate: step every scene down one tier (Full → Reduced → Static).
      lowerDeviceTier('low');
      return;
    }
    setFailed(true);
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} className={cn(styles.root, className)} data-ready={ready || undefined}>
      <div className={styles.fallback} aria-hidden="true">
        {fallback}
      </div>
      {webglTier && near && idle && (webglTier === 'high' || engaged) ? (
        <SceneErrorBoundary onError={() => handleFailure('error')}>
          <SceneRenderer
            scene={scene}
            sceneProps={sceneProps}
            tier={webglTier}
            active={visible}
            reducedMotion={reducedMotion}
            onReady={handleReady}
            onFailure={handleFailure}
          />
        </SceneErrorBoundary>
      ) : null}
      {children ? <div className={styles.overlay}>{children}</div> : null}
    </div>
  );
}
