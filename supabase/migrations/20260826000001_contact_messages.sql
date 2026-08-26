-- contact_messages: general enquiries submitted from the public Contact page.
-- Deliberately separate from `bookings` (see ContactPage.tsx) — this is for
-- "I have a question" traffic, not structured event requests, so it has no
-- customer_id/auth requirement: anyone, logged in or not, can submit one.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'General enquiries from the public Contact page — reviewed by admin, not tied to a customer account.';

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) may submit an enquiry; only admins
-- may ever read or update the list — a visitor can write a message but can
-- never see anyone else's.
create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  with check (true);

create policy "contact_messages_admin_select"
  on public.contact_messages for select
  using (public.is_admin());

create policy "contact_messages_admin_update"
  on public.contact_messages for update
  using (public.is_admin());
