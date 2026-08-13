-- Sample content for a fresh dev/staging database — NOT meant for production.
-- Run manually after `supabase db push`:
--   psql "$DATABASE_URL" -f supabase/seed.sql
-- or, for local dev, `supabase db reset` runs this automatically.
--
-- Every image below is a placeholder from picsum.photos (free, no auth,
-- deterministic per seed name) so the site looks populated during review.
-- Replace every cover_image_url / image_url with real studio photography
-- before launch — see docs/handover.md "Replacing seed content".

-- ============================= Services =====================================
insert into public.services (slug, title, summary, description, cover_image_url, deliverables, starting_price_paise, is_custom_quote, faqs, is_published, sort_order)
values
  (
    'wedding-photography',
    'Wedding Photography',
    'Full-day documentary and portrait coverage for your wedding.',
    'From the first look to the last dance, we cover your wedding day with a blend of candid documentary shots and directed portraits — delivered as a curated, editorial gallery you will want to look at for years.',
    'https://picsum.photos/seed/kps-wedding-cover/1600/900',
    array['8 hours of coverage', '500+ edited high-resolution photos', 'Online gallery for sharing', 'USB drive with full-resolution files'],
    7500000, false,
    '[{"question":"How many photographers cover our wedding?","answer":"Every wedding package includes a lead photographer and a second shooter as standard."},{"question":"How long until we receive our photos?","answer":"Your full edited gallery is delivered within 4-6 weeks of your wedding date."}]'::jsonb,
    true, 1
  ),
  (
    'pre-wedding-shoot',
    'Pre-Wedding Shoot',
    'A relaxed half-day shoot to capture your story before the big day.',
    'A guided, low-pressure session at a location of your choice — golden hour, city streets, or somewhere sentimental to you both.',
    'https://picsum.photos/seed/kps-prewedding-cover/1600/900',
    array['3 hours of coverage', '150+ edited photos', 'One outfit change', 'Online gallery'],
    2500000, false,
    '[{"question":"Can we choose our own location?","answer":"Yes — we will help you scout a location that fits the mood you want."}]'::jsonb,
    true, 2
  ),
  (
    'videography',
    'Wedding Videography',
    'Cinematic highlight films and full-ceremony footage.',
    'A cinematic same-day-edit highlight reel plus a longer documentary cut of your ceremony, shot on professional cinema cameras with a dedicated audio setup.',
    'https://picsum.photos/seed/kps-video-cover/1600/900',
    array['4-6 minute highlight film', 'Full ceremony footage', 'Drone footage (where permitted)', 'Licensed background music'],
    9000000, false,
    '[]'::jsonb,
    true, 3
  ),
  (
    'corporate-events',
    'Corporate Events',
    'Coverage for conferences, product launches, and brand shoots.',
    'Professional coverage for corporate events of any size — headshots, keynote coverage, candid networking shots, and brand photography your marketing team can actually use.',
    'https://picsum.photos/seed/kps-corporate-cover/1600/900',
    array['Full event coverage', 'Same-day preview gallery', 'Commercial usage rights'],
    null, true,
    '[]'::jsonb,
    true, 4
  ),
  (
    'portrait-sessions',
    'Portrait & Personal Shoots',
    'Individual and family portrait sessions in-studio or on location.',
    'A relaxed portrait session designed around you — headshots, family portraits, or a personal project — shot in-studio or on location.',
    'https://picsum.photos/seed/kps-portrait-cover/1600/900',
    array['1 hour session', '30+ edited photos', 'Print-ready files'],
    1200000, false,
    '[]'::jsonb,
    true, 5
  )
on conflict (slug) do nothing;

insert into public.service_gallery (service_id, image_url, caption, sort_order)
select s.id, 'https://picsum.photos/seed/kps-' || s.slug || '-g' || g, null, g
from public.services s
cross join generate_series(1, 4) as g;

-- ============================= Portfolio ====================================
insert into public.portfolio_items (title, category, description, cover_image_url, gallery, is_published, sort_order)
values
  ('Anjali & Rohan', 'Weddings', 'A monsoon wedding in Udaipur.', 'https://picsum.photos/seed/kps-port-1/1200/1500', '["https://picsum.photos/seed/kps-port-1b/1200/1500","https://picsum.photos/seed/kps-port-1c/1200/1500"]'::jsonb, true, 1),
  ('Studio Portraits', 'Portraits', 'A personal project shot entirely on natural light.', 'https://picsum.photos/seed/kps-port-2/1200/1500', '[]'::jsonb, true, 2),
  ('Meera & Aditya', 'Weddings', 'Destination wedding at a hillside resort.', 'https://picsum.photos/seed/kps-port-3/1200/1600', '["https://picsum.photos/seed/kps-port-3b/1200/1600"]'::jsonb, true, 3),
  ('TechConf 2025', 'Corporate', 'Two-day conference coverage for a Bangalore tech company.', 'https://picsum.photos/seed/kps-port-4/1600/1000', '[]'::jsonb, true, 4),
  ('Golden Hour', 'Pre-Wedding', 'A pre-wedding shoot along the coast.', 'https://picsum.photos/seed/kps-port-5/1200/1500', '[]'::jsonb, true, 5),
  ('The Kapoor Family', 'Portraits', 'A three-generation family portrait session.', 'https://picsum.photos/seed/kps-port-6/1400/1100', '[]'::jsonb, true, 6),
  ('Priya & Karan', 'Weddings', 'A traditional South Indian wedding ceremony.', 'https://picsum.photos/seed/kps-port-7/1200/1600', '[]'::jsonb, true, 7),
  ('Brand Launch', 'Corporate', 'Product photography for a D2C skincare brand.', 'https://picsum.photos/seed/kps-port-8/1400/1050', '[]'::jsonb, true, 8);

