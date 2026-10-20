-- El bucket "designs" guardaba los diseños personalizados que sube cada
-- cliente como públicos: cualquiera con la URL (adivinada, filtrada o
-- compartida sin querer) podía verlos sin iniciar sesión. Lo pasamos a
-- privado y servimos las imágenes con URLs firmadas de corta duración,
-- solo para el dueño del diseño o un admin.

update storage.buckets set public = false where id = 'designs';

drop policy if exists "designs: lectura pública" on storage.objects;
drop policy if exists "designs: dueño o admin lee" on storage.objects;
create policy "designs: dueño o admin lee"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'designs' and (owner = auth.uid() or public.is_admin()));
