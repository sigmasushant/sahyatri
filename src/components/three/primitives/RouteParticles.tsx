'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Points, type Color } from 'three';
import { createPointsBuffers, markPointsDirty } from '../lib/buffers';
import { mulberry32, type SampledPath, type Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio } from '../lib/hooks';
import { createPointsMaterial } from '../lib/materials';

interface RouteParticlesProps {
  paths: SampledPath[];
  count: number;
  /** Lime (drivers) for most, cyan (passengers) for `passengerShare` of them. */
  driverColor: Color;
  passengerColor: Color;
  passengerShare?: number;
  /** World units per second. */
  speed?: [number, number];
  /** Points per particle, including the head. */
  trail?: number;
  trailSpacing?: number;
  size?: number;
  lift?: number;
  frozen?: boolean;
  seed?: number;
  /** Only paths with an index below this value carry travellers (for networks that grow). */
  maxPath?: { current: number };
}

interface Particle {
  path: number;
  t: number;
  speed: number;
  direction: 1 | -1;
  passenger: boolean;
  scale: number;
}

/** Travellers flowing along routes, each with a short comet trail. */
export function RouteParticles({
  paths,
  count,
  driverColor,
  passengerColor,
  passengerShare = 0.3,
  speed = [0.35, 0.8],
  trail = 4,
  trailSpacing = 0.07,
  size = 9,
  lift = 0.02,
  frozen = false,
  seed = 5,
  maxPath,
}: RouteParticlesProps) {
  const pixelRatio = usePixelRatio();
  const random = useMemo(() => mulberry32(seed), [seed]);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, () => ({
        path: Math.floor(random() * paths.length),
        t: random(),
        speed: speed[0] + random() * (speed[1] - speed[0]),
        direction: random() > 0.5 ? 1 : -1,
        passenger: random() < passengerShare,
        scale: 0.8 + random() * 0.4,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, paths, passengerShare, random],
  );

  const { points, buffers } = useMemo(() => {
    const buffers = createPointsBuffers(count * trail);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    object.renderOrder = 3;
    return { points: object, buffers };
     
  }, [count, trail]);
  useDisposal(points);

  useEffect(() => {
    (points.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [points, pixelRatio]);

  const scratch = useMemo<Vec3>(() => [0, 0, 0], []);

  const write = () => {
    particles.forEach((particle, i) => {
      const path = paths[particle.path]!;
      const color = particle.passenger ? passengerColor : driverColor;
      const allowed = !maxPath || particle.path < maxPath.current;
      const fade = allowed ? Math.sin(Math.min(1, Math.max(0, particle.t)) * Math.PI) ** 0.6 : 0;
      for (let k = 0; k < trail; k++) {
        const index = i * trail + k;
        const t = particle.t - (k * trailSpacing) / Math.max(0.5, path.length);
        const along = particle.direction === 1 ? t : 1 - t;
        path.at(along, scratch);
        buffers.position.setXYZ(index, scratch[0], scratch[1] + lift, scratch[2]);
        buffers.color.setXYZ(index, color.r, color.g, color.b);
        const falloff = 1 - k / trail;
        buffers.size.setX(index, size * particle.scale * (k === 0 ? 1 : 0.35 + 0.5 * falloff));
        buffers.alpha.setX(index, (frozen && k > 0 ? 0 : fade * falloff ** 1.6) * (t < 0 || t > 1 ? 0 : 1));
      }
    });
    markPointsDirty(buffers, { color: true, size: true });
  };

  useEffect(write);

  useFrame((_, delta) => {
    if (frozen) return;
    const dt = Math.min(delta, 0.05);
    for (const particle of particles) {
      const path = paths[particle.path]!;
      particle.t += (particle.speed * dt) / Math.max(0.5, path.length);
      if (particle.t > 1 + (trail * trailSpacing) / Math.max(0.5, path.length)) {
        const available = maxPath ? Math.max(1, Math.min(paths.length, Math.floor(maxPath.current))) : paths.length;
        particle.path = Math.floor(random() * available);
        particle.t = 0;
        particle.direction = random() > 0.5 ? 1 : -1;
      }
    }
    write();
  });

  return <primitive object={points} />;
}