-- ============================= Testimonials =================================
insert into public.testimonials (author_name, author_role, quote, rating, is_published, sort_order)
values
  ('Anjali Sharma', 'Wedding client, Udaipur', 'Khatu Pixel captured our wedding exactly as it felt — warm, chaotic, and full of joy. We still look through the gallery months later.', 5, true, 1),
  ('Rohan Mehta', 'Corporate client, Bangalore', 'Professional, fast turnaround, and the photos were genuinely usable for our marketing — not just nice to look at.', 5, true, 2),
  ('Meera Iyer', 'Portrait client', 'Such a relaxed session. They made a normally awkward experience actually fun.', 5, true, 3);

-- ============================= Shop: categories & products ==================
insert into public.categories (slug, name, description, cover_image_url, is_published, sort_order)
values
  ('photo-frames', 'Photo Frames', 'Framed prints of your favourite moments.', 'https://picsum.photos/seed/kps-cat-frames/1200/900', true, 1),
  ('printed-albums', 'Printed Albums', 'Bound photo albums, printed on premium matte paper.', 'https://picsum.photos/seed/kps-cat-albums/1200/900', true, 2),
  ('personalised-gifts', 'Personalised Gifts', 'Mugs, cushions, and keepsakes printed with your photos.', 'https://picsum.photos/seed/kps-cat-gifts/1200/900', true, 3)
on conflict (slug) do nothing;

insert into public.products (category_id, slug, name, description, base_price_paise, is_customisable, customisation_fields, stock_tracked, stock_quantity, is_published, sort_order)
select c.id, v.slug, v.name, v.description, v.price, v.customisable, v.fields::jsonb, true, 25, true, v.sort_order
from public.categories c
join (values
  ('photo-frames', 'classic-wooden-frame', 'Classic Wooden Frame', 'A solid-wood frame available in three sizes, ready to hang or stand.', 149900, true, '[{"key":"photo-upload","label":"Upload your photo","type":"photo","required":true}]', 1),
  ('photo-frames', 'floating-glass-frame', 'Floating Glass Frame', 'A modern frameless look — your photo appears to float between two panes of glass.', 199900, true, '[{"key":"photo-upload","label":"Upload your photo","type":"photo","required":true}]', 2),
  ('printed-albums', 'wedding-storybook-album', 'Wedding Storybook Album', 'A 40-page hardbound album laid out from your wedding gallery.', 499900, true, '[{"key":"notes","label":"Layout notes for our designer","type":"textarea","required":false}]', 1),
  ('printed-albums', 'mini-travel-album', 'Mini Travel Album', 'A compact 20-page softbound album, perfect for a weekend trip or pre-wedding shoot.', 249900, true, '[{"key":"photo-upload","label":"Upload a cover photo","type":"photo","required":false}]', 2),
  ('personalised-gifts', 'photo-mug', 'Photo Mug', 'A ceramic mug printed with your photo.', 59900, true, '[{"key":"photo-upload","label":"Upload your photo","type":"photo","required":true}]', 1),
  ('personalised-gifts', 'photo-cushion', 'Photo Cushion', 'A soft cushion cover printed with your photo, insert included.', 89900, true, '[{"key":"photo-upload","label":"Upload your photo","type":"photo","required":true}]', 2)
) as v(cat_slug, slug, name, description, price, customisable, fields, sort_order) on v.cat_slug = c.slug
on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, sort_order)
select p.id, 'https://picsum.photos/seed/kps-prod-' || p.slug, 1
from public.products p;

insert into public.product_variants (product_id, name, price_paise, stock_quantity, is_default)
select p.id, v.name, v.price, 15, v.is_default
from public.products p
join (values
  ('classic-wooden-frame', 'Small (5x7")', 149900, true),
  ('classic-wooden-frame', 'Medium (8x10")', 199900, false),
  ('classic-wooden-frame', 'Large (12x16")', 299900, false)
) as v(slug, name, price, is_default) on v.slug = p.slug;
