-- Shiloh Travel Agency · complete Supabase setup
-- Run this file in Supabase Dashboard → SQL Editor → Run.
--
-- It is safe to run repeatedly. It creates missing objects, adds missing
-- columns, replaces this project's constraints and policies, and upserts the
-- fleet seed data. It does not delete bookings, vehicles, or staff users.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.vehicles (
  id text primary key,
  name text not null,
  category text not null check (category in ('safari', 'suv', 'sedan', 'van')),
  seats integer not null check (seats > 0),
  transmission text not null,
  fuel text not null,
  self_drive_rate integer not null check (self_drive_rate >= 0),
  chauffeur_rate integer not null check (chauffeur_rate >= 0),
  features text[] not null default '{}',
  image_url text,
  active boolean not null default true
);

alter table public.vehicles add column if not exists image_url text;

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  vehicle_id text not null references public.vehicles(id),
  customer_name text not null,
  phone text not null,
  email text,
  start_date date not null,
  end_date date not null,
  pickup_time time not null default '09:00',
  return_time time not null default '17:00',
  mode text not null check (mode in ('self', 'chauffeur')),
  status text not null default 'hold'
    check (status in ('hold', 'paid', 'completed', 'cancelled', 'blocked')),
  total integer not null default 0 check (total >= 0),
  notes text,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint bookings_valid_interval
    check (end_date > start_date or (end_date = start_date and return_time > pickup_time))
);

-- Upgrade databases created from the older schema.
alter table public.bookings add column if not exists pickup_time time;
alter table public.bookings add column if not exists return_time time;
update public.bookings
set pickup_time = coalesce(pickup_time, '09:00'::time),
    return_time = coalesce(return_time, '17:00'::time)
where pickup_time is null or return_time is null;
alter table public.bookings alter column pickup_time set default '09:00';
alter table public.bookings alter column pickup_time set not null;
alter table public.bookings alter column return_time set default '17:00';
alter table public.bookings alter column return_time set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and conname = 'bookings_valid_interval'
  ) then
    alter table public.bookings
      add constraint bookings_valid_interval
      check (end_date > start_date or (end_date = start_date and return_time > pickup_time));
  end if;
end;
$$;

create table if not exists public.holds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  vehicle_id text not null references public.vehicles(id),
  expires_at timestamptz not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Constraints and indexes
-- ---------------------------------------------------------------------------

create index if not exists bookings_vehicle_interval_idx
  on public.bookings (vehicle_id, start_date, end_date);
create index if not exists bookings_status_idx on public.bookings (status);
create unique index if not exists holds_booking_id_uidx
  on public.holds (booking_id);

-- Replace the older date-only overlap rule with the app's time-aware rule.
-- Dropping only exclusion constraints is intentional: the rule is recreated
-- consistently when this file is run again.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and contype = 'x'
  loop
    execute format(
      'alter table public.bookings drop constraint %I',
      constraint_name
    );
  end loop;

  alter table public.bookings
    add constraint bookings_no_overlap
    exclude using gist (
      vehicle_id with =,
      tstzrange(
        (start_date + pickup_time) at time zone 'Africa/Kigali',
        (end_date + return_time) at time zone 'Africa/Kigali',
        '[)'
      ) with &&
    )
    where (status in ('hold', 'paid', 'blocked'));
end;
$$;

-- ---------------------------------------------------------------------------
-- Hold expiry function
-- ---------------------------------------------------------------------------

create or replace function public.release_expired_holds()
returns void
language sql
security definer
set search_path = public
as $$
  update public.bookings
  set status = 'cancelled',
      notes = concat_ws(' ', notes, '[hold expired]')
  where status = 'hold'
    and hold_expires_at < now();

  update public.holds
  set released = true
  where expires_at < now()
    and released = false;
$$;

-- ---------------------------------------------------------------------------
-- Row-level security and access policies
-- ---------------------------------------------------------------------------

alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.holds enable row level security;
alter table public.staff_users enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_users
    where user_id = auth.uid()
  );
$$;

