import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export type Mode = "self" | "chauffeur";
export type Status = "hold" | "paid" | "completed" | "cancelled" | "blocked";
export type Category = "safari" | "suv" | "sedan" | "van";

export interface Vehicle {
  id: string;
  name: string;
  category: Category;
  seats: number;
  transmission: string;
  fuel: string;
  self_drive_rate: number;
  chauffeur_rate: number;
  features: string[];
}

export interface Booking {
  id: string;
  ref: string;
  vehicle_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  start_date: string; // yyyy-mm-dd
  end_date: string;
  pickup_time: string; // HH:mm, Kigali local time
  return_time: string;
  mode: Mode;
  status: Status;
  total: number;
  notes: string | null;
  hold_expires_at: string | null;
  created_at: string;
}

export const HOLD_MS = 3 * 60 * 60 * 1000;

// TEMP: all cars flat-priced — self-drive 60,000 / chauffeur 90,000 RWF per day.
const TEMP_SELF_DRIVE = 60000;
const TEMP_CHAUFFEUR = 90000;

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: "santafe-rai262p",
    name: "Hyundai Santa Fe · RAI 262P",
    category: "suv",
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["7 seats", "AWD", "A/C", "Bluetooth"],
  },
  {
    id: "sorento2015-raj673m",
    name: "Kia Sorento 2015 · RAJ 673M",
    category: "suv",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["7 seats", "A/C", "Bluetooth"],
  },
  {
    id: "sorento2014-raj736c",
    name: "Kia Sorento 2014 · RAJ 736C",
    category: "suv",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["7 seats", "A/C", "Bluetooth"],
  },
  {
    id: "sorento2013-rad626d",
    name: "Kia Sorento 2014 · RAD 626D",
    category: "suv",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["7 seats", "A/C"],
  },
  {
    id: "niro-rah846n",
    name: "Kia Niro · RAH 846N",
    category: "suv",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["Hybrid", "Fuel efficient", "A/C", "Bluetooth"],
  },
  {
    id: "byd-sealion",
    name: "BYD Sealion",
    category: "suv",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    self_drive_rate: TEMP_SELF_DRIVE,
    chauffeur_rate: TEMP_CHAUFFEUR,
    features: ["Electric", "A/C", "Bluetooth"],
  },
];

