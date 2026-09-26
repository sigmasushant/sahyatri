'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Group, LineSegments, Points, type Mesh, type ShaderMaterial } from 'three';
import { PulseRing } from '../primitives/PulseRing';
import { RouteParticles } from '../primitives/RouteParticles';
import { RouteRibbon } from '../primitives/RouteRibbon';
import { createLinesGeometry, createPointsBuffers, markPointsDirty, type LinePath } from '../lib/buffers';
import { SampledPath, easeOutCubic, phase, type Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio, useSceneTime } from '../lib/hooks';
import { networkCountAt, networkEdgeArc, networkLayout } from '../lib/layouts';
import { createLinesMaterial, createPointsMaterial, tokenColor } from '../lib/materials';
import type { BaseSceneProps, NetworkSceneProps } from '../types';

/**
 * Network effects, abstractly: one journey, then five places, twenty, and finally a network.
 * Scroll drives growth; once every place is connected, long journeys light up across it.
 */
export default function NetworkGrowthScene({ tier, reducedMotion, progress }: NetworkSceneProps & BaseSceneProps) {
  const high = tier === 'high';
  const pixelRatio = usePixelRatio();
  const layout = useMemo(() => networkLayout(high ? 150 : 72), [high]);
  const total = layout.nodes.length;
  const colors = useMemo(
    () => ({
      driver: tokenColor('driver'),
      passenger: tokenColor('passenger'),
      node: tokenColor('node'),
      route: tokenColor('route'),
      match: tokenColor('match'),
    }),
    [],
  );

  const arcs = useMemo(
    () => layout.edges.map(([a, b]) => networkEdgeArc(layout.nodes[a]!, layout.nodes[b]!, high ? 14 : 8)),
    [layout, high],
  );
  const travelPaths = useMemo(() => arcs.map((points) => new SampledPath(points)), [arcs]);
  const highlights = useMemo(
    () =>
      layout.highlights
        .filter((path) => path.length > 2)
        .map((path) =>
          path.slice(1).flatMap((node, i) => {
            const arc = networkEdgeArc(layout.nodes[path[i]!]!, layout.nodes[node]!, 12);
            return i === 0 ? arc : arc.slice(1);
          }),
        ),
    [layout],
  );

  const lines = useMemo(() => {
    const paths: LinePath[] = layout.edges.map(([, b], i) => ({
      points: arcs[i]!,
      color: colors.node,
      alpha: 0.4,
      reveal: layout.nodes[b]!.reveal,
    }));
    const object = new LineSegments(createLinesGeometry(paths, { reveal: true }), createLinesMaterial({ reveal: true }));
    object.frustumCulled = false;
    return object;
  }, [layout, arcs, colors]);
  useDisposal(lines);

  const { nodes, buffers } = useMemo(() => {
    const buffers = createPointsBuffers(total * 2);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    object.renderOrder = 4;
    layout.nodes.forEach((node, i) => {
      const first = i === 0;
      const core = first ? colors.driver : colors.node;
      buffers.position.setXYZ(i * 2, node.x, 0.02, node.z);
      buffers.color.setXYZ(i * 2, core.r, core.g, core.b);
      buffers.position.setXYZ(i * 2 + 1, node.x, 0.02, node.z);
      buffers.color.setXYZ(i * 2 + 1, colors.driver.r, colors.driver.g, colors.driver.b);
    });
    buffers.color.needsUpdate = true;
    return { nodes: object, buffers };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, colors]);
  useDisposal(nodes);

  useEffect(() => {
    (nodes.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [nodes, pixelRatio]);

  const group = useRef<Group>(null);
  const time = useSceneTime(reducedMotion ? 0 : undefined);
  const count = useRef(reducedMotion ? total : 1);
  const maxPath = useRef(0);
  const highlightMeshes = useRef<Mesh[]>([]);
  const addHighlight = useCallback((mesh: Mesh) => {
    if (!highlightMeshes.current.includes(mesh)) highlightMeshes.current.push(mesh);
  }, []);

  useFrame((_, delta) => {
    const target = reducedMotion ? total : networkCountAt(progress.current, total);
    count.current += (target - count.current) * (1 - Math.exp(-Math.min(delta, 0.1) * 4));
    const visible = count.current;

    (lines.material as ShaderMaterial).uniforms.uCount!.value = visible;
    // Edges are ordered by the node they reveal, so edge index i appears with node i + 1.
    maxPath.current = Math.max(0, visible - 1);

    layout.nodes.forEach((node, i) => {
      const grow = easeOutCubic(Math.min(1, Math.max(0, visible - node.reveal)));
      const first = i === 0;
      buffers.size.setX(i * 2, (first ? 13 : 7) * grow);
      buffers.alpha.setX(i * 2, grow);
      buffers.size.setX(i * 2 + 1, (first ? 60 : 26) * grow);
      buffers.alpha.setX(i * 2 + 1, (first ? 0.35 : 0.1) * grow);
    });
    markPointsDirty(buffers, { position: false, size: true });

    const illuminate = phase(visible, total * 0.82, total);
    highlightMeshes.current.forEach((mesh, k) => {
      const u = (mesh.material as ShaderMaterial).uniforms;
      u.uEnd!.value = easeOutCubic(phase(illuminate, k * 0.15, 0.7 + k * 0.15));
    });

    if (group.current && !reducedMotion) group.current.rotation.y = Math.sin(time.current * 0.05) * 0.12;
  });

  const origin: Vec3 = [layout.nodes[0]!.x, 0.01, layout.nodes[0]!.z];

  return (
    <group ref={group}>
      <primitive object={lines} />
      <primitive object={nodes} />
      <PulseRing position={origin} radius={1.1} color={colors.driver} opacity={0.7} still={reducedMotion} />
      {highlights.map((points, k) => (
        <RouteRibbon
          key={k}
          points={points}
          width={0.06}
          color={k === 1 ? colors.passenger : colors.driver}
          opacity={0.95}
          pulse={reducedMotion ? 0 : 0.8}
          pulseCount={3}
          head={0.6}
          onMesh={addHighlight}
          animate={!reducedMotion}
          renderOrder={3}
        />
      ))}
      <RouteParticles
        paths={travelPaths}
        count={high ? 90 : 36}
        driverColor={colors.driver}
        passengerColor={colors.passenger}
        passengerShare={0.4}
        speed={[0.5, 1.1]}
        trail={high ? 4 : 3}
        size={8}
        frozen={reducedMotion}
        maxPath={maxPath}
        seed={21}
      />
    </group>
  );
}
