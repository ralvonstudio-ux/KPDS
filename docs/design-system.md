# Khatu Pixel Digital Studio — Design System

One-page reference for every visual decision in the product. Source of truth for
tokens lives in code at [`src/styles/tokens.css`](../src/styles/tokens.css) and
[`tailwind.config.ts`](../tailwind.config.ts) — this document explains and annotates
those values; if the two ever disagree, the code wins.

## Brand direction

Premium, minimal, editorial, calm, tactile. A high-end creative studio / digital
magazine feel — closer to a printed portfolio book than a SaaS product. Cinematic
photography carries the page; interface chrome stays quiet and gets out of the way.

Reference sites used for interaction/composition quality only (unlumen, magicui,
smoothui, retroui, capacity, skeudesign) — no branding, copy, or layout is copied
from them.

## Typography — Geist Sans throughout

| Token | Value | Use |
|---|---|---|
| `display-xl` | clamp(3rem–6rem), line-height 0.98, tracking -0.02em | Homepage hero only |
| `display-lg` | clamp(2.5rem–4.5rem) | Section-opening editorial moments |
| `display-md` | clamp(2rem–3.25rem) | Page titles (Services, Portfolio, Shop) |
| `display-sm` | clamp(1.5rem–2.25rem) | Card/module headings |
| `eyebrow` | 0.75rem, tracking 0.14em, uppercase | Kicker labels above headings |
| body | Tailwind default `text-base`/`text-sm` | Paragraph copy, forms, tables |

Oversized type is reserved for hero and section-opening moments — never used for
body copy, cards, or dense UI (booking tables, admin lists).

## Colour

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#F8F7F4` | Page background |
| `surface` | `#FFFFFF` | Cards, panels, modals |
| `ink` | `#111111` | Primary text |
| `muted` | `#6B7280` | Secondary text, captions, helper text |
| `gold` | `#C59D5F` | Accent — CTAs, active states, focus ring, price highlights |
| `gold-soft` / `gold-deep` | `#D9BE8C` / `#A9814A` | Hover/active variants of gold |
| `espresso` | `#2B2118` | Optional dark editorial sections (final CTA, footer) |
| `line` / `line-strong` | 8%/14% black | Low-contrast borders — never harsh black |

No purple/blue-purple gradients, neon, aurora, or glassmorphism anywhere in the
product.

## Spacing — 8px grid

Base unit `--space-1 = 8px`. Section rhythm uses `--space-section`
(`clamp(6rem, 4.5rem + 6vw, 10rem)` ≈ 96–160px) between major homepage/landing
sections, matching the 96–160px vertical-rhythm rule.

## Radii & shadow

- Cards: `24px` (`rounded-card`), hero/feature modules: `32px` (`rounded-card-lg`).
- Shadow is a soft, warm "clay" shadow (`--shadow-clay`), never a hard black
  drop-shadow — tuned from espresso at low opacity, not pure black.
- Not every element is a card: text blocks, nav, and footer sit directly on the
  canvas without borders or shadows.

## Motion

| Element | Limit |
|---|---|
| Card hover | scale ≤ **1.015** |
| Image hover (zoom) | scale ≤ **1.05** |
| Button press/lift | **1–2px** translate |
| Section entrance | fade-up, **300–600ms**, `--ease-editorial` |
| Reduced motion | `prefers-reduced-motion` disables all of the above (see `src/styles/index.css`) |

No parallax, autoplay decoration, bouncing, or spinning.

## Layout

- Max content width **1440px** (`max-w-content` / container `2xl` breakpoint).
- 12-column desktop grid via Tailwind's grid utilities; asymmetric bento
  compositions favoured over repeated 3-up card grids.
- Mobile layouts are designed, not auto-stacked — see
  [`docs/information-architecture.md`](./information-architecture.md) for
  per-page mobile notes captured during wireframing.

## Accessibility baseline

- All interactive elements get a visible focus ring (`--shadow-focus`,
  gold at 45% opacity, 3px) — never `outline: none` without a replacement.
- Body text on canvas/surface meets WCAG AA contrast (ink `#111` on `#F8F7F4`/`#FFFFFF`
  is ~18.5:1; muted `#6B7280` on canvas is ~4.6:1, AA for normal text).
- Motion respects `prefers-reduced-motion` globally (see `src/styles/index.css`).
