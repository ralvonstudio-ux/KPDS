# Handover Guide

Everything needed to take this project from "code on GitHub" to "live site
the studio can run." Written for whoever does the deploy — could be the
client, a developer they hire, or future-you in six months.

## 1. What you're getting

A React + Supabase + Razorpay platform: public marketing site (services,
portfolio, shop), event booking with staged payments, a customer dashboard,
and an admin console for running the studio day-to-day. Full feature list
and what's built vs. outstanding: [docs/build-plan.md](build-plan.md).

## 2. One-time setup

### 2.1 Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Install the CLI and link it:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   ```
3. Push the schema (every table, RLS policy, trigger, and function in
   [supabase/migrations](../supabase/migrations)):
   ```bash
   supabase db push
   ```
4. (Optional but recommended for a demo/staging environment) seed sample
   content so the site isn't empty:
   ```bash
   psql "$(supabase db url --project-ref <your-project-ref>)" -f supabase/seed.sql
   ```
   Every image in the seed data is a generic placeholder — see
   [§5 Replacing seed content](#5-replacing-seed-content) before using this
   on a real launch.
5. In the Supabase dashboard, grab **Project URL** and **anon public key**
   (Settings → API) for step 2.3.

### 2.2 Deploy the Edge Functions (Razorpay)

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook --no-verify-jwt
supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your-secret-key
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

Get the key id/secret from the [Razorpay dashboard](https://dashboard.razorpay.com)
→ Settings → API Keys. Use `rzp_test_...` keys while staging, `rzp_live_...`
only once you're ready to take real payments.

Then set up the webhook itself (Settings → Webhooks → Add New Webhook):
URL = `https://<project-ref>.functions.supabase.co/razorpay-webhook`, active
event = `payment.captured`. Razorpay generates a **separate** webhook secret
when you save it — that's the value for `RAZORPAY_WEBHOOK_SECRET`, not the
API key secret. This webhook is a server-side backstop: the primary payment
confirmation path is the browser calling `verify-razorpay-payment` right
after checkout, but if the browser closes before that call fires, this
webhook is what still marks the payment "paid" instead of it silently
looking unpaid forever. See the comment at the top of
`supabase/functions/razorpay-webhook/index.ts` for the full reasoning.

### 2.3 Configure environment variables

Copy `.env.example` to `.env.local` for local dev, and set the same values
in your hosting provider's dashboard for production:

| Variable | Where it's used | Value |
|---|---|---|
| `VITE_SUPABASE_URL` | Browser | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser | Supabase anon public key |
| `VITE_RAZORPAY_KEY_ID` | Browser | Same `rzp_...` key id as the server secret (this half is public by design — Razorpay's checkout widget needs it client-side) |

Never put `RAZORPAY_KEY_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` in a
`VITE_`-prefixed variable — that would ship them to every visitor's browser.
They belong only in Supabase Edge Function secrets (step 2.2).

### 2.4 Create the first admin account

Every new signup gets the `customer` role by default (see the
`handle_new_user` trigger). To promote the studio owner's account to admin,
sign up normally through the site, then in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where id =
  (select id from auth.users where email = 'owner@khatupixel.studio');
```

### 2.5 Deploy the frontend (Vercel)

```bash
npm install -g vercel
vercel
```

`vercel.json` is already configured (SPA rewrites + asset caching). Set the
three `VITE_*` environment variables in the Vercel project settings before
the first production deploy. A GitHub Actions workflow
(`.github/workflows/ci.yml`) runs typecheck/lint/build on every push and PR
— wire it to auto-deploy or just use it as a merge gate, your call.

## 3. Day-to-day content management (for the studio, non-technical)

Everything below is done by logging into the site with an admin account and
using the **Admin** console (`/admin`):

- **Services** — add/edit packages, pricing, deliverables, FAQs, gallery images.
- **Portfolio** — add/edit projects; toggle Published to control what's public.
- **Shop → Categories / Products** — manage the gift catalogue, upload
  product photos, add size/colour variants, and set up personalisation
  fields (text, long text, or "customer uploads a photo").
- **Bookings** — see every event request, build and publish a quotation,
  assign team members, and move a booking through its status (New →
  Advance Paid → Under Review → Contacted → Quoted → Confirmed → Shoot
  Completed → Delivered → Closed).
- **Orders** — see shop orders and update their fulfilment status.
- **Team** — the photographer/videographer/editor roster you assign to bookings.
- **Customers** — a read-only list of everyone with an account.

## 4. Security model (what to know before you touch the database directly)

- Every table has Row Level Security enabled. Customers only ever see their
  own bookings/orders/cart; the public only ever sees published content;
  admins get full access through a single `is_admin()` helper.
- The `payments` table has **no client write policy at all** — rows are
  only ever inserted/updated by the two Edge Functions, which verify the
  Razorpay signature server-side before marking anything "paid". Do not
  add a client-side insert/update policy to this table.
- If you ever hand-edit `supabase/migrations`, add a **new** migration file
  rather than editing an already-applied one — Supabase tracks migrations
  by filename+checksum, and editing history breaks `supabase db push` on
  every other environment.

## 5. Replacing seed content

`supabase/seed.sql` uses `picsum.photos` placeholder images so a
freshly-seeded environment looks populated for a demo. Before a real
launch: either skip running `seed.sql` entirely and enter real content
through the Admin console, or run it and then replace every service/
portfolio/product image via the Admin console's image upload (which pushes
to the real Storage buckets, not picsum). Also update:

- Footer contact details in [`src/components/layout/Footer.tsx`](../src/components/layout/Footer.tsx)
  (currently placeholder email/phone/address).
- `og:image` in [`index.html`](../index.html) — add a real hero photo.
- The domain in [`public/robots.txt`](../public/robots.txt).

## 6. Pre-launch QA checklist

This build was done entirely against placeholder Supabase/Razorpay
credentials, so the items below have been verified by code review and
structural testing (route guards, error/empty states, responsive layout)
but **not** against a live backend. Run through this once real credentials
are connected, before pointing a real domain at it:

- [ ] Sign up as a new customer, confirm a `profiles` row is created with
      `role = 'customer'` (via the `handle_new_user` trigger).
- [ ] Promote that account to `admin` (§2.4) and confirm `/admin` becomes
      reachable and `/account` still works for the same user.
- [ ] Submit Book Your Event as a customer, pay the advance with a Razorpay
      **test** card, confirm the booking's status flips to `advance_paid`
      and a `payments` row shows `status = 'paid'`.
- [ ] As admin, build and publish a quotation on that booking; as the
      customer, confirm "Accept Quotation" appears, works, and then "Pay
      Balance" charges the correct remaining amount.
- [ ] Add a product to the cart, check out with a test card, confirm the
      order appears in both `/account/orders` and `/admin/orders`.
- [ ] Deliberately fail/cancel a Razorpay test payment and confirm the
      booking/order is left in a sane, retryable state (not stuck "paying").
- [ ] Try to read another customer's booking by guessing its URL while
      logged in as a different customer — should 404/empty, never show
      their data (RLS should block it, but verify against the real DB).
- [ ] Try to reach `/admin/*` as a logged-in customer — should redirect to
      `/account`, not `/login`.
- [ ] Upload a personalisation photo on a customisable product, confirm it
      lands in the private `customer-uploads` bucket under that user's own
      folder, and that another user's signed-in session can't fetch it.
- [ ] Click through every page on a real phone, not just the resize-window
      emulation used during the build.

## 7. Known limitations / good next steps

See [docs/build-plan.md](build-plan.md) "Notes for whoever picks this up"
for build-time deviations from the original spec (single-page booking form
instead of a stepper, a dedicated cart page instead of a slide-out drawer).
Beyond that:

- No automated test suite yet (unit or e2e) — all verification so far has
  been manual + structural, since no live Supabase project existed during
  the build. Worth adding Playwright coverage for the booking and checkout
  payment flows before they see real traffic.
- The `razorpay-webhook` function is written and ready but only takes
  effect once you configure it in the Razorpay dashboard (§2.2) — it's not
  automatic just because the code exists in this repo.
- Admin promotion is a manual SQL step (§2.4) — fine for a single studio
  owner, worth a proper admin-invite flow if the team grows.
