-- Indexes for the lookups the app actually performs (foreign keys, status
-- filters, and the sort/search paths used by the admin and customer views).

-- Bookings
create index bookings_customer_id_idx on public.bookings (customer_id);
create index bookings_status_idx on public.bookings (status);
create index bookings_preferred_event_date_idx on public.bookings (preferred_event_date);
create index bookings_service_id_idx on public.bookings (service_id);
create index booking_status_history_booking_id_idx on public.booking_status_history (booking_id);
create index booking_assignments_booking_id_idx on public.booking_assignments (booking_id);
create index booking_assignments_team_member_id_idx on public.booking_assignments (team_member_id);

-- Quotations
create index quotations_booking_id_idx on public.quotations (booking_id);
create index quotation_items_quotation_id_idx on public.quotation_items (quotation_id);

-- Catalogue
create index services_is_published_idx on public.services (is_published);
create index service_gallery_service_id_idx on public.service_gallery (service_id);
create index categories_is_published_idx on public.categories (is_published);
create index products_category_id_idx on public.products (category_id);
create index products_is_published_idx on public.products (is_published);
create index product_images_product_id_idx on public.product_images (product_id);
create index product_variants_product_id_idx on public.product_variants (product_id);
create index portfolio_items_category_idx on public.portfolio_items (category);
create index portfolio_items_is_published_idx on public.portfolio_items (is_published);

-- Cart
create index cart_items_cart_id_idx on public.cart_items (cart_id);
create index cart_items_product_id_idx on public.cart_items (product_id);

-- Orders
create index orders_customer_id_idx on public.orders (customer_id);
create index orders_status_idx on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_status_history_order_id_idx on public.order_status_history (order_id);

-- Payments
create index payments_customer_id_idx on public.payments (customer_id);
create index payments_booking_id_idx on public.payments (booking_id);
create index payments_order_id_idx on public.payments (order_id);
create index payments_status_idx on public.payments (status);
