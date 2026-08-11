-- services + service_gallery: studio-managed catalogue shown on the public site.
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  cover_image_url text,
  deliverables text[] not null default '{}',
  starting_price_paise integer check (starting_price_paise is null or starting_price_paise >= 0),
  is_custom_quote boolean not null default false,
  faqs jsonb not null default '[]',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.services.faqs is 'Array of {"question": string, "answer": string}.';

create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create table public.service_gallery (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.service_gallery enable row level security;

create policy "services_public_read_published"
  on public.services for select
  using (is_published or public.is_admin());

create policy "services_admin_write"
  on public.services for insert with check (public.is_admin());
create policy "services_admin_update"
  on public.services for update using (public.is_admin());
create policy "services_admin_delete"
  on public.services for delete using (public.is_admin());

create policy "service_gallery_public_read"
  on public.service_gallery for select
  using (
    exists (select 1 from public.services s where s.id = service_id and (s.is_published or public.is_admin()))
  );

create policy "service_gallery_admin_write"
  on public.service_gallery for insert with check (public.is_admin());
create policy "service_gallery_admin_update"
  on public.service_gallery for update using (public.is_admin());
create policy "service_gallery_admin_delete"
  on public.service_gallery for delete using (public.is_admin());
