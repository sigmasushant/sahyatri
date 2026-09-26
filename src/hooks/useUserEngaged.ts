'use client';

import { useSyncExternalStore } from 'react';

let engaged = false;
const listeners = new Set<() => void>();
const EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

function markEngaged() {
  if (engaged) return;
  engaged = true;
  EVENTS.forEach((event) => window.removeEventListener(event, markEngaged));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (!engaged && listeners.size === 0) {
    EVENTS.forEach((event) => window.addEventListener(event, markEngaged, { passive: true }));
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * `true` once the visitor has scrolled, tapped, clicked or pressed a key. Constrained devices
 * wait for this before starting WebGL, so page load is spent on content, not on 3D.
 */
export function useUserEngaged(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => engaged,
    () => false,
  );
}
