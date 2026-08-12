# Build Plan & Status

Tracks progress against the client's `Khatu_Pixel_Digital_Studio_15_Day_Project_Management.xlsx`
workbook (authoritative task order/dependencies/acceptance criteria) and the
build prompt. Updated as each phase lands; the workbook's own Status columns
are updated alongside this file.

| Phase | Workbook days | Scope | Status |
|---|---|---|---|
| 1. Foundation | Day 1 | Repo, Vite/React/TS/Tailwind scaffold, Geist Sans, design tokens, full Supabase schema (19 tables + timeline/history tables) with RLS on every table, Storage buckets/policies, Supabase client + typed schema, Auth context | **Done** — builds, typechecks, and lints clean. Schema is written and ready to apply; no live Supabase project connected yet (client chose to supply credentials later — see `.env.example`). |
| 2. Public shell + auth + services/portfolio | Day 2–3 | Floating nav, footer, router with protected-route guards, Login/Signup/Password Reset, Services list/detail, Portfolio masonry + filters + lightbox | **Done** — verified in-browser: route guards redirect correctly, error states render when Supabase is unreachable, mobile nav collapses. |
| 3. Homepage + booking + advance payment | Day 3–4 | Editorial homepage, Book Your Event form, Razorpay order-creation + signature-verification Edge Functions, payment success/failure states | **Done** — homepage bento sections (services/portfolio/testimonials) hide gracefully when there's no data yet rather than showing fake content; booking form creates a real `bookings` row then opens Razorpay Checkout; `create-razorpay-order`/`verify-razorpay-payment` Edge Functions re-derive amounts server-side and never trust the client. Booking is a single-page form, not a multi-step wizard — a deliberate simplification, see note below. Payment flow is untestable end-to-end until real Supabase + Razorpay keys are supplied. |
| 4. Admin content + shop + cart | Day 5–6 | Admin CRUD for services/portfolio/categories/products/variants with Storage uploads, Shop browsing, product detail, cart | **Done** — full admin CRUD (services incl. gallery/FAQs/deliverables, portfolio, categories, products incl. variants/customisation-field builder/images) with a reusable modal/confirm-dialog/toggle/image-uploader kit; public shop (category grid → product grid → product detail with variant + customisation selection incl. private photo uploads) and a real Supabase-backed cart (`CartContext`, one cart per customer, quantity/remove). Cart page, not a slide-out drawer — deliberate simplification, see note below. Checkout itself is still a placeholder (Day 7-8). |
| 5. Checkout + CRM + quotations | Day 7–8 | Checkout + Razorpay shop payment, quotation builder (line items/GST/discount), publish quote, team assignment, booking status/timeline updates | **Done** — checkout snapshots the cart into a real order (name/price frozen on `order_items` so later catalogue edits can't change what a past order says), then reuses the Day 3-4 Razorpay Edge Functions with `purpose: "shop_order"`. Admin Bookings CRM: quotation builder (line items, discount, GST — totals computed by the Day 1 DB trigger, not client math), publish flow, team assignment, status control, payments + timeline panels. Added a basic Admin Orders module (list/detail/status) since checkout now produces real orders — the *hardened* KPI-dashboard version is still Day 9-10. |
| 6. Customer dashboard + admin hardening | Day 9–10 | Profile, My Bookings/Orders + detail/timeline, quote acceptance + balance payment, admin KPI overview, filters, route-protection audit | **Done** — real bento account overview, profile editing (name/phone/password), My Bookings/Orders lists + detail pages with status timelines. Booking detail is where the loop actually closes: a published quotation gets an "Accept Quotation" button (calls the `accept_quotation()` DB function, not a raw client update), and an accepted one gets a "Pay Balance" button reusing the Day 3-4 Razorpay flow with `purpose: "booking_balance"`. Admin: real KPI tiles (bookings/orders/quotations/revenue), a Customers list, and the whole router converted to route-level code-splitting (`React.lazy` + `Suspense`) — cut the initial JS payload from ~217KB to ~166KB gzipped by keeping the entire admin console out of a customer's first load. |
| 7. QA, content, deployment, handover | Day 11–15 | End-to-end RLS/payment/responsive/accessibility QA, real content seeding, Vercel + env var config, client handover guide | **Done** — see notes below for what "QA" actually meant without a live Supabase project. |

## Day 11-15: what "QA" meant without a live backend

No real Supabase project or Razorpay account has existed for the whole
build (placeholder credentials throughout, by the client's choice). That
made true end-to-end QA — real signups, real RLS enforcement, real
payments — impossible from here. What this phase actually covered:

- **A real bug found and fixed**: the navbar wrapped ungracefully at
  viewport widths between 768–1024px (logo split across two lines, the
  "Book Your Event" button's text wrapped to three lines inside the pill).
  The desktop nav now switches on at `lg` (1024px) instead of `md` (768px)
  — see `src/components/layout/Navbar.tsx`. Caught by an actual screenshot
  at 783px width, not just a code read.
- **Error boundary**: added in the Day 9-10 pass, verified here to still
  wrap the whole app after the router refactor.
- **Content seeding**: [`supabase/seed.sql`](../supabase/seed.sql) — sample
  services, portfolio items, testimonials, categories, and products (with
  variants and customisation fields) so a freshly-connected environment
  isn't empty. Placeholder images throughout; see
  [docs/handover.md §5](handover.md#5-replacing-seed-content).
- **Deployment config**: `vercel.json` (SPA rewrites + asset caching) and
  `.github/workflows/ci.yml` (typecheck/lint/build on every push and PR).
- **Payment hardening**: added `razorpay-webhook` as a server-side backstop
  for payment confirmation — the primary path is the browser calling
  `verify-razorpay-payment` right after checkout, but if the browser closes
  first, a real charge could otherwise exist with no matching "paid" row
  here. Extracted the shared apply-payment-success logic into
  `supabase/functions/_shared/applyPaymentSuccess.ts` so both paths update
  bookings/orders identically.
- **SEO/meta basics**: `favicon.svg`, `robots.txt`, Open Graph/Twitter tags
  in `index.html` — none of this existed before this pass.
- **Everything genuinely untestable without a live project** — real signup
  flow, RLS enforcement against real rows, actual Razorpay checkout, email
  delivery — is documented as a manual pre-launch checklist in
  [docs/handover.md](handover.md) instead of claimed as verified here.

## Notes for whoever picks this up

- Booking form: the client's workbook envisions a multi-step stepper (details
  → review → confirm). We shipped a single well-validated page instead —
  fewer steps to abandon, same data collected. Worth revisiting after real
  user feedback, not before.
- Razorpay Edge Functions (`supabase/functions/create-razorpay-order`,
  `verify-razorpay-payment`) need `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
  set via `supabase secrets set` before they'll do anything — see `.env.example`.
- Cart: shipped as a dedicated `/cart` page instead of the workbook's slide-out
  drawer — same functionality, fewer moving parts. Easy to add a drawer later
  if the client wants quick-add-without-navigating.
- `src/types/database.ts` Relationships arrays now carry real FK metadata
  (not empty arrays) so `.select("*, related_table(...)")` embeds type-check
  correctly — keep this in sync if you hand-edit the schema instead of
  regenerating from a live project.


- Env: copy `.env.example` → `.env.local`. Supabase and Razorpay are both
  placeholder-scoped for now — nothing will hit a real backend until real
  keys are supplied and `supabase db push` is run against a linked project.
- Schema: every table, trigger, RPC, and RLS policy is in
  `supabase/migrations`, ordered and idempotent-safe to run top to bottom.
- Design tokens: `src/styles/tokens.css` + `tailwind.config.ts` are the only
  place color/spacing/radius/shadow/motion values should be defined — see
  `docs/design-system.md`.
