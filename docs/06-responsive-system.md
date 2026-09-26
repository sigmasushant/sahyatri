# 06 · Responsive system

## Breakpoints (`tokens/breakpoints.ts`)

| Token | Min width | Used for |
| --- | --- | --- |
| sm | 480px | small refinements |
| md | 768px | two-column grids, header CTA, tablet layouts |
| lg | 1024px | full navigation, side-by-side layouts, sticky visuals, full-bleed hero canvas |
| xl | 1280px | "Log in" link in the header |
| xxl | 1440px | design reference width |

Device classes for design review: **mobile 320–767 · tablet 768–1439 · desktop 1440+**.
Media queries may only use these values (enforced by `tokens.test.ts`).

## Fluid, not stepped

Type, section padding, gutters and stack gaps interpolate between 375px and 1440px with `clamp()`,
so layouts stay proportionate between breakpoints rather than jumping.

## Mobile is designed, not shrunk

- **Hero:** message first; the 3D network sits in a contained, masked band below the CTAs (never
  full screen) with its own centred camera, and starts only after the visitor interacts.
- **3D everywhere:** canvases narrower than 768px or taller than wide use compact framings;
  compact static illustrations (`*-compact.svg`) are served with `<picture>` for phones.
- **Heavier scenes** (safety city, seats, technology formations, ambient CTA) stay as static
  illustrations on the reduced tier.
- **How it works:** each step carries its own preview inline instead of the desktop sticky stage.
- **Matching:** the score panel stacks under the visual instead of floating over it.
- **Navigation:** full-screen sheet with 56px rows; CTAs pinned at the bottom.
- **Targets:** interactive elements are at least 44×44px; forms use correct `inputmode` and
  `autocomplete`.
- **Safe areas:** fixed UI respects `env(safe-area-inset-bottom)`.
