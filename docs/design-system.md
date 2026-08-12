# Khatu Pixel Digital Studio — Design System

One-page reference for every visual decision in the product. Source of truth for
tokens lives in code at [`src/styles/tokens.css`](../src/styles/tokens.css) and
[`tailwind.config.ts`](../tailwind.config.ts) — this document explains and annotates
those values; if the two ever disagree, the code wins.

**Brand line:** *We don't just capture photographs. We preserve moments.*
Premium, minimal, editorial, cinematic, quietly luxurious. Photography-first —
the UI must never compete with the photography. Not generic, not corporate,
not template-feeling, not a traditional Indian photography-studio website.

## Brand direction

Reference points for spacing, hierarchy, interaction restraint, and editorial
composition only — never copied: Apple, Linear, Vercel, Framer, Raycast,
Leica, Sony Alpha, high-end fashion/editorial sites, contemporary photography
portfolios.

## Typography — Geist Sans only

Never Poppins, Inter, Roboto, Montserrat, Lato, Open Sans, or a system-font fallback as the visual identity.

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | clamp(72px–120px) | 500 | -0.06em | Homepage hero only |
| `display-lg` | clamp(48px–64px) | 500 | -0.03em | Section headings |
| `display-md` | clamp(32px–52px) | 500 | -0.02em | Page titles (Services, Portfolio, Shop) |
| `display-sm` | clamp(22px–28px) | 500 | -0.01em | Card headings |
| `eyebrow` | 11px | 500 | 0.12em, uppercase | Kicker labels, metadata |
| body | 16–18px | 400 | normal | Paragraph copy, forms, tables |

Oversized type is reserved for hero and section-opening moments — never used
for body copy, cards, or dense UI (booking tables, admin lists). Body copy
stays short — this is an editorial product, not a brochure; avoid dense
paragraphs.

## Colour — locked palette

The client's brief was black + white + red, translated into a sophisticated
luxury system — never pure `#000`/`#FFF`/`#FF0000`, never gradients, never
purple, blue, or gold.

| Token | Hex | Role |
|---|---|---|
| `obsidian` | `#0B0B0C` | Primary dark — buttons, dark sections, footer-adjacent moments |
| `bone` | `#F4F2ED` | Main light background |
| `soft-white` | `#FAF9F6` | Cards, panels, modals |
| `ink` | `#111113` | Primary text |
| `graphite` | `#666568` | Secondary text, captions, helper text |
| `crimson` | `#A51D2D` | Accent — CTA hover, active nav, selected states, small highlights |
| `crimson-light` | `#C13A4C` | Soft accent washes (low-opacity backgrounds), accent-on-dark |
| `wine` | `#641722` | Deep accent — hover/pressed states on crimson elements |
| `ash` | `#DDD9D2` | Dividers, card borders |

**Ratio:** ~70% bone/soft-white, ~20% obsidian, ~7% graphite, ~3% crimson.
Crimson is an accent, applied to small things — a `01 —` index label, a hover
state, an active nav pill, a status dot — never a section background, never
the majority of a page.

**Semantic aliases in code:** every component is written against
`canvas`/`surface`/`muted`/`gold`/`gold-soft`/`gold-deep`/`espresso`/`line`
rather than the canonical names directly (`canvas`→bone, `surface`→soft-white,
`gold`→crimson, `gold-deep`→wine, `espresso`→obsidian, `line`→ash, etc.) —
see the alias block in `tailwind.config.ts`. New components may use either;
the alias names exist so the whole app re-themes from one place.

## Design language — minimal + editorial + bento + soft claymorphism

- **Claymorphism, applied carefully**: cards read as soft physical surfaces,
  never inflated 3D cartoon UI. Formula: `rounded-card` (20px) or
  `rounded-card-lg` (28px), `bg-surface`, `shadow-clay`
  (`0 12px 40px rgba(11,11,12,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`).
  No glossy glass, no excessive blur, no exaggerated elevation.
- **Bento grids are asymmetric by design**, not a uniform repeated card size.
  Vary dimensions, image ratios, and visual weight — see the homepage
  service grid for the reference implementation.
- **Photography is the hero.** Full-bleed, cinematic crops, large images,
  asymmetric image grids. No stock photography, no decorative icons, no
  gradients standing in for real imagery.

## Radii

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 12px | Small controls, tags |
| `rounded-card` | 20px | Standard cards |
| `rounded-card-lg` | 28px | Feature cards, panels |
| `rounded-hero` | 36px | Hero image containers, largest bento tiles |
| `rounded-full` | pill | Buttons, nav |

## Spacing — 8px grid

Base unit `--space-1 = 8px`. Section rhythm uses `--space-section`
(`clamp(6rem, 4.5rem + 6vw, 10rem)` ≈ 96–160px) between major homepage/landing
sections.

## Motion

Framer Motion throughout. Animations read as expensive, not flashy.

| Element | Limit |
|---|---|
| Card hover | scale ≤ **1.015** |
| Image hover (zoom) | scale ≤ **1.04** |
| Button press/lift | **1–2px** translate |
| Section entrance | fade-up, **300–600ms**, `--ease-editorial` |
| Reduced motion | `prefers-reduced-motion` disables all of the above (see `src/styles/index.css`) |

No parallax, autoplay decoration, bouncing, spinning, or aggressive zoom.

## Layout

- Max content width **1440px** (`max-w-content`).
- Desktop: asymmetric 4-column bento. Tablet (1024px): 2-column. Mobile
  (390px): single-column editorial stack — redesigned hierarchy per
  breakpoint, never a naive shrink of the desktop layout.

## Components

- **Buttons**: Primary (obsidian fill, hover → crimson), Gold/accent
  (crimson fill), Outline, Ghost — see `src/components/ui/Button.tsx`.
- **Cards**: Image Card, Bento Card, Product Card, Stat Card, Booking Card —
  all built on the claymorphism formula above.

## Accessibility baseline

- All interactive elements get a visible focus ring (`--shadow-focus`,
  crimson at 35% opacity, 3px) — never `outline: none` without a replacement.
- Body text on canvas/surface meets WCAG AA contrast (ink `#111113` on
  bone/soft-white is >17:1; graphite `#666568` on bone is ~4.6:1, AA for
  normal text).
- Touch targets ≥44px. Motion respects `prefers-reduced-motion` globally.
