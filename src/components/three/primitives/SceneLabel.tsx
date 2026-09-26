'use client';

import { Html } from '@react-three/drei';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { Vec3 } from '../lib/geometry';
import styles from '../SceneCanvas.module.css';

interface SceneLabelProps {
  position: Vec3;
  tone?: 'neutral' | 'accent' | 'info';
  children: ReactNode;
}

/** A small DOM label pinned to a 3D position. Decorative: the section text carries the meaning. */
export function SceneLabel({ position, tone = 'neutral', children }: SceneLabelProps) {
  return (
    <Html position={position} center zIndexRange={[2, 0]} aria-hidden="true">
      <span className={cn(styles.label, tone === 'accent' && styles.labelAccent, tone === 'info' && styles.labelInfo)}>
        {children}
      </span>
    </Html>
  );
}
