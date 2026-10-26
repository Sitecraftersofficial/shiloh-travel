alter table public.vehicles
  add column if not exists image_url text;

drop policy if exists "staff manage vehicles" on public.vehicles;

create policy "staff manage vehicles"
  on public.vehicles for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.vehicles to anon, authenticated;
grant insert, update on public.vehicles to authenticated;

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public can view vehicle images" on storage.objects;
drop policy if exists "staff can upload vehicle images" on storage.objects;
drop policy if exists "staff can update vehicle images" on storage.objects;

create policy "public can view vehicle images"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "staff can upload vehicle images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'vehicle-images' and public.is_staff());

create policy "staff can update vehicle images"
  on storage.objects for update to authenticated
  using (bucket_id = 'vehicle-images' and public.is_staff())
  with check (bucket_id = 'vehicle-images' and public.is_staff());
