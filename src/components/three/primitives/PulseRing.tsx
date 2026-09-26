'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PlaneGeometry, type Color } from 'three';
import type { Vec3 } from '../lib/geometry';
import { useDisposal } from '../lib/hooks';
import { createPulseRingMaterial } from '../lib/materials';

interface PulseRingProps {
  position: Vec3;
  radius: number;
  color: Color;
  speed?: number;
  opacity?: number;
  core?: number;
  /** Freeze the rings (reduced motion). */
  still?: boolean;
  /** Optional per-frame opacity multiplier, e.g. to fade a ring in on a timeline. */
  intensity?: { current: number };
}

/** Concentric rings expanding across the ground: a live, active place. */
export function PulseRing({ position, radius, color, speed = 0.45, opacity = 0.8, core = 0, still, intensity }: PulseRingProps) {
  const mesh = useMemo(() => {
    const object = new Mesh(new PlaneGeometry(radius * 2, radius * 2), createPulseRingMaterial({ color, speed, core }));
    object.rotation.x = -Math.PI / 2;
    return object;
  }, [radius, color, speed, core]);
  useDisposal(mesh);

  useFrame((_, delta) => {
    const material = mesh.material as ReturnType<typeof createPulseRingMaterial>;
    if (!still) material.uniforms.uTime!.value += Math.min(delta, 0.05);
    material.uniforms.uOpacity!.value = opacity * (intensity ? intensity.current : 1);
  });

  return <primitive object={mesh} position={position} />;
}
