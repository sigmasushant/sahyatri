'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import { Group, Mesh, SphereGeometry, type Color } from 'three';
import type { Vec3 } from '../lib/geometry';
import { useDisposal } from '../lib/hooks';
import { createFieldMaterial } from '../lib/materials';
import { PulseRing } from './PulseRing';

interface ProtectiveFieldProps {
  /** Position to follow, updated by the scene each frame. */
  follow: { current: Vec3 };
  color: Color;
  radius?: number;
  still?: boolean;
  /** Rendered inside the moving group (e.g. a label that travels with the vehicle). */
  children?: ReactNode;
}

/** A calm protective dome with slow rings on the ground, travelling with the vehicle. */
export function ProtectiveField({ follow, color, radius = 0.95, still = false, children }: ProtectiveFieldProps) {
  const group = useRef<Group>(null);

  const dome = useMemo(
    () => new Mesh(new SphereGeometry(radius, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), createFieldMaterial({ color, opacity: 0.55 })),
    [radius, color],
  );
  useDisposal(dome);

  useFrame((_, delta) => {
    const [x, y, z] = follow.current;
    group.current?.position.set(x, y, z);
    if (!still) (dome.material as ReturnType<typeof createFieldMaterial>).uniforms.uTime!.value += Math.min(delta, 0.05);
  });

  return (
    <group ref={group}>
      <primitive object={dome} />
      <PulseRing position={[0, 0.01, 0]} radius={radius * 2.1} color={color} speed={0.32} opacity={0.55} still={still} />
      {children}
    </group>
  );
}
