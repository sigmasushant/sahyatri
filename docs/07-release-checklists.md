# 07 · Release checklists

Automated checks: `npm run check` (types, lint, unit tests) and `npm run test:e2e` (Playwright:
every route, keyboard navigation, mobile menu, forms, reduced motion, axe accessibility scan).

## Accessibility

- [x] Semantic landmarks (header, nav, main, footer) and one `h1` per page; logical heading order
- [x] Skip link to main content
- [x] Visible focus for keyboard users on every control (≥ 3:1, tested)
- [x] Text contrast ≥ 4.5:1 for every token pairing (tested in CI)
- [x] Accordion, menus and dialog follow WAI-ARIA patterns (Radix); keyboard tested
- [x] 3D visuals are single labelled images; all meaning is also in the text
- [x] Illustrative product previews are labelled images, never fake controls
- [x] Forms: labels, hints, inline errors linked with `aria-describedby`, focus moves to the first error,
      status messages announced
- [x] `prefers-reduced-motion`: CSS motion off, WebGL renders one static frame, scroll-driven section becomes static
- [x] Touch targets ≥ 44px
- [ ] Manual screen-reader pass (VoiceOver iOS/macOS, TalkBack, NVDA) before launch

## Performance

Measured on the production build (`npm run build && npm start`, Lighthouse 12):

| Page | Mobile perf | Desktop perf | Mobile TBT | CLS |
| --- | --- | --- | --- | --- |
| Home | 93 | 100 | 80 ms | 0 |
| Safety | 94 | 100 | 110 ms | 0 |
| Technology | 93 | — | 100 ms | 0 |
| For drivers | 92 | — | 210 ms | 0 |
| Help | 90 | — | 260 ms | 0 |

Accessibility, Best Practices and SEO: 100 on every audited page. Lighthouse's simulated mobile
LCP reads ~3 s because it charges async script downloads to the hero illustration; in the observed
trace the illustration paints with the first frame (LCP = FCP).

What makes it fast:

- Static generation for every page except `/contact`; inline CSS; self-hosted variable font (25 KB).
- ~195 KB gzipped JS baseline (≈150 KB is React + Next.js); our islands are small.
- three.js loads only in lazy scene chunks, after idle, and on phones only after interaction.
- 3D illustrations shipped as cached SVG images, never inlined.
- `content-visibility: auto` skips off-screen sections; reveals are compositor-only CSS.
- Offscreen canvases stop rendering; DPR caps and 30fps limiter on constrained devices.

Before release: re-run `node scripts/perf-audit.mjs <url>` and Lighthouse against the deployed URL,
check field data (CrUX / RUM) for LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Security

- [x] Strict security headers on every route (`config/security.ts`, tested): CSP locked to self,
      `frame-ancestors 'none'`, HSTS, nosniff, referrer policy, permissions policy, COOP
- [x] No secrets in client code; webhooks only via server env vars (`.env.example`)
- [x] Form endpoints: same-origin check, JSON only, size limit, Zod validation, silent honeypot
- [x] External links use `rel="noopener noreferrer"`; no third-party scripts or iframes
- [x] JSON-LD escapes `<`
- [ ] `npm audit` clean at release; dependency updates reviewed
- [ ] Rate limiting / bot protection at the edge (platform-level) for the two form endpoints
- [ ] Decide on nonce-based CSP: pages are static, so `script-src` currently allows `'unsafe-inline'`
      for Next.js bootstrap scripts. If the site ever renders user data, move to the nonce setup in
      `proxy.ts` (Next.js CSP guide), accepting dynamic rendering.

## Content & honesty

- [x] No invented metrics, customers, partners, investors, ratings, testimonials or certifications
- [x] Demo scores labelled "illustrative"; network visual labelled "not a map of current service areas"
- [x] Testimonials and careers show honest empty states until real content exists
- [ ] Legal counsel to finalise Privacy and Terms (both carry a visible draft notice)
- [ ] Add real store links and social profiles to `config/site.ts` when they exist
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin (canonical URLs, sitemap, OG)
