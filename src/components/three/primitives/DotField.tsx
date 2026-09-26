'use client';

import { useEffect, useMemo } from 'react';
import { Color, Points } from 'three';
import { smoothstep, type Vec2 } from '../lib/geometry';
import { createPointsBuffers } from '../lib/buffers';
import { useDisposal, usePixelRatio } from '../lib/hooks';
import { createPointsMaterial, tokenColor } from '../lib/materials';

interface DotFieldProps {
  /** World-space extents: [minX, maxX] and [minZ, maxZ]. */
  x: Vec2;
  z: Vec2;
  spacing: number;
  height: (x: number, z: number) => number;
  /** Centre of the visible "world"; dots fade out with distance from it. */
  center: Vec2;
  radius: number;
  /** Dots near these points are brighter, suggesting settlements. */
  hotspots?: Vec2[];
  size?: number;
  opacity?: number;
}

/** The ground: a curved field of fine dots that fades into the dark at its horizon. */
export function DotField({ x, z, spacing, height, center, radius, hotspots = [], size = 2.1, opacity = 1 }: DotFieldProps) {
  const pixelRatio = usePixelRatio();
  const [x0, x1] = x;
  const [z0, z1] = z;
  const [cx, cz] = center;

  // `height` and `hotspots` must be stable references (module constants or memoised).
  const points = useMemo(() => {
    const columns = Math.floor((x1 - x0) / spacing);
    const rows = Math.floor((z1 - z0) / spacing);
    const buffers = createPointsBuffers(columns * rows, false);
    const base = tokenColor('dot');
    const bright = tokenColor('node');
    const color = new Color();
    let i = 0;
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const px = x0 + c * spacing + (r % 2) * spacing * 0.5;
        const pz = z0 + r * spacing;
        const d = Math.hypot(px - cx, pz - cz);
        const fade = 1 - smoothstep(radius * 0.45, radius, d);
        let heat = 0;
        for (const [hx, hz] of hotspots) heat = Math.max(heat, 1 - smoothstep(0.1, 0.75, Math.hypot(px - hx, pz - hz)));
        color.copy(base).lerp(bright, heat * 0.35);
        buffers.position.setXYZ(i, px, height(px, pz), pz);
        buffers.color.setXYZ(i, color.r, color.g, color.b);
        buffers.size.setX(i, size * (1 + heat * 0.5));
        buffers.alpha.setX(i, fade * (0.75 + heat * 0.25));
        i++;
      }
    }
    buffers.geometry.setDrawRange(0, i);
    const object = new Points(buffers.geometry, createPointsMaterial({ crisp: true }));
    object.frustumCulled = false;
    return object;
  }, [x0, x1, z0, z1, cx, cz, spacing, radius, size, height, hotspots]);
  useDisposal(points);

  useEffect(() => {
    const material = points.material as ReturnType<typeof createPointsMaterial>;
    material.uniforms.uPixelRatio!.value = pixelRatio;
    material.uniforms.uOpacity!.value = opacity;
  }, [points, pixelRatio, opacity]);

  return <primitive object={points} />;
}
