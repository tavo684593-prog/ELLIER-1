-- Autorización de administradores para el panel CEO.
--
-- Antes de esto la única barrera era `email === CEO_EMAIL` en el navegador.
-- Con esto, las escrituras a product_overrides / site_settings / orders quedan
-- restringidas por RLS (ver 20260903000002_rls.sql) a quien esté en `admins`.
--
-- Revisa contra tu base real antes de aplicar (`supabase db push` o SQL editor).
-- Prueba primero en un proyecto de staging.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Nadie puede leer/escribir la tabla admins desde la API (solo service_role).
drop policy if exists "admins: sin acceso público" on public.admins;
create policy "admins: sin acceso público"
  on public.admins for select
  using (false);

-- Helper usado por las políticas RLS del resto de tablas.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Alta del CEO (ejecutar UNA vez, manualmente, con el user_id real):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'ellier.agency@gmail.com'
--   on conflict do nothing;
-- ─────────────────────────────────────────────────────────────
