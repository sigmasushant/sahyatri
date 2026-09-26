/**
 * Typography tokens. One typeface (Manrope), four weights, one fluid scale.
 * Sizes are px at the smallest (`min`) and largest (`max`) layout widths; the web interpolates
 * between them with clamp(). Native apps use `min` on phones and `max` on tablets.
 */

export const fontFamily = {
  sans: 'Manrope',
  fallback: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export interface TypeStyle {
  /** Size in px at the minimum fluid width. */
  min: number;
  /** Size in px at the maximum fluid width. */
  max: number;
  lineHeight: number;
  /** Tracking in em. */
  letterSpacing: number;
  weight: (typeof fontWeight)[keyof typeof fontWeight];
  uppercase?: boolean;
}

export const typeScale = {
  display: { min: 44, max: 108, lineHeight: 0.96, letterSpacing: -0.045, weight: 600 },
  h1: { min: 40, max: 76, lineHeight: 1.0, letterSpacing: -0.04, weight: 600 },
  h2: { min: 34, max: 56, lineHeight: 1.06, letterSpacing: -0.035, weight: 600 },
  h3: { min: 24, max: 34, lineHeight: 1.15, letterSpacing: -0.025, weight: 600 },
  h4: { min: 19, max: 22, lineHeight: 1.3, letterSpacing: -0.015, weight: 600 },
  bodyLarge: { min: 18, max: 21, lineHeight: 1.55, letterSpacing: -0.01, weight: 400 },
  body: { min: 17, max: 18, lineHeight: 1.6, letterSpacing: -0.005, weight: 400 },
  small: { min: 14, max: 15, lineHeight: 1.5, letterSpacing: 0, weight: 400 },
  caption: { min: 12, max: 13, lineHeight: 1.4, letterSpacing: 0.01, weight: 500 },
  eyebrow: { min: 12, max: 13, lineHeight: 1.2, letterSpacing: 0.14, weight: 600, uppercase: true },
  button: { min: 15, max: 16, lineHeight: 1, letterSpacing: -0.005, weight: 600 },
} as const satisfies Record<string, TypeStyle>;

export type TypeStyleName = keyof typeof typeScale;

/** Viewport widths (px) over which fluid values interpolate. */
export const fluidRange = { minWidth: 375, maxWidth: 1440 } as const;