-- Remove policy names from both previous schema versions before recreating
-- the intended policy set.
drop policy if exists "public read vehicles" on public.vehicles;
drop policy if exists "public can view active vehicles" on public.vehicles;
drop policy if exists "staff manage vehicles" on public.vehicles;
drop policy if exists "anyone can create a hold" on public.bookings;
drop policy if exists "public can create holds" on public.bookings;
drop policy if exists "read bookings" on public.bookings;
drop policy if exists "staff can view bookings" on public.bookings;
drop policy if exists "update bookings" on public.bookings;
drop policy if exists "staff can update bookings" on public.bookings;
drop policy if exists "holds insert" on public.holds;
drop policy if exists "public can create hold records" on public.holds;
drop policy if exists "holds read" on public.holds;
drop policy if exists "holds update" on public.holds;
drop policy if exists "staff can manage holds" on public.holds;
drop policy if exists "staff can read staff users" on public.staff_users;

create policy "public can view active vehicles"
  on public.vehicles for select
  using (active or public.is_staff());

create policy "staff manage vehicles"
  on public.vehicles for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "public can create holds"
  on public.bookings for insert
  with check (status = 'hold');

create policy "staff can view bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "staff can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

create policy "public can create hold records"
  on public.holds for insert
  with check (true);

create policy "staff can manage holds"
  on public.holds for all
  to authenticated
  using (true)
  with check (true);

create policy "staff can read staff users"
  on public.staff_users for select
  to authenticated
  using (true);

-- The service role bypasses RLS. These grants allow the browser to create
-- public holds while keeping bookings and staff data staff-only.
grant select on public.vehicles to anon, authenticated;
grant insert, update on public.vehicles to authenticated;
grant insert on public.bookings to anon, authenticated;
grant select, update on public.bookings to authenticated;
grant insert on public.holds to anon, authenticated;
grant select, update on public.holds to authenticated;
grant all on public.vehicles, public.bookings, public.holds, public.staff_users
  to service_role;

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

-- ---------------------------------------------------------------------------
-- Fleet seed
-- ---------------------------------------------------------------------------

insert into public.vehicles (
  id, name, category, seats, transmission, fuel,
  self_drive_rate, chauffeur_rate, features, active
)
values
  ('lc-tx', 'Toyota Land Cruiser TX', 'safari', 7, 'Automatic', 'Diesel',
   50000, 160000, '{"Pop-up roof","4x4","Fridge","Snorkel"}', true),
  ('lc-prado', 'Toyota Land Cruiser Prado', 'safari', 5, 'Automatic', 'Diesel',
   50000, 140000, '{"4x4","Roof rack","A/C","Bluetooth"}', true),
  ('rav4', 'Toyota RAV4', 'suv', 5, 'Automatic', 'Petrol',
   50000, 95000, '{"AWD","A/C","Reverse camera"}', true),
  ('corolla', 'Toyota Corolla', 'sedan', 5, 'Automatic', 'Petrol',
   50000, 70000, '{"A/C","Fuel efficient","Bluetooth"}', true),
  ('camry', 'Toyota Camry Executive', 'sedan', 5, 'Automatic', 'Hybrid',
   50000, 100000, '{"Leather seats","Hybrid","Airport-ready"}', true),
  ('hiace', 'Toyota Hiace Executive Van', 'van', 14, 'Manual', 'Diesel',
   50000, 150000, '{"14 seats","Luggage space","Group tours"}', true)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  seats = excluded.seats,
  transmission = excluded.transmission,
  fuel = excluded.fuel,
  self_drive_rate = excluded.self_drive_rate,
  chauffeur_rate = excluded.chauffeur_rate,
  features = excluded.features,
  active = excluded.active;

-- ---------------------------------------------------------------------------
-- Verification queries (run separately if you want a quick health check)
-- ---------------------------------------------------------------------------
-- select table_name from information_schema.tables
-- where table_schema = 'public'
--   and table_name in ('vehicles', 'staff_users', 'bookings', 'holds')
-- order by table_name;
-- select id, name, active from public.vehicles order by id;
-- select count(*) as booking_count from public.bookings;
