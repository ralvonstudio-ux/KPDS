-- categories, products, product_images, product_variants: the shop catalogue.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  cover_image_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  base_price_paise integer not null check (base_price_paise >= 0),
  is_customisable boolean not null default false,
  customisation_fields jsonb not null default '[]',
  stock_tracked boolean not null default false,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_published boolean not null default true,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.products.customisation_fields is 'Array of {"key","label","type":"text"|"textarea"|"photo","required"}.';

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  sku text,
  price_paise integer check (price_paise is null or price_paise >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;

create policy "categories_public_read_published"
  on public.categories for select using (is_published or public.is_admin());
create policy "categories_admin_write" on public.categories for insert with check (public.is_admin());
create policy "categories_admin_update" on public.categories for update using (public.is_admin());
create policy "categories_admin_delete" on public.categories for delete using (public.is_admin());

create policy "products_public_read_published"
  on public.products for select using ((is_published and not is_archived) or public.is_admin());
create policy "products_admin_write" on public.products for insert with check (public.is_admin());
create policy "products_admin_update" on public.products for update using (public.is_admin());
create policy "products_admin_delete" on public.products for delete using (public.is_admin());

create policy "product_images_public_read"
  on public.product_images for select
  using (exists (select 1 from public.products p where p.id = product_id and ((p.is_published and not p.is_archived) or public.is_admin())));
create policy "product_images_admin_write" on public.product_images for insert with check (public.is_admin());
create policy "product_images_admin_update" on public.product_images for update using (public.is_admin());
create policy "product_images_admin_delete" on public.product_images for delete using (public.is_admin());

create policy "product_variants_public_read"
  on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id and ((p.is_published and not p.is_archived) or public.is_admin())));
create policy "product_variants_admin_write" on public.product_variants for insert with check (public.is_admin());
create policy "product_variants_admin_update" on public.product_variants for update using (public.is_admin());
create policy "product_variants_admin_delete" on public.product_variants for delete using (public.is_admin());
