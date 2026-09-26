/**
 * Motion tokens. Motion is controlled, physical and purposeful: no bounce, no idle wobble.
 * Durations are ms; easings are cubic-bezier control points.
 */
export const easing = {
  /** Default for entrances and most UI transitions. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric moves between two states (crossfades, morphs). */
  inOut: [0.65, 0, 0.35, 1],
  /** Exits. */
  in: [0.55, 0, 1, 0.45],
} as const;

export const duration = {
  micro: 180,
  standard: 400,
  large: 800,
  scene: 1000,
} as const;

export const motion = {
  stagger: 70,
  distance: { sm: 8, md: 16, lg: 32 },
  hoverLift: 4,
} as const;

export const cubicBezier = (points: readonly number[]) => `cubic-bezier(${points.join(', ')})`;
