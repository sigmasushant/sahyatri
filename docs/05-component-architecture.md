# 05 · Component architecture

```
src/
├── app/                    routes, metadata, error/loading states, SEO files, API routes
│   ├── api/{early-access,contact}/route.ts
│   └── visuals/[file]/route.ts        build-time SVG versions of every 3D scene
├── components/
│   ├── layout/             Container, Section (+SectionIntro), SiteFooter, SkipLink,
│   │                       OfflineNotice, StatusScreen
│   ├── navigation/         SiteHeader, DesktopNav (Radix NavigationMenu), MobileMenu (Radix Dialog)
│   ├── sections/
│   │   ├── home/           one component per homepage section
│   │   ├── shared/         PageHero, FeatureSplit, FeatureSection, SceneFrame, CtaBand, ContactSection
│   │   ├── help/           HelpCenter (client-side search)
│   │   └── legal/          LegalPage
│   ├── forms/              EarlyAccessForm, ContactForm
│   ├── visuals/            illustrative product previews (DOM/SVG, CSS-animated)
│   ├── three/              SceneCanvas, SceneRenderer, SceneImage, registry, scenes/, primitives/,
│   │                       lib/ (geometry, layouts, materials, buffers, projection), fallbacks/
│   ├── seo/                JsonLd
│   └── ui/                 Button, Logo, Icon, Badge, Reveal, FeatureGrid/LinkCard, StepList,
│                           Accordion (Radix), Field (TextField, TextArea, SelectField, ChoiceGroup, Honeypot)
├── design-system/          tokens/ (colours, typography, spacing, radius, shadows, motion,
│                           breakpoints, z-index), css-variables.ts (web adapter), contrast.ts
├── hooks/                  useDeviceTier, usePrefersReducedMotion, useViewportPresence,
│                           useUserEngaged, useScrollProgress, useActiveSection, useOnlineStatus, useFormSubmit
├── lib/                    device-capability, seo (metadata + JSON-LD), validation (Zod),
│                           form-endpoint, cn
├── data/                   navigation, routes, features, faq, testimonials
├── config/                 site (facts, store links, social), security (CSP + headers)
└── styles/globals.css      reset, base typography, focus, reduced motion
```

## Server / client boundaries

Pages and sections are **server components**. Client components are small islands with a clear
reason:

| Client component | Why |
| --- | --- |
| `SiteHeader`, `DesktopNav`, `MobileMenu` | scroll state, adaptive tone, active section, menus |
| `SceneCanvas` (+ lazily `SceneRenderer`, scenes) | device tier, viewport presence, WebGL |
| `MatchingDemo`, `StepScroller`, `NetworkScroller`, `TechnologyExplorer` | state synced to 3D, scroll or hover |
| `Accordion`, `HelpCenter` | disclosure and search |
| `EarlyAccessForm`, `ContactForm` | validation, submission states |
| `OfflineNotice` | online/offline events |

Rules that keep bundles small:

- Icons are rendered on the server and passed to client components as elements, so the icon set
  never ships to the browser.
- Zod and the form schemas are imported only on first submit.
- Reveal-on-scroll is CSS scroll-driven animation: no JS, no hydration.
- Static scene illustrations are images, not inline SVG, so they are not duplicated into the RSC payload.
- three.js, R3F and drei live only in lazily loaded scene chunks.

## Styling

CSS Modules + CSS custom properties generated from the TypeScript tokens (inlined in `<head>` by
the root layout). `data-tone="light|dark"` on a section swaps every semantic colour underneath it.
Tests fail if a stylesheet contains a raw colour or a media query outside the token breakpoints.
Base styles that consumers may override use zero specificity (`:where()`), so overrides never
depend on stylesheet order.
