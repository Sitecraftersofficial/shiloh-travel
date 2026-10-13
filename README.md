# Shiloh Travel

Build the marketing website and car booking management system for Shiloh Travel Agency Ltd, based at M. Peace Plaza (KN 84 St, Inyarurembo, Nyarugenge, Kigali, Rwanda).

Key Requirements:

1. Brand & Agency Services Showcase:
   - Present Shiloh Travel Agency as a trusted, full-service travel partner in Kigali.
   - Highlight all core agency services with dedicated marketing sections and direct WhatsApp inquiry buttons (prefilled with inquiry context):
     - Air ticketing & flight reservations
     - Tour packages & guided safaris (Volcanoes gorilla trekking, Akagera, Nyungwe, Kigali city tours)
     - Visa applications & entry permits
     - Furnished apartments for rent in Kigali
     - Hotel bookings & group stays
   - Prominently feature the M. Peace Plaza office address, trust credentials, operating hours, and quick contact details.

2. Primary Online Action: Car Rental Engine:
   - Filterable fleet showcase (safari 4x4s like Land Cruiser Prado/TX, RAV4, city sedans, executive vans) with transparent rates and specs.
   - Toggle for "Self-Drive" vs. "With Professional Chauffeur".
   - Pickup and return location locked to M. Peace Plaza, Kigali.
   - Real-time date availability checker to prevent double bookings.
   - On submission, place the selected car on a 3-hour temporary hold (unless manually released or confirmed).
   - Generate a unique booking reference code (e.g. #SH-XXXX) and a one-tap WhatsApp redirect pre-filled with the exact reservation details so the customer can finalize payment directly with staff.

3. Staff Operations Dashboard:
   - A dedicated internal view for Shiloh staff at M. Peace Plaza to manage fleet and reservations.
   - View real-time status of all inquiries and cars (Available, Payment Pending / 3hr Hold, Booked & Paid, Completed, Cancelled).
   - Actions to manually "Mark Booked & Paid", "Release Car", or manually block dates for walk-in/phone clients.
   - Live countdown for active 3-hour holds.

4. External Supabase Database Architecture:
   - Structure the database schema and client to work with an external Supabase project (tables for `vehicles`, `bookings`, `inquiry_holds`, with date collision checks).
   - Include mock/fallback state so the UI and booking flow work immediately out of the box while the external Supabase project is connected.

This project is a standard Vite + React (TypeScript) single-page app using react-router-dom and Supabase.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Supabase

Credentials are read from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). When they're absent the app runs in demo mode with browser-local mock data.

Apply the versioned database setup in `supabase/migrations/` to a Supabase project in
filename order. Create staff users in Supabase Auth, then insert their user IDs into
`public.staff_users` so the private operations dashboard can read and update bookings.
Customer car holds remain WhatsApp-first and are created against the public hold policy;
payment is confirmed by staff outside the site.