// ---------- helpers ----------
export function genRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SH-${s}`;
}

export function rentalDays(start: string, end: string) {
  const d = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
  return Math.max(1, Math.round(d) + 1);
}

export function overlaps(
  aS: string,
  aE: string,
  bS: string,
  bE: string,
  aStartTime = "00:00",
  aEndTime = "23:59",
  bStartTime = "00:00",
  bEndTime = "23:59",
) {
  return `${aS}T${aStartTime}` < `${bE}T${bEndTime}` && `${bS}T${bStartTime}` < `${aE}T${aEndTime}`;
}

export function effectiveStatus(b: Booking, now = Date.now()): Status | "expired" {
  if (b.status === "hold" && b.hold_expires_at && new Date(b.hold_expires_at).getTime() <= now)
    return "expired";
  return b.status;
}

export function isBlocking(b: Booking, now = Date.now()) {
  const s = effectiveStatus(b, now);
  return s === "hold" || s === "paid" || s === "blocked";
}

export function conflicts(
  bookings: Booking[],
  vehicleId: string,
  start: string,
  end: string,
  pickupTime = "00:00",
  returnTime = "23:59",
  now = Date.now(),
) {
  return bookings.filter(
    (b) =>
      b.vehicle_id === vehicleId &&
      isBlocking(b, now) &&
      overlaps(
        start,
        end,
        b.start_date,
        b.end_date,
        pickupTime,
        returnTime,
        b.pickup_time,
        b.return_time,
      ),
  );
}

// ---------- mock (demo) storage ----------
const LS_KEY = "shiloh-demo-bookings-v1";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readLocal(): Booking[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Booking[];
    } catch {
      /* reset */
    }
  }
  const seed = demoSeed();
  window.localStorage.setItem(LS_KEY, JSON.stringify(seed));
  return seed;
}
function writeLocal(list: Booking[]) {
  window.localStorage.setItem(LS_KEY, JSON.stringify(list));
  emit();
}
function iso(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function demoSeed(): Booking[] {
  const now = Date.now();
  const base = { email: null, notes: null, created_at: new Date(now).toISOString() };
  return [
    {
      ...base,
      id: "d1",
      ref: "SH-K7Q2",
      vehicle_id: "lc-tx",
      customer_name: "Grace Uwase",
      phone: "+250 781 111 222",
      start_date: iso(2),
      end_date: iso(5),
      pickup_time: "09:00",
      return_time: "17:00",
      mode: "chauffeur",
      status: "hold",
      total: 640000,
      hold_expires_at: new Date(now + 2 * 3600 * 1000).toISOString(),
    },
    {
      ...base,
      id: "d2",
      ref: "SH-M4TR",
      vehicle_id: "corolla",
      customer_name: "James Miller",
      phone: "+44 7700 900123",
      start_date: iso(1),
      end_date: iso(3),
      pickup_time: "10:00",
      return_time: "16:00",
      mode: "self",
      status: "paid",
      total: 135000,
      hold_expires_at: null,
    },
    {
      ...base,
      id: "d3",
      ref: "SH-WALK",
      vehicle_id: "hiace",
      customer_name: "Walk-in · church group",
      phone: "—",
      start_date: iso(6),
      end_date: iso(7),
      pickup_time: "08:00",
      return_time: "18:00",
      mode: "chauffeur",
      status: "blocked",
      total: 0,
      notes: "Phone booking",
      hold_expires_at: null,
    },
  ];
}

// ---------- data API ----------
// The fleet is defined locally (photos live in src/assets) — the Supabase
// vehicles table is ignored so only these cars are shown on the site.
export async function fetchVehicles(): Promise<Vehicle[]> {
  return SEED_VEHICLES;
}

export async function fetchBookings(): Promise<Booking[]> {
  if (!supabase) return readLocal();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((booking) => ({
    ...booking,
    pickup_time: booking.pickup_time ?? "09:00",
    return_time: booking.return_time ?? "17:00",
  })) as Booking[];
}

export interface HoldInput {
  vehicle_id: string;
  customer_name: string;
  phone: string;
  email?: string;
  start_date: string;
  end_date: string;
  pickup_time: string;
  return_time: string;
  mode: Mode;
  total: number;
  notes?: string;
}

export async function createHold(input: HoldInput): Promise<Booking> {
  // Supabase enforces overlap server-side with the exclusion constraint.
  // Avoid reading private booking records from the public booking form.
  const current = supabase ? [] : await fetchBookings();
  if (
    conflicts(
      current,
      input.vehicle_id,
      input.start_date,
      input.end_date,
      input.pickup_time,
      input.return_time,
    ).length
  ) {
    throw new Error(
      "Sorry — this car was just reserved for some of those dates. Please pick other dates or another vehicle.",
    );
  }
  const booking: Booking = {
    id: crypto.randomUUID(),
    ref: genRef(),
    vehicle_id: input.vehicle_id,
    customer_name: input.customer_name,
    phone: input.phone,
    email: input.email || null,
    start_date: input.start_date,
    end_date: input.end_date,
    pickup_time: input.pickup_time,
    return_time: input.return_time,
    mode: input.mode,
    status: "hold",
    total: input.total,
    notes: input.notes || null,
    hold_expires_at: new Date(Date.now() + HOLD_MS).toISOString(),
    created_at: new Date().toISOString(),
  };
  if (!supabase) {
    writeLocal([booking, ...current]);
    return booking;
  }
  const { error } = await supabase.from("bookings").insert(booking);
  if (error)
    throw new Error(
      error.message.includes("no_overlap") ? "Those dates were just taken." : error.message,
    );
  await supabase.from("holds").insert({
    booking_id: booking.id,
    vehicle_id: booking.vehicle_id,
    expires_at: booking.hold_expires_at,
  });
  emit();
  return booking;
}

export async function updateStatus(id: string, status: Status) {
  if (!supabase) {
    writeLocal(
      readLocal().map((b) =>
        b.id === id
          ? { ...b, status, hold_expires_at: status === "hold" ? b.hold_expires_at : null }
          : b,
      ),
    );
    return;
  }
  const { error } = await supabase
    .from("bookings")
    .update({ status, hold_expires_at: status === "hold" ? undefined : null })
    .eq("id", id);
  if (error) throw error;
  await supabase.from("holds").update({ released: true }).eq("booking_id", id);
  emit();
}

export async function blockDates(
  vehicle_id: string,
  start_date: string,
  end_date: string,
  label: string,
) {
  const current = await fetchBookings();
  if (conflicts(current, vehicle_id, start_date, end_date).length)
    throw new Error("Those dates overlap an existing hold or booking.");
  const b: Booking = {
    id: crypto.randomUUID(),
    ref: genRef(),
    vehicle_id,
    customer_name: label || "Walk-in / phone client",
    phone: "—",
    email: null,
    start_date,
    end_date,
    pickup_time: "00:00",
    return_time: "23:59",
    mode: "chauffeur",
    status: "blocked",
    total: 0,
    notes: "Manual block",
    hold_expires_at: null,
    created_at: new Date().toISOString(),
  };
  if (!supabase) {
    writeLocal([b, ...current]);
    return;
  }
  const { error } = await supabase.from("bookings").insert(b);
  if (error) throw error;
  emit();
}

export function resetDemo() {
  if (supabase) return;
  window.localStorage.removeItem(LS_KEY);
  emit();
}

// ---------- hooks ----------
export function useBookings(pollMs = 15000) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      setBookings(await fetchBookings());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    listeners.add(refresh);
    const t = setInterval(refresh, pollMs);
    const onStorage = (e: StorageEvent) => e.key === LS_KEY && refresh();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(refresh);
      clearInterval(t);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh, pollMs]);
  return { bookings, loading, error, refresh };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(SEED_VEHICLES);
  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);
  return vehicles;
}

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function fmtCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

export { isSupabaseConfigured };
