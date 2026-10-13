insert into public.vehicles
  (id, name, category, seats, transmission, fuel, self_drive_rate, chauffeur_rate, features)
values
  ('lc-tx', 'Toyota Land Cruiser TX', 'safari', 7, 'Automatic', 'Diesel', 120000, 160000, '{"Pop-up roof","4x4","Fridge","Snorkel"}'),
  ('lc-prado', 'Toyota Land Cruiser Prado', 'safari', 5, 'Automatic', 'Diesel', 100000, 140000, '{"4x4","Roof rack","A/C","Bluetooth"}'),
  ('rav4', 'Toyota RAV4', 'suv', 5, 'Automatic', 'Petrol', 65000, 95000, '{"AWD","A/C","Reverse camera"}'),
  ('corolla', 'Toyota Corolla', 'sedan', 5, 'Automatic', 'Petrol', 45000, 70000, '{"A/C","Fuel efficient","Bluetooth"}'),
  ('camry', 'Toyota Camry Executive', 'sedan', 5, 'Automatic', 'Hybrid', 70000, 100000, '{"Leather seats","Hybrid","Airport-ready"}'),
  ('hiace', 'Toyota Hiace Executive Van', 'van', 14, 'Manual', 'Diesel', 110000, 150000, '{"14 seats","Luggage space","Group tours"}')
on conflict (id) do update set
  name = excluded.name,
  self_drive_rate = excluded.self_drive_rate,
  chauffeur_rate = excluded.chauffeur_rate,
  features = excluded.features;
