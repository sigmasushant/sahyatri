# Sahyatri — website

Marketing website for **Sahyatri**, an AI-powered carpooling and shared-mobility platform.
Next.js 16 (App Router) · React 19 · TypeScript · three.js + React Three Fiber · CSS Modules on a
token-driven design system · Radix UI · Lucide · Zod · Vitest + Testing Library · Playwright.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap,
Open Graph). Optional `EARLY_ACCESS_WEBHOOK_URL` / `CONTACT_WEBHOOK_URL` receive validated form
submissions server-side; without them, submissions are validated and discarded.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run check` | typecheck + lint + unit tests |
| `npm test` | Vitest unit and component tests |
| `npm run test:e2e` | Playwright against a production server (`npm run build` first). Set `PW_CHANNEL=chrome` to use an installed Chrome instead of downloading browsers. |
| `npm run snapshot -- <url> <outPrefix> …` | design-review screenshots with GPU WebGL (`scripts/visual-snapshot.mjs`) |
| `node scripts/perf-audit.mjs <baseUrl> [paths…]` | lab LCP / CLS / TBT / bytes on a throttled phone and desktop |

Append `?webgl=off|low|high` to any URL to force a 3D device tier.

## Where things live

- **Design tokens** — `src/design-system/tokens/*` (single source of truth; the web adapter turns
  them into CSS variables). Reusable by the React Native app as-is.
- **Site facts** — `src/config/site.ts` (store links, social profiles: empty until real).
- **Content** — `src/data/*` (navigation, features, FAQ, testimonials, routes).
- **3D** — `src/components/three/*` (see `docs/04-threejs-concept.md`).
- **Security headers / CSP** — `src/config/security.ts`.

## Documentation

1. [Brand & design system](docs/01-brand-system.md)
2. [Information architecture](docs/02-information-architecture.md)
3. [Homepage structure & wireframe](docs/03-homepage-wireframe.md)
4. [Three.js visual concept](docs/04-threejs-concept.md)
5. [Component architecture](docs/05-component-architecture.md)
6. [Responsive system](docs/06-responsive-system.md)
7. [Release checklists — accessibility, performance, security, content](docs/07-release-checklists.md)

## Content rules

The site never invents metrics, customers, partners, investors, ratings, testimonials or
certifications. Demo numbers are labelled illustrative. Legal pages are drafts pending counsel.

Font: Manrope, © The Manrope Project Authors, SIL Open Font License 1.1 (`src/app/fonts/OFL.txt`).
# sahyatri
