'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { BoxGeometry, Color, InstancedMesh, MeshLambertMaterial, Object3D, Points } from 'three';
import { sceneColors } from '@/design-system/tokens';
import { ProtectiveField } from '../primitives/ProtectiveField';
import { RouteNetwork } from '../primitives/RouteNetwork';
import { RouteRibbon } from '../primitives/RouteRibbon';
import { SceneLabel } from '../primitives/SceneLabel';
import { Vehicle } from '../primitives/Vehicle';
import { createPointsBuffers, markPointsDirty, type LinePath } from '../lib/buffers';
import { easeInOutCubic, type Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio, useSceneTime } from '../lib/hooks';
import { STREET_SPACING, safetyBuildings, safetyRoute } from '../lib/layouts';
import { createPointsMaterial, tokenColor } from '../lib/materials';
import type { BaseSceneProps, SafetySceneProps } from '../types';

const TRIP = { travel: 11, pause: 1.2 };

/** Buildings as one instanced mesh, lit softly and shaded darker with height. */
function Buildings({ density }: { density: 'high' | 'low' }) {
  const mesh = useMemo(() => {
    const buildings = safetyBuildings(density);
    const geometry = new BoxGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    const material = new MeshLambertMaterial({ color: 0xffffff });
    const object = new InstancedMesh(geometry, material, buildings.length);
    const dummy = new Object3D();
    const low = new Color(sceneColors.building);
    const high = new Color(sceneColors.buildingTop);
    const color = new Color();
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.updateMatrix();
      object.setMatrixAt(i, dummy.matrix);
      object.setColorAt(i, color.copy(low).lerp(high, Math.min(1, b.height / 1.6)));
    });
    object.instanceMatrix.needsUpdate = true;
    return object;
  }, [density]);
  useDisposal(mesh);
  return <primitive object={mesh} />;
}

/** "Live trip sharing": location pulses rising from the vehicle to trusted contacts. */
function ShareSignal({ follow, still }: { follow: { current: Vec3 }; still: boolean }) {
  const pixelRatio = usePixelRatio();
  const count = 5;
  const { points, buffers } = useMemo(() => {
    const buffers = createPointsBuffers(count);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    object.renderOrder = 6;
    const color = tokenColor('shield');
    for (let i = 0; i < count; i++) {
      buffers.color.setXYZ(i, color.r, color.g, color.b);
      buffers.size.setX(i, 7);
    }
    buffers.color.needsUpdate = true;
    buffers.size.needsUpdate = true;
    return { points: object, buffers };
     
  }, []);
  useDisposal(points);
  const clock = useRef(0);

  useEffect(() => {
    (points.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [points, pixelRatio]);

  useFrame((_, delta) => {
    if (!still) clock.current += Math.min(delta, 0.05);
    const [x, y, z] = follow.current;
    for (let i = 0; i < count; i++) {
      const t = (clock.current * 0.45 + i / count) % 1;
      buffers.position.setXYZ(i, x, y + 0.5 + t * 2.4, z);
      buffers.alpha.setX(i, still ? (i === 1 ? 0.7 : 0) : Math.sin(t * Math.PI) * 0.8);
    }
    markPointsDirty(buffers);
  });

  return <primitive object={points} />;
}

/**
 * Safety: a trip crosses the city inside a calm protective field. The faint corridor is route
 * monitoring; rising pulses are the trip being shared live with trusted contacts.
 */
export default function SafetyScene({ tier, reducedMotion }: SafetySceneProps & BaseSceneProps) {
  const high = tier === 'high';
  const route = useMemo(() => safetyRoute(), []);
  const colors = useMemo(
    () => ({ driver: tokenColor('driver'), shield: tokenColor('shield'), route: tokenColor('route') }),
    [],
  );
  const streets = useMemo<LinePath[]>(() => {
    const paths: LinePath[] = [];
    for (let i = -6; i <= 6; i++) {
      paths.push({ points: [[i * STREET_SPACING, 0, -8], [i * STREET_SPACING, 0, 4]], color: colors.route, alpha: 0.5 });
    }
    for (let j = -6; j <= 3; j++) {
      paths.push({ points: [[-8, 0, j * STREET_SPACING], [8, 0, j * STREET_SPACING]], color: colors.route, alpha: 0.5 });
    }
    return paths;
  }, [colors]);

  const time = useSceneTime(reducedMotion ? TRIP.travel * 0.55 : undefined);
  const progress = useRef(0);
  const position = useRef<Vec3>([0, 0, 0]);

  useFrame(() => {
    const local = time.current % (TRIP.travel + TRIP.pause);
    progress.current = easeInOutCubic(Math.min(1, local / TRIP.travel));
  });

  return (
    <group>
      <fog attach="fog" args={[sceneColors.background, 8, 19]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 8, 6]} intensity={0.9} />
      <RouteNetwork paths={streets} />
      <Buildings density={high ? 'high' : 'low'} />
      <RouteRibbon points={route.points} width={0.9} color={colors.shield} opacity={0.07} softness={1} animate={false} />
      <RouteRibbon
        points={route.points}
        width={0.08}
        color={colors.driver}
        opacity={0.95}
        pulse={reducedMotion ? 0 : 0.6}
        pulseCount={4}
        pulseSpeed={0.2}
        animate={!reducedMotion}
        renderOrder={2}
      />
      <Vehicle path={route} progress={progress} color={colors.driver} size={high ? 18 : 15} position={position} />
      <ProtectiveField follow={position} color={colors.shield} still={reducedMotion}>
        <SceneLabel position={[0, 1.45, 0]} tone="info">
          Live trip · protected
        </SceneLabel>
      </ProtectiveField>
      <ShareSignal follow={position} still={reducedMotion} />
    </group>
  );
}
