-- carts + cart_items: one active cart per signed-in customer.
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_carts_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  customisation jsonb not null default '{}',
  unit_price_paise integer not null check (unit_price_paise >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.cart_items.unit_price_paise is 'Price snapshot at add-to-cart time so later price edits do not silently change an open cart.';

create trigger set_cart_items_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

create policy "carts_own_or_admin"
  on public.carts for select using (customer_id = auth.uid() or public.is_admin());
create policy "carts_insert_own"
  on public.carts for insert with check (customer_id = auth.uid());
create policy "carts_update_own"
  on public.carts for update using (customer_id = auth.uid());
create policy "carts_delete_own"
  on public.carts for delete using (customer_id = auth.uid());

create policy "cart_items_select_own_or_admin"
  on public.cart_items for select
  using (exists (select 1 from public.carts c where c.id = cart_id and (c.customer_id = auth.uid() or public.is_admin())));
create policy "cart_items_insert_own"
  on public.cart_items for insert
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()));
create policy "cart_items_update_own"
  on public.cart_items for update
  using (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()));
create policy "cart_items_delete_own"
  on public.cart_items for delete
  using (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()));
