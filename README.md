# Khatu Pixel Digital Studio

Luxury photography, videography, and customised-gift studio platform: public
portfolio site, event booking with staged payments, a gift shop, and customer +
admin dashboards.

**Status:** in active build, following
[`docs/build-plan.md`](docs/build-plan.md) and the client's
`Khatu_Pixel_Digital_Studio_15_Day_Project_Management.xlsx` workbook. Not yet
launch-ready — see that plan for what's done vs. outstanding.

## Stack

React 18 + Vite + TypeScript · Tailwind CSS · Geist Sans · Framer Motion ·
Supabase (Auth, Postgres, Storage, RLS) · Razorpay · Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + Razorpay values
npm run dev
```

## Project structure

```
src/
  app/            route definitions, layout shells
  components/     shared/reusable UI (buttons, inputs, cards, nav, footer)
  context/        React context providers (auth, cart)
  features/       feature-scoped modules (booking, shop, dashboards, admin)
  lib/            supabase client, utils, validation schemas
  styles/         design tokens + global CSS
  types/          shared TypeScript types, incl. the Supabase schema mirror
supabase/
  migrations/     ordered SQL migrations — schema, RLS, triggers, functions
  functions/      Edge Functions (Razorpay order creation, payment/webhook verification)
docs/             design system, information architecture, handover guide
```

## Database & security

All schema, relationships, indexes, and Row Level Security policies live in
[`supabase/migrations`](supabase/migrations). RLS is enabled on every table;
public roles only ever see published content, customers only ever see their
own rows, and admins have full operational access via a single `is_admin()`
helper. Payment records are written exclusively by server-side Edge Functions
using the service-role key, never by the client.

To apply the schema against your own Supabase project:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck + production build
- `npm run typecheck` — TypeScript project check, no emit
- `npm run lint` — ESLint
