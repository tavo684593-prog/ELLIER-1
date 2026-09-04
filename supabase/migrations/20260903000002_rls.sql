-- RLS para las tablas que el panel CEO escribe directamente desde el navegador.
--
-- Objetivo: que un usuario autenticado normal NO pueda modificar precios, textos
-- del sitio ni el estado de pedidos ajenos, aunque llame a la API con la anon key.
--
-- Las altas de pedidos y los cambios de estado "legítimos" pasan por las Edge
-- Functions con service_role, que ignoran RLS — por eso aquí no hay políticas de
-- INSERT en orders.
--
-- Ajusta los nombres de columna a tu esquema real si difieren. Aplica en staging
-- primero.

-- ── orders ───────────────────────────────────────────────────
alter table public.orders enable row level security;

drop policy if exists "orders: dueño o admin lee" on public.orders;
create policy "orders: dueño o admin lee"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders: solo admin actualiza" on public.orders;
create policy "orders: solo admin actualiza"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Sin políticas de INSERT/DELETE: bloqueado para anon/authenticated.
-- (create-payment-intent inserta con service_role.)

-- ── product_overrides ────────────────────────────────────────
alter table public.product_overrides enable row level security;

drop policy if exists "overrides: lectura pública" on public.product_overrides;
create policy "overrides: lectura pública"
  on public.product_overrides for select
  using (true);

drop policy if exists "overrides: escritura admin" on public.product_overrides;
create policy "overrides: escritura admin"
  on public.product_overrides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── site_settings ────────────────────────────────────────────
alter table public.site_settings enable row level security;

drop policy if exists "settings: lectura pública" on public.site_settings;
create policy "settings: lectura pública"
  on public.site_settings for select
  using (true);

drop policy if exists "settings: escritura admin" on public.site_settings;
create policy "settings: escritura admin"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── design_uploads ───────────────────────────────────────────
alter table public.design_uploads enable row level security;

drop policy if exists "designs: dueño o admin lee" on public.design_uploads;
create policy "designs: dueño o admin lee"
  on public.design_uploads for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "designs: dueño inserta" on public.design_uploads;
create policy "designs: dueño inserta"
  on public.design_uploads for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── Storage ──────────────────────────────────────────────────
-- Bucket site-assets: lectura pública, escritura solo admin.
drop policy if exists "site-assets: lectura pública" on storage.objects;
create policy "site-assets: lectura pública"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "site-assets: escritura admin" on storage.objects;
create policy "site-assets: escritura admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());

-- Bucket designs: lectura pública (URLs públicas), sube cualquier autenticado,
-- borra/actualiza solo admin.
drop policy if exists "designs: lectura pública" on storage.objects;
create policy "designs: lectura pública"
  on storage.objects for select
  using (bucket_id = 'designs');

drop policy if exists "designs: sube autenticado" on storage.objects;
create policy "designs: sube autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'designs');

drop policy if exists "designs: modifica admin" on storage.objects;
create policy "designs: modifica admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'designs' and public.is_admin())
  with check (bucket_id = 'designs' and public.is_admin());

drop policy if exists "designs: borra admin" on storage.objects;
create policy "designs: borra admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'designs' and public.is_admin());
