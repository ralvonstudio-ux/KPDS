# Khatu Pixel Digital Studio — Information Architecture

Route map for the public site, customer account, and admin console, plus the
redirect rules that guard protected routes. Implemented in `src/app/router.tsx`.

## Public (no auth required)

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/studio` | Studio — services catalogue (was `/services`) |
| `/studio/:slug` | Service detail |
| `/portfolio` | Portfolio (masonry + filters + lightbox) |
| `/offers` | Offers — curated promotions |
| `/gift-center` | Gift Center — category grid (was `/shop`) |
| `/gift-center/:categorySlug` | Gift Center — category filtered |
| `/gift-center/product/:slug` | Product detail |
| `/cart` | Cart |
| `/contact` | Contact |
| `/book-your-event` | Book Your Event |
| `/login` | Login |
| `/signup` | Signup |
| `/reset-password` | Password reset request + confirmation |

## Customer account — requires `customer` or `admin` role

Base path `/account`. Unauthenticated visitors are redirected to
`/login?redirect=<original path>`; after successful login they land back on the
page they came from.

| Route | Page |
|---|---|
| `/account` | Dashboard overview (bento: latest booking, latest order, quick links) |
| `/account/profile` | Profile management |
| `/account/bookings` | My Bookings (list) |
| `/account/bookings/:id` | Booking detail — quotation, payments, status timeline |
| `/account/orders` | My Orders (list) |
| `/account/orders/:id` | Order detail — items, status timeline |
| `/checkout` | Checkout (requires an authenticated session; cart must be non-empty) |
| `/checkout/success` | Payment success state |
| `/checkout/failed` | Payment failure state |

## Admin console — requires `admin` role

Base path `/admin`. A signed-in `customer` hitting any `/admin/*` route is
redirected to `/account` (not `/login` — they *are* authenticated, just not
authorized); a signed-out visitor is redirected to `/login`.

| Route | Page |
|---|---|
| `/admin` | KPI overview dashboard |
| `/admin/bookings` | Booking list + filters |
| `/admin/bookings/:id` | Booking detail — quotation builder, team assignment, status/timeline |
| `/admin/services` | Services + gallery management |
| `/admin/portfolio` | Portfolio management |
| `/admin/categories` | Category management |
| `/admin/products` | Product list |
| `/admin/products/:id` | Product edit — images, variants, customisation fields |
| `/admin/orders` | Order management + status updates |
| `/admin/customers` | Customer list |
| `/admin/team` | Team member roster |

## Route-guard behaviour (implemented once, reused everywhere)

- `RequireAuth` — redirects to `/login?redirect=…` if there is no session.
- `RequireRole("admin")` — redirects a non-admin to `/account`.
- Both wrappers render a loading state while the session/profile is resolving
  (never a flash of protected content, never a false redirect before auth
  finishes loading).

## Navigation

- Public nav: Home, Gift Center, Studio, Portfolio, Offers, Contact, plus a
  location pill (visual only, not yet wired), search (client-side, filters
  Studio + Gift Center), theme toggle (light/dark), Cart icon with item
  count, Account/Login icon, and "Book" (primary CTA, styled distinctly).
- Customer dashboard: sidebar nav (desktop) collapsing to a bottom/drawer nav
  (mobile) — Overview, Bookings, Orders, Profile.
- Admin console: sidebar nav (desktop) collapsing to a drawer (mobile) —
  Overview, Bookings, Services, Portfolio, Shop (Categories/Products), Orders,
  Customers, Team.
