-- bookings: customer event requests. Admin decides accept/reject; payment does
-- not auto-confirm a booking (see booking_status enum for the full workflow).
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  full_name text not null,
  mobile text not null,
  email text not null,
  event_type text not null,
  preferred_event_date date not null,
  event_location text not null,
  city text not null,
  notes text,
  status public.booking_status not null default 'new',
  advance_amount_paise integer not null default 0 check (advance_amount_paise >= 0),
  advance_paid_paise integer not null default 0 check (advance_paid_paise >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.bookings is 'One row per event booking request. Multiple bookings may share a preferred_event_date.';

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Timeline shown on both the customer and admin booking detail views.
create table public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  status public.booking_status not null,
  note text,
  changed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Every status change is logged automatically so the timeline can never drift
-- from the row's actual status.
create or replace function public.log_booking_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.booking_status_history (booking_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger bookings_log_status_insert
  after insert on public.bookings
  for each row execute function public.log_booking_status_change();

create trigger bookings_log_status_update
  after update on public.bookings
  for each row execute function public.log_booking_status_change();

alter table public.bookings enable row level security;
alter table public.booking_status_history enable row level security;

create policy "bookings_select_own_or_admin"
  on public.bookings for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "bookings_insert_own"
  on public.bookings for insert
  with check (customer_id = auth.uid());

-- Customers may only edit their own booking while it has not left the "new"
-- state (e.g. fixing a typo before the studio reviews it); every later
-- transition (accept/reject/quote/status) is admin-only.
create policy "bookings_update_own_while_new_or_admin"
  on public.bookings for update
  using (
    (customer_id = auth.uid() and status = 'new')
    or public.is_admin()
  );

create policy "booking_status_history_select"
  on public.booking_status_history for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or public.is_admin())
    )
  );

-- Inserts only ever happen via the trigger above (security definer), so no
-- direct insert/update/delete policy is granted to any client role.
