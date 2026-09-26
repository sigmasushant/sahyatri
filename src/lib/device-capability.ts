/**
 * Device capability detection for the 3D layer.
 *
 *   high   → full WebGL scenes, higher particle counts, up to 1.75× DPR, 60 fps
 *   low    → reduced WebGL: fewer particles, 1.25× DPR, 30 fps cap, simpler scenes
 *   static → no WebGL; server-rendered SVG illustrations
 *
 * Classification is a pure function so it can be unit-tested; the browser-only signal
 * reader lives next to it.
 */

export type DeviceTier = 'high' | 'low' | 'static';

export interface CapabilitySignals {
  webgl: boolean;
  /** Unmasked GPU renderer string, when the browser exposes it. */
  renderer: string | null;
  cores: number | null;
  /** Approximate device memory in GB (Chromium only). */
  memory: number | null;
  saveData: boolean;
  coarsePointer: boolean;
  viewportWidth: number;
}

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|microsoft basic render/i;

const TIER_RANK: Record<DeviceTier, number> = { static: 0, low: 1, high: 2 };

export function tierAtLeast(tier: DeviceTier, minimum: DeviceTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[minimum];
}

export function lowerTier(a: DeviceTier, b: DeviceTier): DeviceTier {
  return TIER_RANK[a] <= TIER_RANK[b] ? a : b;
}

export function classifyDevice(signals: CapabilitySignals): DeviceTier {
  if (!signals.webgl) return 'static';
  if (signals.renderer && SOFTWARE_RENDERER.test(signals.renderer)) return 'static';
  if (signals.saveData) return 'static';
  if (signals.memory !== null && signals.memory <= 2) return 'static';
  if (signals.cores !== null && signals.cores <= 2) return 'static';

  const constrained =
    signals.coarsePointer ||
    signals.viewportWidth < 768 ||
    (signals.memory !== null && signals.memory <= 4) ||
    (signals.cores !== null && signals.cores <= 4);

  return constrained ? 'low' : 'high';
}

/** QA override: `?webgl=off|low|high`. */
export function tierOverride(search: string): DeviceTier | null {
  const value = new URLSearchParams(search).get('webgl');
  if (value === 'off' || value === 'static') return 'static';
  if (value === 'low' || value === 'high') return value;
  return null;
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

export function readCapabilitySignals(): CapabilitySignals {
  const nav = navigator as NavigatorWithHints;
  let webgl = false;
  let renderer: string | null = null;

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (gl) {
      webgl = true;
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    webgl = false;
  }

  return {
    webgl,
    renderer,
    cores: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
    memory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    saveData: Boolean(nav.connection?.saveData),
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    viewportWidth: window.innerWidth,
  };
}
