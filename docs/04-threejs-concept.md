# 04 · Three.js visual concept

Every scene explains a product idea; none is decoration. Colour is semantic across all of them:
**lime = drivers / offered seats**, **cyan = passengers / demand**, **white = a match**.

| Scene (`components/three/scenes`) | Idea | What happens |
| --- | --- | --- |
| `MobilityNetwork` (hero, ambient CTA) | a connected world | A curved dot-field "small world" with city nodes and road-like routes. Lime and cyan travellers flow with comet trails; an example journey draws itself from Delhi to Jaipur, a vehicle travels it and Jaipur pulses on arrival. Gentle pointer parallax. |
| `MatchingScene` | intelligent matching | A passenger route appears (Gurgaon → Jaipur); four candidate driver routes are evaluated one by one; the best (Delhi → Jaipur) is selected; the passenger route morphs to meet it at a pickup point; driver and passenger then travel together. Phases drive the DOM panel (steps + illustrative scores). |
| `SafetyScene` | protection travels with you | A trip crosses a low, calm city inside a fresnel "protective field" with slow ground rings; a faint corridor is route monitoring; pulses rising from the car are the trip shared live. |
| `SeatsScene` | empty seats → shared journeys | A car on its published route; empty seats pulse until nearby travellers arc into them one by one; the label counts seats down to "Car full · costs shared". |
| `NetworkGrowthScene` | network effects | Scroll grows the network 1 → 5 → 20 → all; edges draw from older to newer places; long journeys then illuminate across it. Abstract — explicitly not a coverage map. |
| `TechnologyScene` | five systems | One particle system re-forms per technology: merging streams (matching), verification rings, a shielded route (safety), live lanes (real-time), an isolated anomaly (fraud). |

## Architecture

```
Section (server) ──▶ SceneCanvas (client, no three.js)
                      ├─ static <img> of /visuals/<scene>.svg   ← same layout + camera, from tokens
                      └─ when near + idle (+ engaged on low tier):
                         dynamic import SceneRenderer ──▶ lazy scene chunk
                         R3F <Canvas>: CameraRig · FrameLimiter · PerformanceMonitor · Scene · ReadySignal
                         crossfade to canvas after two presented frames
```

- **Shared layouts** (`lib/layouts.ts`, `lib/geometry.ts`) are pure, deterministic math used by both
  the WebGL scenes and the SVG fallbacks, so static and 3D versions match.
- **Primitives** (`primitives/`): `DotField`, `CityNodes`, `RouteNetwork` (all background routes in
  one draw call), `RouteRibbon` (glowing route strip with draw-on window + travelling pulse),
  `RouteParticles`, `Vehicle`, `PulseRing`, `ProtectiveField`, `SceneLabel`.
- **Materials** (`lib/materials.ts`): small custom shaders (glow points, ribbons, reveal lines, pulse
  rings, fresnel field) with colours from the tokens and correct colour-space output.

## Tiers and fallbacks

`lib/device-capability.ts` classifies once, lazily at idle time:

| Tier | Who | Behaviour |
| --- | --- | --- |
| high | capable desktops | full scenes, DPR ≤ 1.75, 60fps, starts at idle |
| low | phones, small screens, ≤4 cores/GB | fewer particles, DPR ≤ 1.25, 30fps cap, compact framing; starts after first interaction; heavier scenes (safety, seats, technology, CTA) stay static |
| static | no WebGL, software renderer, ≤2 cores/GB, Save-Data | server-generated SVG illustrations only |

At runtime `PerformanceMonitor` steps DPR down on sustained frame drops and demotes every scene a
tier if it keeps failing; a lost WebGL context or render error swaps that visual back to its SVG.
`?webgl=off|low|high` forces a tier for QA.

**Reduced motion:** scenes render a single calm, final-state frame (`frameloop="demand"`), no
travelling particles, pulses or parallax; the network section becomes a normal static section.

## Budgets

- One canvas per visible scene, paused (`frameloop="never"`) whenever offscreen.
- Each scene < ~15 draw calls; points and lines batched into single geometries.
- three.js never loads before first paint and hydration; on constrained devices, never before the
  visitor interacts.
