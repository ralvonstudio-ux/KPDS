-- orders + order_items: placed shop orders (created after Razorpay payment succeeds).
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  status public.order_status not null default 'new',
  subtotal_paise integer not null check (subtotal_paise >= 0),
  shipping_paise integer not null default 0 check (shipping_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  shipping_address jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  variant_name text,
  quantity integer not null check (quantity > 0),
  unit_price_paise integer not null check (unit_price_paise >= 0),
  amount_paise integer not null check (amount_paise >= 0),
  customisation jsonb not null default '{}',
  created_at timestamptz not null default now()
);

comment on column public.order_items.product_name is 'Snapshot of the product/variant name at order time, independent of later catalogue edits.';

-- Every status change is logged so "order tracking" has a real timeline.
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger orders_log_status_insert
  after insert on public.orders
  for each row execute function public.log_order_status_change();

create trigger orders_log_status_update
  after update on public.orders
  for each row execute function public.log_order_status_change();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

create policy "orders_select_own_or_admin"
  on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "orders_insert_own"
  on public.orders for insert with check (customer_id = auth.uid());
create policy "orders_admin_update"
  on public.orders for update using (public.is_admin());

create policy "order_items_select"
  on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
create policy "order_items_insert_own"
  on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

create policy "order_status_history_select"
  on public.order_status_history for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
