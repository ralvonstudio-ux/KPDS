-- Additive merchandising fields for the Gift Center homepage section — a
-- real "was ₹999 now ₹799" strike-through price and a "Bestseller" badge,
-- both admin-settable rather than faked in the UI. Nullable/default-false so
-- every existing product keeps working with neither shown.
alter table public.products
  add column if not exists compare_at_price_paise integer
    check (compare_at_price_paise is null or compare_at_price_paise >= 0),
  add column if not exists is_bestseller boolean not null default false;

comment on column public.products.compare_at_price_paise is
  'Optional "was" price shown struck through next to base_price_paise when set and greater than it.';
comment on column public.products.is_bestseller is
  'Shows a "Bestseller" badge on the storefront when true. Admin-set, not derived from sales data (yet).';
