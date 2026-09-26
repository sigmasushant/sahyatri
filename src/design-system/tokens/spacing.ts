/** Spacing on a 4px base. Values are px; the web converts them to rem. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

/** Named aliases for the most common gaps. */
export const spacing = {
  xs: space[2],
  sm: space[3],
  md: space[4],
  lg: space[6],
  xl: space[10],
  xxl: space[16],
} as const;

/** Layout tokens. Fluid values interpolate between `min` and `max` like type does. */
export const layout = {
  containerMax: 1320,
  containerNarrow: 880,
  headerHeight: 64,
  gutter: { min: 20, max: 48 },
  sectionY: { min: 88, max: 168 },
  stackGap: { min: 40, max: 72 },
} as const;
