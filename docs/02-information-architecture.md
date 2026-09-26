# 02 · Information architecture

## Sitemap

```
/                     Home — the primary conversion experience
├── /how-it-works     Passenger + driver flows, how matching decides, payments, FAQ
├── /safety           Before/during/after, eight-layer toolkit, SOS, FAQ
├── /passengers       For passengers: five steps, what you see before booking, commute
├── /drivers          For drivers: five steps, control, cost sharing, requirements
├── /business         Corporate mobility + contact form (topic: business)
├── /universities     Campus mobility + contact form (topic: universities)
├── /technology       Five technologies (interactive), responsible AI, security
├── /about            Mission, principles, status, press
├── /careers          How we work, open roles (honest empty state)
├── /help             Searchable help centre + support form
├── /contact          General contact form (topic via ?topic=…)
├── /privacy          Draft policy (incl. #cookies)
├── /terms            Draft terms
└── /login            Explains accounts live in the app (noindex)

API
├── POST /api/early-access
└── POST /api/contact

Generated
├── /sitemap.xml  /robots.txt  /manifest.webmanifest
├── /icon.svg  /apple-icon  /opengraph-image
└── /visuals/<scene>.svg   static versions of every 3D scene
```

`src/data/routes.ts` is the source for the sitemap and the end-to-end smoke tests.

## Navigation

Desktop: `Logo · Product ▾ · How it works · Safety · For Business · For Universities · About ·
Log in · [Get the app]`. *Product* opens For passengers / For drivers / Technology.

Mobile: `Logo … ☰` → full-screen dark sheet with every destination and both CTAs.

The header is transparent over the dark heroes and becomes a translucent bar that takes the tone
of the section beneath it. On the homepage a lime dot marks the nav item whose section is in view;
on other pages it marks the current page (`aria-current`).

## Calls to action

| CTA | Destination | Notes |
| --- | --- | --- |
| Get the app / Get early access / Join the network | `/#get-the-app` | Store links appear automatically once `siteConfig.appStores` is set; until then the early-access form converts. |
| Find a ride | `/passengers` | from home and nav |
| Offer a seat / Offer a ride | `/drivers` | from home and nav |
| Explore how it works | `#how-it-works` / `/how-it-works` | secondary everywhere |
| Explore business mobility / For universities | page + `#contact` | pre-selects the form topic |

## Page template

Every product page: dark `PageHero` (breadcrumb JSON-LD) → alternating light/dark content
sections built from shared blocks (`FeatureSplit`, `FeatureSection`, `SceneFrame`, product
previews) → FAQ subset where useful → `CtaBand` or a contact section.
