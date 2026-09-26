'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { BufferGeometry, Material, Object3D } from 'three';

function disposeObject(object: Object3D) {
  object.traverse((child) => {
    const mesh = child as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    materials.forEach((material) => material.dispose());
  });
}

/** Free an imperatively created object's GPU resources when it is replaced or unmounted. */
export function useDisposal(object: Object3D) {
  useEffect(() => () => disposeObject(object), [object]);
}

/**
 * Scene clock in seconds. Deltas are clamped so a paused scene resumes smoothly.
 * With `frozenAt`, time stays fixed (reduced motion shows one calm frame).
 */
export function useSceneTime(frozenAt?: number) {
  const time = useRef(frozenAt ?? 0);
  useEffect(() => {
    if (frozenAt !== undefined) time.current = frozenAt;
  }, [frozenAt]);
  useFrame((_, delta) => {
    if (frozenAt === undefined) time.current += Math.min(delta, 1 / 20);
  });
  return time;
}

/** Device pixel ratio the canvas renders at, for sizing points consistently. */
export function usePixelRatio(): number {
  return useThree((state) => state.viewport.dpr);
}
