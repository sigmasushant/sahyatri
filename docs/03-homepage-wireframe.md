# 03 · Homepage structure & wireframe

The homepage is one narrative: **arrive → understand → explore → trust → see the technology →
imagine yourself using it → convert.** Tones alternate so each act has its own light.

| # | Section | Tone | Visual | Act |
| --- | --- | --- | --- | --- |
| 1 | Navigation | adaptive | — | |
| 2 | Hero — "Move together." | dark | 3D mobility network | arrive |
| 3 | Trust strip — verified people / vehicles, payments, real-time safety | light | icons | understand |
| 4 | Product intro — six pillars | light | typographic list | understand |
| 5 | AI matching — "The right ride isn't just nearby." | dark | 3D matching demo + synced score panel | explore |
| 6 | How it works — three steps | light | sticky product previews | explore |
| 7 | Safety — "Safety is part of the journey." | dark | 3D protected trip | trust |
| 8 | Real-time trip | subtle | live trip card | trust |
| 9 | Drivers / passengers | light | 3D seats scene · match list | imagine |
| 10 | Recurring commute | subtle | week view | imagine |
| 11 | Corporate mobility | light | org flow | imagine |
| 12 | University mobility | subtle | campus map | imagine |
| 13 | Network — "Every empty seat can connect two journeys." | dark, 300vh sticky | 3D network growth, scroll-driven | technology |
| 14 | Technology — five systems | dark | 3D formations driven by card hover/focus | technology |
| 15 | Security & privacy | dark subtle | feature grid | technology |
| 16 | Stories | light | honest empty state until real testimonials exist | convert |
| 17 | FAQ (+ FAQPage JSON-LD) | light | accordion | convert |
| 18 | Get the app — "Move better. Together." | dark, full-screen | ambient 3D + early-access form | convert |
| 19 | Footer | dark | — | |

## Desktop hero

```
┌──────────────────────────────────────────────────────────────────┐
│ ▣ sahyatri  Product▾ How it works Safety Business Universities   │
│                                          About  Log in [Get app] │
│                                                                  │
│ SHARED MOBILITY, INTELLIGENTLY MATCHED         ·  ·  ·  ·  ·     │
│ Move                                     Delhi ●──╮  ·  ·  ·     │
│ together.                                ·  ·  ·  ╰──────● Jaipur│
│ Intelligent mobility for real people.      ·  ◦  ·  ·  ·  ·  ·   │
│ Find trusted rides, share empty seats…   ·  ·  ·  ·  ·  ·  ·  ·  │
│ [Find a ride →] [Offer a seat]              (3D world, full-bleed│
│ Explore how it works ↓                       behind a left scrim)│
│                              ● Drivers  ● Passengers  ━ Example  │
└──────────────────────────────────────────────────────────────────┘
```

## Mobile hero

```
┌────────────────────┐
│ ▣ sahyatri       ☰ │
│ SHARED MOBILITY…   │
│ Move               │
│ together.          │
│ Intelligent        │
│ mobility for…      │
│ [ Find a ride → ]  │
│ [ Offer a seat  ]  │
│ Explore ↓          │
│ ┌────────────────┐ │
│ │ 3D network,    │ │  contained band (not full screen), centred framing,
│ │ simplified     │ │  starts only after the visitor interacts
│ └────────────────┘ │
└────────────────────┘
```
