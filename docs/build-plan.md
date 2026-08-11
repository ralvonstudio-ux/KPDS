# Build Plan & Status

Tracks progress against the client's `Khatu_Pixel_Digital_Studio_15_Day_Project_Management.xlsx`
workbook (authoritative task order/dependencies/acceptance criteria) and the
build prompt. Updated as each phase lands; the workbook's own Status columns
are updated alongside this file.

| Phase | Workbook days | Scope | Status |
|---|---|---|---|
| 1. Foundation | Day 1 | Repo, Vite/React/TS/Tailwind scaffold, Geist Sans, design tokens, full Supabase schema (19 tables + timeline/history tables) with RLS on every table, Storage buckets/policies, Supabase client + typed schema, Auth context | **Done** — builds, typechecks, and lints clean. Schema is written and ready to apply; no live Supabase project connected yet (client chose to supply credentials later — see `.env.example`). |
| 2. Public shell + auth + services/portfolio | Day 2–3 | Floating nav, footer, router with protected-route guards, Login/Signup/Password Reset, Services list/detail, Portfolio masonry + filters + lightbox | Not started |
| 3. Homepage + booking + advance payment | Day 3–4 | Editorial homepage, Book Your Event form, Razorpay order-creation + signature-verification Edge Functions, payment success/failure states | Not started |
| 4. Admin content + shop + cart | Day 5–6 | Admin CRUD for services/portfolio/categories/products/variants with Storage uploads, Shop browsing, product detail, cart | Not started |
| 5. Checkout + CRM + quotations | Day 7–8 | Checkout + Razorpay shop payment, quotation builder (line items/GST/discount), publish quote, team assignment, booking status/timeline updates | Not started |
| 6. Customer dashboard + admin hardening | Day 9–10 | Profile, My Bookings/Orders + detail/timeline, quote acceptance + balance payment, admin KPI overview, filters, route-protection audit | Not started |
| 7. QA, content, deployment, handover | Day 11–15 | End-to-end RLS/payment/responsive/accessibility QA, real content seeding, Vercel + env var config, client handover guide | Not started |

## Notes for whoever picks this up

- Env: copy `.env.example` → `.env.local`. Supabase and Razorpay are both
  placeholder-scoped for now — nothing will hit a real backend until real
  keys are supplied and `supabase db push` is run against a linked project.
- Schema: every table, trigger, RPC, and RLS policy is in
  `supabase/migrations`, ordered and idempotent-safe to run top to bottom.
- Design tokens: `src/styles/tokens.css` + `tailwind.config.ts` are the only
  place color/spacing/radius/shadow/motion values should be defined — see
  `docs/design-system.md`.
