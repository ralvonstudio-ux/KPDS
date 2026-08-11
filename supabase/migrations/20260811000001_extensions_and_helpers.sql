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

-- Central "am I an admin" check used by RLS policies across every table.
-- security definer + fixed search_path lets it bypass RLS on profiles safely
-- (the alternative, a plain subquery, works too since a user can always read
-- their own profiles row, but this keeps every policy below one line long
-- and avoids re-deriving the same subquery two dozen times).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
