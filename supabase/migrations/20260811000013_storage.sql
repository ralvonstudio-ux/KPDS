-- Storage buckets for portfolio images, product images, and customer gift-
-- customisation uploads, with policies matching the table RLS above.
insert into storage.buckets (id, name, public)
values
  ('portfolio', 'portfolio', true),
  ('products', 'products', true),
  ('services', 'services', true),
  ('customer-uploads', 'customer-uploads', false)
on conflict (id) do nothing;

-- Public, admin-managed buckets: anyone can view; only admins can write.
create policy "portfolio_public_read"
  on storage.objects for select using (bucket_id = 'portfolio');
create policy "portfolio_admin_write"
  on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio_admin_update"
  on storage.objects for update using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio_admin_delete"
  on storage.objects for delete using (bucket_id = 'portfolio' and public.is_admin());

create policy "products_public_read"
  on storage.objects for select using (bucket_id = 'products');
create policy "products_admin_write"
  on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
create policy "products_admin_update"
  on storage.objects for update using (bucket_id = 'products' and public.is_admin());
create policy "products_admin_delete"
  on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

create policy "services_public_read"
  on storage.objects for select using (bucket_id = 'services');
create policy "services_admin_write"
  on storage.objects for insert with check (bucket_id = 'services' and public.is_admin());
create policy "services_admin_update"
  on storage.objects for update using (bucket_id = 'services' and public.is_admin());
create policy "services_admin_delete"
  on storage.objects for delete using (bucket_id = 'services' and public.is_admin());

-- Private bucket for customer gift-customisation photo uploads: each
-- customer's files live under a folder named after their own user id
-- (enforced by requiring the first path segment to equal auth.uid()), so a
-- customer can only ever read or write their own uploads; admins can read
-- all of them to fulfil orders.
create policy "customer_uploads_owner_read"
  on storage.objects for select
  using (
    bucket_id = 'customer-uploads'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

create policy "customer_uploads_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'customer-uploads' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "customer_uploads_owner_delete"
  on storage.objects for delete
  using (bucket_id = 'customer-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
