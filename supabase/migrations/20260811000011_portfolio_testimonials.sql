-- portfolio_items: editorial gallery grid on the public Portfolio page.
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text not null,
  description text,
  cover_image_url text not null,
  gallery jsonb not null default '[]',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.portfolio_items.gallery is 'Array of additional image URLs shown in the lightbox alongside cover_image_url.';

create trigger set_portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

-- testimonials: real client quotes, studio-curated and published by admin.
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  avatar_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;

create policy "portfolio_items_public_read_published"
  on public.portfolio_items for select using (is_published or public.is_admin());
create policy "portfolio_items_admin_write" on public.portfolio_items for insert with check (public.is_admin());
create policy "portfolio_items_admin_update" on public.portfolio_items for update using (public.is_admin());
create policy "portfolio_items_admin_delete" on public.portfolio_items for delete using (public.is_admin());

create policy "testimonials_public_read_published"
  on public.testimonials for select using (is_published or public.is_admin());
create policy "testimonials_admin_write" on public.testimonials for insert with check (public.is_admin());
create policy "testimonials_admin_update" on public.testimonials for update using (public.is_admin());
create policy "testimonials_admin_delete" on public.testimonials for delete using (public.is_admin());
