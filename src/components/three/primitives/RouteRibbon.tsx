'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Mesh, type ShaderMaterial } from 'three';
import { createRibbonGeometry } from '../lib/buffers';
import type { Vec3 } from '../lib/geometry';
import { useDisposal } from '../lib/hooks';
import { createRibbonMaterial, type RibbonOptions } from '../lib/materials';

interface RouteRibbonProps extends RibbonOptions {
  points: Vec3[];
  width: number;
  /** Receives the mesh so a scene can animate uniforms (uStart, uEnd, uOpacity) or morph the geometry. */
  onMesh?: (mesh: Mesh) => void;
  /** Advance the travelling pulse. */
  animate?: boolean;
  renderOrder?: number;
}

/** A glowing route: flat strip with soft edges, optional travelling pulse and draw-on window. */
export function RouteRibbon({ points, width, onMesh, animate = true, renderOrder = 1, ...material }: RouteRibbonProps) {
  const mesh = useMemo(() => {
    const object = new Mesh(createRibbonGeometry(points, width), createRibbonMaterial(material));
    object.frustumCulled = false;
    object.renderOrder = renderOrder;
    return object;
    // Material options are initial values; scenes animate uniforms directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, width]);
  useDisposal(mesh);

  useEffect(() => {
    onMesh?.(mesh);
  }, [mesh, onMesh]);

  useFrame((_, delta) => {
    if (!animate) return;
    (mesh.material as ShaderMaterial).uniforms.uTime!.value += Math.min(delta, 0.05);
  });

  return <primitive object={mesh} />;
}
