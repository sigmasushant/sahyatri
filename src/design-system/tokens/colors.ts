/**
 * Colour tokens — the single source of truth for every surface of the brand
 * (website, React Native app, dashboards, email, social).
 *
 * Three layers:
 *   1. `palette`     raw, platform-agnostic hex values. Never used directly in UI code.
 *   2. `tones`       semantic roles per surface tone. UI code only uses these (as CSS variables on the web).
 *   3. `sceneColors` colours for visualisations and 3D scenes, where colour carries meaning:
 *                    lime = drivers / offered seats, cyan = passengers / demand, white = a match.
 */

export const palette = {
  midnight: {
    950: '#050A12',
    900: '#07111F',
    850: '#0A1726',
    800: '#0E1D30',
    700: '#16283F',
    600: '#223750',
    500: '#344A66',
  },
  ink: '#08111C',
  slate: {
    600: '#52606D',
    500: '#5E6A79',
    400: '#7D8A97',
    300: '#A7B3BF',
    200: '#CBD3DA',
  },
  paper: {
    0: '#FFFFFF',
    50: '#F7F9F6',
    100: '#EEF2EC',
    200: '#E2E8E0',
  },
  frost: '#EEF3EE',
  lime: {
    200: '#E4FBB8',
    300: '#CDF785',
    400: '#B8F34A',
    700: '#3E6E08',
  },
  cyan: {
    300: '#94E5FF',
    400: '#55D6FF',
    700: '#0A6C8C',
  },
  red: {
    400: '#FF6B6F',
    600: '#C2373C',
  },
} as const;

export type ToneName = 'light' | 'dark';

export interface ToneColors {
  /** Page / section background. */
  bg: string;
  /** Cards, popovers and inputs that sit on `bg`. */
  bgElevated: string;
  /** Quiet alternate background for bands and wells. */
  bgSubtle: string;
  fg: string;
  fgSecondary: string;
  /** Lowest-emphasis text that still meets WCAG AA on `bg`. */
  fgMuted: string;
  border: string;
  borderStrong: string;
  /** Brand accent used as a fill (badges, indicators, the primary action on dark). */
  accent: string;
  onAccent: string;
  /** Accent-coloured text that meets AA on `bg`. */
  accentText: string;
  /** Secondary accent text (passenger / live information). */
  infoText: string;
  /** Primary action fill for this tone. */
  primary: string;
  primaryHover: string;
  onPrimary: string;
  /** Focus ring colour, ≥ 3:1 against `bg`. */
  focus: string;
  danger: string;
}

export const tones: Record<ToneName, ToneColors> = {
  light: {
    bg: palette.paper[50],
    bgElevated: palette.paper[0],
    bgSubtle: palette.paper[100],
    fg: palette.ink,
    fgSecondary: palette.slate[600],
    fgMuted: palette.slate[500],
    border: 'rgba(8, 17, 28, 0.10)',
    borderStrong: 'rgba(8, 17, 28, 0.18)',
    accent: palette.lime[400],
    onAccent: palette.midnight[900],
    accentText: palette.lime[700],
    infoText: palette.cyan[700],
    primary: palette.midnight[900],
    primaryHover: palette.midnight[700],
    onPrimary: palette.paper[50],
    focus: palette.midnight[900],
    danger: palette.red[600],
  },
  dark: {
    bg: palette.midnight[950],
    bgElevated: palette.midnight[850],
    bgSubtle: palette.midnight[900],
    fg: palette.frost,
    fgSecondary: palette.slate[300],
    fgMuted: palette.slate[400],
    border: 'rgba(238, 243, 238, 0.10)',
    borderStrong: 'rgba(238, 243, 238, 0.18)',
    accent: palette.lime[400],
    onAccent: palette.midnight[900],
    accentText: palette.lime[400],
    infoText: palette.cyan[400],
    primary: palette.lime[400],
    primaryHover: palette.lime[300],
    onPrimary: palette.midnight[900],
    focus: palette.lime[400],
    danger: palette.red[400],
  },
};

/** Colours with product meaning inside visualisations (3D scenes, SVG fallbacks, product UI mocks). */
export const sceneColors = {
  background: palette.midnight[950],
  ground: palette.midnight[800],
  dot: palette.midnight[500],
  route: palette.midnight[500],
  node: '#C9D8E6',
  driver: palette.lime[400],
  passenger: palette.cyan[400],
  match: '#F4FFE6',
  shield: palette.cyan[300],
  alert: palette.red[400],
  building: palette.midnight[800],
  buildingTop: palette.midnight[600],
} as const;

export type SceneColor = keyof typeof sceneColors;
