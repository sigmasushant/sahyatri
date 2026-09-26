'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Points, type Color } from 'three';
import { createPointsBuffers, markPointsDirty } from '../lib/buffers';
import type { Vec3 } from '../lib/geometry';
import { usePixelRatio, useDisposal, useSceneTime } from '../lib/hooks';
import {
  formationCount,
  formationPoint,
  formationSeeds,
  type FormationColor,
  type FormationPoint,
} from '../lib/layouts';
import { createPointsMaterial, tokenColor } from '../lib/materials';
import type { BaseSceneProps, TechnologySceneProps } from '../types';

/**
 * One particle system that re-forms for each technology: two streams merging (matching),
 * verification rings, a shielded route (safety), live traffic lanes (real-time) and an
 * isolated anomaly (fraud protection). Points glide between formations.
 */
export default function TechnologyScene({ tier, reducedMotion, mode }: TechnologySceneProps & BaseSceneProps) {
  const count = formationCount[tier];
  const pixelRatio = usePixelRatio();
  const seeds = useMemo(() => formationSeeds(count), [count]);
  const palette = useMemo<Record<FormationColor, Color>>(
    () => ({
      driver: tokenColor('driver'),
      passenger: tokenColor('passenger'),
      match: tokenColor('match'),
      node: tokenColor('node'),
      shield: tokenColor('shield'),
      alert: tokenColor('alert'),
      route: tokenColor('route'),
    }),
    [],
  );

  const { points, buffers } = useMemo(() => {
    const buffers = createPointsBuffers(count);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    return { points: object, buffers };
     
  }, [count]);
  useDisposal(points);

  useEffect(() => {
    (points.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [points, pixelRatio]);

  // With reduced motion the canvas renders on demand: redraw once per formation change.
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [mode, invalidate]);

  const time = useSceneTime(reducedMotion ? 4 : undefined);
  const group = useRef<Group>(null);
  const initialised = useRef(false);
  const target = useMemo<FormationPoint>(() => ({ position: [0, 0, 0] as Vec3, color: 'node', size: 4, alpha: 1 }), []);

  useFrame((_, delta) => {
    const t = time.current;
    const ease = reducedMotion || !initialised.current ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 3.2);
    for (let i = 0; i < count; i++) {
      formationPoint(mode, i, count, t, seeds, target);
      const [x, y, z] = target.position;
      const color = palette[target.color];
      buffers.position.setXYZ(
        i,
        buffers.position.getX(i) + (x - buffers.position.getX(i)) * ease,
        buffers.position.getY(i) + (y - buffers.position.getY(i)) * ease,
        buffers.position.getZ(i) + (z - buffers.position.getZ(i)) * ease,
      );
      buffers.color.setXYZ(
        i,
        buffers.color.getX(i) + (color.r - buffers.color.getX(i)) * ease,
        buffers.color.getY(i) + (color.g - buffers.color.getY(i)) * ease,
        buffers.color.getZ(i) + (color.b - buffers.color.getZ(i)) * ease,
      );
      buffers.size.setX(i, buffers.size.getX(i) + (target.size * 1.7 - buffers.size.getX(i)) * ease);
      buffers.alpha.setX(i, buffers.alpha.getX(i) + (target.alpha - buffers.alpha.getX(i)) * ease);
    }
    initialised.current = true;
    markPointsDirty(buffers, { color: true, size: true });
    if (group.current && !reducedMotion) group.current.rotation.y = Math.sin(t * 0.12) * 0.18;
  });

  return (
    <group ref={group}>
      <primitive object={points} />
    </group>
  );
}
