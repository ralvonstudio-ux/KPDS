-- hero_images: rotating photos shown in the homepage hero carousel (see
-- src/features/home/Hero.tsx). Fully admin-managed from /admin/hero — the
-- component falls back to a hardcoded seed set only while this table is
-- empty, same pattern as FALLBACK_SERVICES/FALLBACK_PRODUCTS elsewhere.
create table public.hero_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.hero_images is 'Homepage hero carousel photos, admin-managed. Empty table = component uses its hardcoded fallback.';

alter table public.hero_images enable row level security;

create policy "hero_images_public_read_published"
  on public.hero_images for select using (is_published or public.is_admin());
create policy "hero_images_admin_write" on public.hero_images for insert with check (public.is_admin());
create policy "hero_images_admin_update" on public.hero_images for update using (public.is_admin());
create policy "hero_images_admin_delete" on public.hero_images for delete using (public.is_admin());

-- Storage bucket for hero images, same public-read/admin-write pattern as
-- portfolio/products/services (see supabase/migrations/20260811000013_storage.sql).
insert into storage.buckets (id, name, public)
values ('hero', 'hero', true)
on conflict (id) do nothing;

create policy "hero_public_read"
  on storage.objects for select using (bucket_id = 'hero');
create policy "hero_admin_write"
  on storage.objects for insert with check (bucket_id = 'hero' and public.is_admin());
create policy "hero_admin_update"
  on storage.objects for update using (bucket_id = 'hero' and public.is_admin());
create policy "hero_admin_delete"
  on storage.objects for delete using (bucket_id = 'hero' and public.is_admin());
