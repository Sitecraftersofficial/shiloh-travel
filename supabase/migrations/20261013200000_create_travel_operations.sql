create extension if not exists btree_gist;

create table if not exists public.vehicles (
  id text primary key,
  name text not null,
  category text not null check (category in ('safari','suv','sedan','van')),
  seats int not null check (seats > 0),
  transmission text not null,
  fuel text not null,
  self_drive_rate int not null check (self_drive_rate >= 0),
  chauffeur_rate int not null check (chauffeur_rate >= 0),
  features text[] not null default '{}',
  active boolean not null default true
);

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
  return_time time not null default '09:00',
  mode text not null check (mode in ('self','chauffeur')),
  status text not null default 'hold'
    check (status in ('hold','paid','completed','cancelled','blocked')),
  total int not null default 0 check (total >= 0),
  notes text,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (end_date > start_date or (end_date = start_date and return_time > pickup_time)),
  exclude using gist (
    vehicle_id with =,
    tstzrange(
      (start_date + pickup_time) at time zone 'Africa/Kigali',
      (end_date + return_time) at time zone 'Africa/Kigali',
      '[)'
    ) with &&
  ) where (status in ('hold','paid','blocked'))
);

create table if not exists public.holds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  vehicle_id text not null references public.vehicles(id),
  expires_at timestamptz not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists bookings_vehicle_interval_idx
  on public.bookings (vehicle_id, start_date, end_date);
create index if not exists bookings_status_idx on public.bookings (status);

create or replace function public.release_expired_holds()
returns void language sql security definer set search_path = public as $$
  update public.bookings
  set status = 'cancelled', notes = concat_ws(' ', notes, '[hold expired]')
  where status = 'hold' and hold_expires_at < now();
  update public.holds
  set released = true
  where expires_at < now() and released = false;
$$;

alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.holds enable row level security;
alter table public.staff_users enable row level security;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff_users where user_id = auth.uid());
$$;

create policy "public can view active vehicles"
  on public.vehicles for select using (active or public.is_staff());
create policy "public can create holds"
  on public.bookings for insert with check (status = 'hold');
create policy "staff can view bookings"
  on public.bookings for select using (public.is_staff());
create policy "staff can update bookings"
  on public.bookings for update using (public.is_staff()) with check (public.is_staff());
create policy "public can create hold records"
  on public.holds for insert with check (exists (
    select 1 from public.bookings b where b.id = booking_id and b.status = 'hold'
  ));
create policy "staff can manage holds"
  on public.holds for all using (public.is_staff()) with check (public.is_staff());
create policy "staff can read staff users"
  on public.staff_users for select using (public.is_staff());

grant select on public.vehicles to anon, authenticated;
grant insert on public.bookings to anon, authenticated;
grant select, update on public.bookings to authenticated;
grant insert on public.holds to anon, authenticated;
grant select, update on public.holds to authenticated;
