export const SCHEMA_SQL = `-- Shiloh Travel Agency · Car rental schema
-- Paste into your Supabase project: SQL Editor → New query → Run.

create extension if not exists btree_gist;

-- 1. Vehicles ---------------------------------------------------------------
create table if not exists public.vehicles (
  id text primary key,
  name text not null,
  category text not null check (category in ('safari','suv','sedan','van')),
  seats int not null,
  transmission text not null,
  fuel text not null,
  self_drive_rate int not null,   -- RWF per day
  chauffeur_rate int not null,    -- RWF per day
  features text[] not null default '{}',
  image_url text,
  active boolean not null default true
);

-- 2. Bookings (holds, paid bookings, manual blocks) -------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,               -- e.g. SH-K7Q2
  vehicle_id text not null references public.vehicles(id),
  customer_name text not null,
  phone text not null,
  email text,
  start_date date not null,
  end_date date not null,
  mode text not null check (mode in ('self','chauffeur')),
  status text not null default 'hold'
    check (status in ('hold','paid','completed','cancelled','blocked')),
  total int not null default 0,
  notes text,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

-- Date collision guard: no two active bookings for the same car may overlap.
-- (Expired holds are cleared by the release function below.)
alter table public.bookings drop constraint if exists no_overlap;
alter table public.bookings add constraint no_overlap
  exclude using gist (
    vehicle_id with =,
    daterange(start_date, end_date, '[]') with &&
  ) where (status in ('hold','paid','blocked'));

-- 3. Holds log (3-hour temporary holds) -------------------------------------
create table if not exists public.holds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  vehicle_id text not null references public.vehicles(id),
  expires_at timestamptz not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

-- Release expired holds (call before inserts, or schedule with pg_cron every 5 min)
create or replace function public.release_expired_holds() returns void
language sql security definer set search_path = public as $$
  update public.bookings set status = 'cancelled', notes = coalesce(notes,'') || ' [hold expired]'
   where status = 'hold' and hold_expires_at < now();
  update public.holds set released = true where expires_at < now() and released = false;
$$;
-- select cron.schedule('release-holds', '*/5 * * * *', 'select public.release_expired_holds()');

-- 4. Grants + Row Level Security --------------------------------------------
grant select, insert, update on public.vehicles to authenticated;
grant select on public.vehicles to anon;
grant select, insert, update on public.bookings to anon, authenticated;
grant select, insert, update on public.holds to anon, authenticated;
grant all on public.vehicles, public.bookings, public.holds to service_role;

alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.holds enable row level security;

create policy "public read vehicles" on public.vehicles for select using (active);
create policy "staff manage vehicles" on public.vehicles for all
  to authenticated using (true) with check (true);
-- NOTE: these demo policies let the browser read/update bookings so the staff
-- dashboard works with the anon key. Before going live, add Supabase Auth for
-- staff and restrict select/update on bookings to authenticated staff.
create policy "anyone can create a hold" on public.bookings for insert
  with check (status = 'hold');
create policy "read bookings" on public.bookings for select using (true);
create policy "update bookings" on public.bookings for update using (true);
create policy "holds insert" on public.holds for insert with check (true);
create policy "holds read" on public.holds for select using (true);
create policy "holds update" on public.holds for update using (true);

-- 5. Seed fleet --------------------------------------------------------------
insert into public.vehicles (id,name,category,seats,transmission,fuel,self_drive_rate,chauffeur_rate,features) values
 ('lc-tx','Toyota Land Cruiser TX','safari',7,'Automatic','Diesel',50000,160000,'{"Pop-up roof","4x4","Fridge","Snorkel"}'),
 ('lc-prado','Toyota Land Cruiser Prado','safari',5,'Automatic','Diesel',50000,140000,'{"4x4","Roof rack","A/C","Bluetooth"}'),
 ('rav4','Toyota RAV4','suv',5,'Automatic','Petrol',50000,95000,'{"AWD","A/C","Reverse camera"}'),
 ('corolla','Toyota Corolla','sedan',5,'Automatic','Petrol',50000,70000,'{"A/C","Fuel efficient","Bluetooth"}'),
 ('camry','Toyota Camry Executive','sedan',5,'Automatic','Hybrid',50000,100000,'{"Leather seats","Hybrid","Airport-ready"}'),
 ('hiace','Toyota Hiace Executive Van','van',14,'Manual','Diesel',50000,150000,'{"14 seats","Luggage space","Group tours"}'),
 ('santafe-rai262p','Hyundai Santa Fe · RAI 262P','suv',7,'Automatic','Petrol',50000,120000,'{"7 seats","AWD","A/C","Bluetooth"}'),
 ('sorento2015-raj673m','Kia Sorento 2015 · RAJ 673M','suv',7,'Automatic','Diesel',50000,115000,'{"7 seats","A/C","Bluetooth"}'),
 ('sorento2014-raj736c','Kia Sorento 2014 · RAJ 736C','suv',7,'Automatic','Diesel',50000,110000,'{"7 seats","A/C","Bluetooth"}'),
 ('sorento2013-rad626d','Kia Sorento 2013 · RAD 626D','suv',7,'Automatic','Diesel',50000,105000,'{"7 seats","A/C"}'),
 ('niro-rah846n','Kia Niro · RAH 846N','suv',5,'Automatic','Hybrid',50000,100000,'{"Hybrid","Fuel efficient","A/C","Bluetooth"}'),
 ('byd-sealion','BYD Sealion','suv',5,'Automatic','Electric',50000,130000,'{"Electric","A/C","Bluetooth"}')
on conflict (id) do nothing;
`;
