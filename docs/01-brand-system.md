# 01 · Brand & design system

The website is the first expression of a brand that will also run the React Native app, admin
dashboard, corporate portal, email and social. Everything below is implemented once, in
`src/design-system/tokens/*.ts`, and consumed everywhere else.

## Idea

**Sahyatri** means *co-traveller*. The brand says one thing: *two journeys, one shared road.*

- **Mark** — a single route joining an origin and a destination, in a lime tile. The same glyph is
  the app icon, favicon, Apple touch icon, OG image and social avatar (`components/ui/Logo.tsx`,
  `app/icon.svg`, `app/apple-icon.tsx`). It reuses the route glyph from the app prototype so the
  product and the site share an identity.
- **Wordmark** — `sahyatri`, lowercase, Manrope Bold, −0.04em tracking.

## Colour

Three layers (`tokens/colors.ts`):

| Layer | Purpose | Rule |
| --- | --- | --- |
| `palette` | raw hex values | never used directly in UI |
| `tones.light` / `tones.dark` | semantic roles (bg, fg, fgSecondary, fgMuted, accent, primary, focus…) | the only colours UI code uses, as CSS variables |
| `sceneColors` | colours with *meaning* in visualisations | lime = drivers / offered seats · cyan = passengers / demand · white = a match |

Core palette: Midnight `#07111F` (brand) · Deep night `#050A12` (dark surfaces) · Paper `#F7F9F6`
(light surfaces) · Electric lime `#B8F34A` (energy, action) · Sky cyan `#55D6FF` (passengers, live
information — used sparingly).

**Primary action rule:** the primary button is always the highest-contrast brand colour for its
surface — midnight on light sections, lime on dark ones. Secondary actions are outlined.

**Contrast is enforced, not hoped for:** `design-system/__tests__/tokens.test.ts` fails the build if
any text role drops below WCAG AA (4.5:1) on any background of its tone, or a focus ring below 3:1.
(It caught one: muted text on the subtle band was 4.45:1 and was darkened.)

## Typography

One typeface — **Manrope** (variable, self-hosted, OFL) — four weights (400/500/600/700) and one
fluid scale (`tokens/typography.ts`). Sizes interpolate between 375px and 1440px with `clamp()`:

| Style | Mobile → desktop | Use |
| --- | --- | --- |
| display | 44 → 108px | hero statements |
| h1 | 40 → 76px | page titles, big section statements |
| h2 | 34 → 56px | section titles |
| h3 | 24 → 34px | sub-sections |
| h4 | 19 → 22px | card and feature titles |
| body-large | 18 → 21px | leads |
| body | 17 → 18px | running text |
| small / caption | 14–15 / 12–13px | meta, labels |
| eyebrow | 12–13px, +0.14em, uppercase | section labels |

Headlines use tight negative tracking and balanced wrapping. Numbers in UI use tabular figures.

## Space, shape, depth, motion

- **Spacing:** 4px base scale plus named aliases (`xs…xxl`); fluid layout tokens for section
  padding, gutters and stack gaps.
- **Radius:** restrained cards (14–20px), pills only for buttons, chips and badges.
- **Shadow:** soft, midnight-tinted; borders do most of the separation work.
- **Motion** (`tokens/motion.ts`): ease-out `cubic-bezier(0.22, 1, 0.36, 1)`; micro 180ms,
  standard 400ms, large 800ms, scene 1000ms. No bounce, no idle wobble. Reduced motion is
  honoured everywhere (CSS, reveals and WebGL).

## Voice

Confident, clear, human, concise. Short declaratives ("Move together."), concrete benefits, no
superlatives. Honest by default: no invented metrics, customers, investors, testimonials,
certifications or absolute security claims. Demo numbers are labelled *illustrative*.

## Reuse outside the web

Tokens are plain TypeScript objects with px numbers and hex strings, so the React Native app can
import them directly (`typeScale.body.min` on phones, `.max` on tablets). The web adapter
(`design-system/css-variables.ts`) is the only place that knows about CSS.
