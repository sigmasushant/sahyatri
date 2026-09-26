'use client';

import { useEffect, useMemo } from 'react';
import { Group, Points } from 'three';
import { createPointsBuffers } from '../lib/buffers';
import type { Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio } from '../lib/hooks';
import { createPointsMaterial, tokenColor } from '../lib/materials';

export interface NodeSpec {
  position: Vec3;
  major?: boolean;
}

interface CityNodesProps {
  nodes: NodeSpec[];
  size?: number;
}

/** Places on the network: a crisp core and a soft halo per node, two draw calls in total. */
export function CityNodes({ nodes, size = 7 }: CityNodesProps) {
  const pixelRatio = usePixelRatio();

  const group = useMemo(() => {
    const coreBuffers = createPointsBuffers(nodes.length, false);
    const haloBuffers = createPointsBuffers(nodes.length, false);
    const core = tokenColor('node');
    const halo = tokenColor('driver');
    nodes.forEach((node, i) => {
      const [x, y, z] = node.position;
      coreBuffers.position.setXYZ(i, x, y + 0.02, z);
      coreBuffers.color.setXYZ(i, core.r, core.g, core.b);
      coreBuffers.size.setX(i, node.major ? size * 1.5 : size);
      coreBuffers.alpha.setX(i, node.major ? 1 : 0.85);
      haloBuffers.position.setXYZ(i, x, y + 0.02, z);
      haloBuffers.color.setXYZ(i, halo.r, halo.g, halo.b);
      haloBuffers.size.setX(i, node.major ? size * 7 : size * 3.6);
      haloBuffers.alpha.setX(i, node.major ? 0.34 : 0.12);
    });
    const haloPoints = new Points(haloBuffers.geometry, createPointsMaterial());
    const corePoints = new Points(coreBuffers.geometry, createPointsMaterial({ crisp: true }));
    haloPoints.renderOrder = 2;
    corePoints.renderOrder = 4;
    haloPoints.frustumCulled = false;
    corePoints.frustumCulled = false;
    const object = new Group();
    object.add(haloPoints, corePoints);
    return object;
  }, [nodes, size]);
  useDisposal(group);

  useEffect(() => {
    group.children.forEach((child) => {
      ((child as Points).material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
    });
  }, [group, pixelRatio]);

  return <primitive object={group} />;
}
