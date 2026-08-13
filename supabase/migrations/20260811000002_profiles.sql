-- profiles: one row per auth.users row, created automatically on signup.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with app role and contact details.';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- New auth.users row -> matching profiles row, defaulting to the customer role.
-- Role is never client-writable to 'admin'; only an existing admin (via the
-- Supabase dashboard or a service-role script) can promote a user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Central "am I an admin" check used by RLS policies across every table.
-- security definer + fixed search_path lets it bypass RLS on profiles safely
-- (the alternative, a plain subquery, works too since a user can always read
-- their own profiles row, but this keeps every policy below one line long
-- and avoids re-deriving the same subquery two dozen times). Lives here,
-- right after the profiles table it queries, rather than in the earlier
-- extensions/helpers migration — see the comment there for why.
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

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (
    -- A non-admin may edit their own row but can never grant themselves the admin role.
    (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());
