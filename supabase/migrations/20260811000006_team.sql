-- team_members + booking_assignments: internal roster, admin-managed only.
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_team_members_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

create table public.booking_assignments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  team_member_id uuid not null references public.team_members (id) on delete cascade,
  assigned_role text,
  created_at timestamptz not null default now(),
  unique (booking_id, team_member_id)
);

alter table public.team_members enable row level security;
alter table public.booking_assignments enable row level security;

create policy "team_members_admin_only"
  on public.team_members for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "booking_assignments_select"
  on public.booking_assignments for select
  using (
    public.is_admin()
    or exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = auth.uid())
  );

create policy "booking_assignments_admin_write"
  on public.booking_assignments for insert with check (public.is_admin());
create policy "booking_assignments_admin_update"
  on public.booking_assignments for update using (public.is_admin());
create policy "booking_assignments_admin_delete"
  on public.booking_assignments for delete using (public.is_admin());
