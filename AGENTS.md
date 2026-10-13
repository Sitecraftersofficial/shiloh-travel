# AGENTS.md

## Project overview

Shiloh Travel — marketing site + car rental booking app for Shiloh Travel Agency Ltd (M. Peace Plaza, Kigali, Rwanda).

Standard Vite + React 19 + TypeScript SPA. No meta-framework; entry is `index.html` → `src/main.tsx` → `src/App.tsx`. Routing is `react-router-dom`. Styling is Tailwind CSS v4 with shadcn-style components in `src/components/ui`. Data lives in an external Supabase project; credentials come from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), with browser-local mock data as fallback.

## Structure

- `src/routes/` — one page component per route (`Home`, `Services`, `CarRental`, `Contact`, `Staff`, `NotFound`), wired in `src/App.tsx`.
- `src/components/` — shared chrome (`SiteChrome.tsx`) and shadcn UI primitives (`ui/`).
- `src/lib/` — `site.ts` (contact info, WhatsApp helpers), `store.ts` (bookings/vehicles state), `supabase.ts` (client), `services.ts`, `schema-sql.ts`.
- `public/` — static assets (`robots.txt` only; there is intentionally no favicon).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run lint` / `npm run test` / `npm run format`
