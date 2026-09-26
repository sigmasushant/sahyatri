'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Points, type Color } from 'three';
import { createPointsBuffers, markPointsDirty } from '../lib/buffers';
import type { SampledPath, Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio } from '../lib/hooks';
import { createPointsMaterial } from '../lib/materials';

interface VehicleProps {
  path: SampledPath;
  /** 0–1 along the path; outside that range the vehicle is hidden. Written by the scene. */
  progress: { current: number };
  color: Color;
  size?: number;
  trail?: number;
  trailSpacing?: number;
  lift?: number;
  /** Also exposes the current head position, e.g. for a protective field to follow. */
  position?: { current: Vec3 };
}

/** One traveller moving along a known route: a bright head with a fading trail. */
export function Vehicle({ path, progress, color, size = 16, trail = 10, trailSpacing = 0.05, lift = 0.05, position }: VehicleProps) {
  const pixelRatio = usePixelRatio();
  const { points, buffers } = useMemo(() => {
    const buffers = createPointsBuffers(trail);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    object.renderOrder = 5;
    return { points: object, buffers };
     
  }, [trail]);
  useDisposal(points);

  useEffect(() => {
    (points.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [points, pixelRatio]);

  const scratch = useMemo<Vec3>(() => [0, 0, 0], []);

  useFrame(() => {
    const t = progress.current;
    const visible = t >= 0 && t <= 1;
    for (let k = 0; k < trail; k++) {
      const tk = t - (k * trailSpacing) / Math.max(0.5, path.length);
      path.at(tk, scratch);
      buffers.position.setXYZ(k, scratch[0], scratch[1] + lift, scratch[2]);
      buffers.color.setXYZ(k, color.r, color.g, color.b);
      const falloff = 1 - k / trail;
      buffers.size.setX(k, k === 0 ? size : size * (0.25 + 0.45 * falloff));
      buffers.alpha.setX(k, visible && tk >= 0 ? (k === 0 ? 1 : falloff ** 1.5 * 0.8) : 0);
      if (k === 0 && position) path.at(Math.min(1, Math.max(0, t)), position.current);
    }
    markPointsDirty(buffers, { color: true, size: true });
  });

  return <primitive object={points} />;
}
