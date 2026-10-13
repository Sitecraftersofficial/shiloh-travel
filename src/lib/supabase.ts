import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// External Supabase project. Credentials come from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// in .env (anon/publishable key — safe for the browser). When missing, the app runs in
// demo mode with browser-local mock data.
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
