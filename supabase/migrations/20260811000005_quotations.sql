-- quotations + quotation_items: admin-built pricing published to the customer.
create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  status public.quotation_status not null default 'draft',
  subtotal_paise integer not null default 0,
  discount_paise integer not null default 0,
  gst_percent numeric(5, 2) not null default 18.00,
  gst_paise integer not null default 0,
  total_paise integer not null default 0,
  notes text,
  published_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_quotations_updated_at
  before update on public.quotations
  for each row execute function public.set_updated_at();

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations (id) on delete cascade,
  label text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_paise integer not null,
  amount_paise integer not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on column public.quotation_items.amount_paise is 'quantity * unit_price_paise; negative for discount line items.';

-- Recomputes subtotal/GST/total on the parent quotation whenever its line
-- items change, so the stored total can never drift from its line items.
create or replace function public.recalc_quotation_totals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_quotation_id uuid := coalesce(new.quotation_id, old.quotation_id);
  v_subtotal integer;
  v_gst_percent numeric(5, 2);
  v_discount integer;
  v_gst integer;
begin
  select coalesce(sum(amount_paise), 0) into v_subtotal
  from public.quotation_items
  where quotation_id = target_quotation_id;

  select gst_percent, discount_paise into v_gst_percent, v_discount
  from public.quotations where id = target_quotation_id;

  v_gst := round(greatest(v_subtotal - coalesce(v_discount, 0), 0) * coalesce(v_gst_percent, 0) / 100.0);

  update public.quotations
  set subtotal_paise = v_subtotal,
      gst_paise = v_gst,
      total_paise = greatest(v_subtotal - coalesce(v_discount, 0), 0) + v_gst
  where id = target_quotation_id;

  return null;
end;
$$;

create trigger quotation_items_recalc
  after insert or update or delete on public.quotation_items
  for each row execute function public.recalc_quotation_totals();

-- Customer-facing "accept quotation" action. Runs as a function instead of a
-- direct table UPDATE so acceptance can only happen on the customer's own
-- published quotation and always flips the booking status alongside it.
create or replace function public.accept_quotation(p_quotation_id uuid)
returns public.quotations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quotation public.quotations;
  v_booking_id uuid;
begin
  select q.*, b.id into v_quotation, v_booking_id
  from public.quotations q
  join public.bookings b on b.id = q.booking_id
  where q.id = p_quotation_id and b.customer_id = auth.uid();

  if v_quotation.id is null then
    raise exception 'Quotation not found or not owned by the current user.';
  end if;

  if v_quotation.status <> 'published' then
    raise exception 'Only a published quotation can be accepted.';
  end if;

  update public.quotations
  set status = 'accepted', accepted_at = now()
  where id = p_quotation_id
  returning * into v_quotation;

  update public.bookings set status = 'confirmed' where id = v_booking_id;

  return v_quotation;
end;
$$;

alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;

create policy "quotations_select_own_published_or_admin"
  on public.quotations for select
  using (
    public.is_admin()
    or (
      status in ('published', 'accepted')
      and exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = auth.uid())
    )
  );

create policy "quotations_admin_write"
  on public.quotations for insert with check (public.is_admin());
create policy "quotations_admin_update"
  on public.quotations for update using (public.is_admin());
create policy "quotations_admin_delete"
  on public.quotations for delete using (public.is_admin());

create policy "quotation_items_select"
  on public.quotation_items for select
  using (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id
        and (
          public.is_admin()
          or (
            q.status in ('published', 'accepted')
            and exists (select 1 from public.bookings b where b.id = q.booking_id and b.customer_id = auth.uid())
          )
        )
    )
  );

create policy "quotation_items_admin_write"
  on public.quotation_items for insert with check (public.is_admin());
create policy "quotation_items_admin_update"
  on public.quotation_items for update using (public.is_admin());
create policy "quotation_items_admin_delete"
  on public.quotation_items for delete using (public.is_admin());
