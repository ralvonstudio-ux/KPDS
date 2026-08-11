-- payments: Razorpay order/payment records. Written ONLY by edge functions
-- using the service-role key, after signature verification — no client role
-- has insert/update access, by design (see supabase/functions/*).
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  purpose public.payment_purpose not null,
  status public.payment_status not null default 'created',
  booking_id uuid references public.bookings (id) on delete set null,
  order_id uuid references public.orders (id) on delete set null,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  razorpay_signature text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_target_check check (booking_id is not null or order_id is not null)
);

create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

create policy "payments_select_own_or_admin"
  on public.payments for select using (customer_id = auth.uid() or public.is_admin());

-- Deliberately no insert/update/delete policy for authenticated or anon
-- roles: every write goes through an edge function running with the
-- service-role key, after verifying the Razorpay signature server-side.
