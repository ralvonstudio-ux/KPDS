-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto" with schema public;

-- Shared enums ----------------------------------------------------------------
create type public.user_role as enum ('customer', 'admin');

create type public.booking_status as enum (
  'new',
  'advance_paid',
  'under_review',
  'contacted',
  'quoted',
  'confirmed',
  'shoot_completed',
  'delivered',
  'closed',
  'rejected'
);

create type public.quotation_status as enum ('draft', 'published', 'accepted');

create type public.order_status as enum (
  'new',
  'processing',
  'ready',
  'shipped',
  'delivered',
  'cancelled'
);

create type public.payment_purpose as enum ('booking_advance', 'booking_balance', 'shop_order');

create type public.payment_status as enum ('created', 'paid', 'failed', 'refunded');

-- Shared helpers ----------------------------------------------------------------

-- Keeps updated_at current on every row update. Attached per-table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- is_admin() lives in 20260811000002_profiles.sql, right after the profiles
-- table is created — a `language sql` function is validated against the
-- catalog at CREATE FUNCTION time, so it can't reference a table (profiles)
-- that doesn't exist yet in this earlier migration.
