'use client';

import { useSyncExternalStore } from 'react';
import {
  classifyDevice,
  lowerTier,
  readCapabilitySignals,
  tierOverride,
  type DeviceTier,
} from '@/lib/device-capability';

let detected: DeviceTier | null = null;
/** Runtime ceiling: lowered when a scene reports sustained poor frame rates or a lost context. */
let ceiling: DeviceTier = 'high';
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DeviceTier | null {
  return detected === null ? null : lowerTier(detected, ceiling);
}

/**
 * Probe the device (this creates a short-lived WebGL context, so it is not free).
 * Called from an idle callback once a scene is about to be needed, never during hydration.
 */
export function detectDeviceTier() {
  if (detected !== null) return;
  detected = tierOverride(window.location.search) ?? classifyDevice(readCapabilitySignals());
  notify();
}

/** Downgrade every scene on the page (Full WebGL → Reduced WebGL → Static). */
export function lowerDeviceTier(to: DeviceTier) {
  const next = lowerTier(ceiling, to);
  if (next === ceiling) return;
  ceiling = next;
  notify();
}

/** The device tier, or `null` until detection has run (and always during server rendering). */
export function useDeviceTier(): DeviceTier | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
