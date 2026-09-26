'use client';

import { useMemo } from 'react';
import { LineSegments } from 'three';
import { createLinesGeometry, type LinePath } from '../lib/buffers';
import { useDisposal } from '../lib/hooks';
import { createLinesMaterial } from '../lib/materials';

interface RouteNetworkProps {
  paths: LinePath[];
  opacity?: number;
  additive?: boolean;
}

/** Every background route in one draw call: fine lines that taper at their ends. */
export function RouteNetwork({ paths, opacity = 1, additive = true }: RouteNetworkProps) {
  const lines = useMemo(() => {
    const material = createLinesMaterial({ additive });
    material.uniforms.uOpacity!.value = opacity;
    const object = new LineSegments(createLinesGeometry(paths), material);
    object.frustumCulled = false;
    return object;
  }, [paths, opacity, additive]);
  useDisposal(lines);

  return <primitive object={lines} />;
}
