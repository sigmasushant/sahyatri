/**
 * Breakpoints (min-width, px). Device classes used in design reviews:
 *   mobile 320–767 · tablet 768–1439 · desktop 1440+
 * `lg` (1024) is where the full navigation and two-column layouts appear.
 *
 * CSS media queries cannot read custom properties, so stylesheets use these literal values.
 * `src/design-system/__tests__/token-usage.test.ts` fails the build if any other width is used.
 */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaQuery = (bp: Breakpoint) => `(min-width: ${breakpoints[bp]}px)`;
