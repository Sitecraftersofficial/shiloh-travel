import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Fuel, Settings2, MapPin, CheckCircle2, X, Timer } from "lucide-react";
import {
  useBookings,
  useVehicles,
  useNow,
  conflicts,
  rentalDays,
  createHold,
  fmtCountdown,
  type Booking,
  type Category,
  type Mode,
  type Vehicle,
} from "@/lib/store";
import { SITE, rwf, waLink } from "@/lib/site";
import { vehicleImage, CATEGORY_LABEL } from "@/components/vehicle-images";
import { WhatsAppButton } from "@/components/SiteChrome";

const today = () => new Date().toISOString().slice(0, 10);
const plus = (d: string, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

export default function CarRental() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vehicles = useVehicles();
  const { bookings } = useBookings();
  const [cat, setCat] = useState<Category | "all">("all");
  const [mode, setMode] = useState<Mode>(() =>
    params.get("mode") === "self" ? "self" : "chauffeur",
  );
  const [start, setStart] = useState(() => params.get("pickup") ?? plus(today(), 1));
  const [end, setEnd] = useState(() => params.get("dropoff") ?? plus(today(), 3));
  const [pickupTime, setPickupTime] = useState(() => params.get("pickupTime") ?? "09:00");
  const [returnTime, setReturnTime] = useState(() => params.get("dropoffTime") ?? "17:00");
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  useEffect(() => {
    const vehicleId = new URLSearchParams(location.search).get("reserve");
    if (vehicleId) {
      const vehicle = vehicles.find((item) => item.id === vehicleId);
      if (vehicle) setSelected(vehicle);
    }
  }, [vehicles, location.search]);

  const validDates = start >= today() && end >= start && (start !== end || returnTime > pickupTime);
  const days = validDates ? rentalDays(start, end) : 0;
  const list = useMemo(
    () => vehicles.filter((v) => cat === "all" || v.category === cat),
    [vehicles, cat],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-12 text-white md:px-14 md:py-16">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(232,190,87,.25),transparent_60%)]" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            Car rental · Kigali, Rwanda
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[0.95] md:text-7xl">
            Rent a car for your dates —
            <br />
            <span className="text-accent">self-drive or with a driver.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/75">
            Every car below is ours, insured, and available for the dates you choose. Rates are per
            day in Rwandan francs; reserve now and pay at pickup.
          </p>
          <p className="mt-6 flex items-center gap-2 text-white/75">
            <MapPin className="h-4 w-4 text-accent" />
            Pickup & return at {SITE.office}
          </p>
        </div>
      </div>
      <p className="mt-6 hidden items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        Pickup & return: {SITE.office}
      </p>

      <div className="relative z-10 mx-3 -mt-8 grid gap-4 rounded-2xl border bg-white p-5 shadow-[0_24px_70px_-30px_rgba(11,54,130,.38)] md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.75fr_0.75fr_auto] lg:items-end">
        <label className="text-sm font-medium">
          Pickup date
          <input
            type="date"
            min={today()}
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              if (e.target.value > end) setEnd(e.target.value);
            }}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Pickup time
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Return time
          <input
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Return date
          <input
            type="date"
            min={start}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          />
        </label>
        <div className="flex rounded-full bg-muted p-1 text-sm font-semibold">
          {(["self", "chauffeur"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {m === "self" ? "Self-drive" : "With chauffeur"}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {validDates ? `${days} day${days > 1 ? "s" : ""}` : "Pick valid dates"}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">
          Choose a class
        </span>
        {(["all", "safari", "suv", "sedan", "van"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
          >
            {c === "all" ? "All vehicles" : CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => {
          const clash = validDates
            ? conflicts(bookings, v.id, start, end, pickupTime, returnTime)
            : [];
          const free = validDates && clash.length === 0;
          return (
            <article
              key={v.id}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border bg-white shadow-[0_18px_50px_-35px_rgba(11,54,130,.6)] transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <Link to={`/car-rental?vehicle=${v.id}`} aria-label={`View details for ${v.name}`}>
                  <img
                    src={vehicleImage(v.id, v.category)}
                    alt={v.name}
                    loading="lazy"
                    width={1024}
                    height={704}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground ${free ? "bg-success" : "bg-destructive"}`}
                >
                  {!validDates ? "Choose dates" : free ? "Available" : "Not available"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {CATEGORY_LABEL[v.category]}
                </p>
                <Link
                  to={`/car-rental?vehicle=${v.id}`}
                  className="text-xl font-semibold hover:text-primary"
                >
                  {v.name}
                </Link>
                <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {v.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings2 className="h-4 w-4" />
                    {v.transmission}
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    {v.fuel}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.features.map((f) => (
                    <span key={f} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-5">
                  <Link
                    to={`/car-rental?vehicle=${v.id}`}
                    className="block w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    View car details
                  </Link>
                </div>
                {validDates && !free && (
                  <p className="mt-2 text-xs text-destructive">
                    Booked {clash.map((c) => `${c.start_date} → ${c.end_date}`).join(", ")}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {selected && (
        <BookingModal
          vehicle={selected}
          mode={mode}
          start={start}
          end={end}
          pickupTime={pickupTime}
          returnTime={returnTime}
          days={days}
          onClose={() => setSelected(null)}
          onDone={(b) => {
            setSelected(null);
            setConfirmed(b);
          }}
        />
      )}
      {confirmed && (
        <Confirmation
          booking={confirmed}
          vehicle={vehicles.find((v) => v.id === confirmed.vehicle_id)!}
          onClose={() => setConfirmed(null)}
        />
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function BookingModal({
  vehicle,
  mode,
  start,
  end,
  pickupTime,
  returnTime,
  days,
  onClose,
  onDone,
}: {
  vehicle: Vehicle;
  mode: Mode;
  start: string;
  end: string;
  pickupTime: string;
  returnTime: string;
  days: number;
  onClose: () => void;
  onDone: (b: Booking) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const total = (mode === "self" ? vehicle.self_drive_rate : vehicle.chauffeur_rate) * days;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    if (name.length < 2 || phone.length < 7) {
      setErr("Please enter your name and a valid phone number.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const b = await createHold({
        vehicle_id: vehicle.id,
        customer_name: name.slice(0, 100),
        phone: phone.slice(0, 30),
        email: String(f.get("email") || "").slice(0, 120),
        notes: String(f.get("notes") || "").slice(0, 500),
        start_date: start,
        end_date: end,
        pickup_time: pickupTime,
        return_time: returnTime,
        mode,
        total,
      });
      onDone(b);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold">Reserve {vehicle.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {start} {pickupTime} → {end} {returnTime} · {days} days ·{" "}
        {mode === "self" ? "Self-drive" : "With chauffeur"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Pickup & return at {SITE.office}</p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input
          name="name"
          required
          maxLength={100}
          placeholder="Full name"
          className="w-full rounded-lg border bg-background px-3 py-2"
        />
        <input
          name="phone"
          required
          maxLength={30}
          placeholder="Phone / WhatsApp"
          className="w-full rounded-lg border bg-background px-3 py-2"
        />
        <input
          name="email"
          type="email"
          maxLength={120}
          placeholder="Email (optional)"
          className="w-full rounded-lg border bg-background px-3 py-2"
        />
        <textarea
          name="notes"
          maxLength={500}
          rows={2}
          placeholder="Notes — flight number, itinerary… (optional)"
          className="w-full rounded-lg border bg-background px-3 py-2"
        />
        <div className="flex justify-between rounded-lg bg-muted px-4 py-3 text-sm">
          <span>Estimated total</span>
          <span className="font-bold">{rwf(total)}</span>
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-accent py-3 font-semibold text-accent-foreground disabled:opacity-50"
        >
          {busy ? "Checking availability…" : "Hold this car for 3 hours"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          No payment now. Our team confirms payment with you on WhatsApp.
        </p>
      </form>
    </Modal>
  );
}

function Confirmation({
  booking,
  vehicle,
  onClose,
}: {
  booking: Booking;
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const now = useNow();
  const left = booking.hold_expires_at ? new Date(booking.hold_expires_at).getTime() - now : 0;
  const msg = `Hello Shiloh Travel! I'd like to confirm my car reservation.
Ref: #${booking.ref}
Vehicle: ${vehicle?.name}
Dates: ${booking.start_date} to ${booking.end_date}
Pickup/return time: ${booking.pickup_time} to ${booking.return_time}
Option: ${booking.mode === "self" ? "Self-drive" : "With chauffeur"}
Pickup/return: ${SITE.office}
Total: ${rwf(booking.total)}
Name: ${booking.customer_name} · ${booking.phone}
Please share payment details.`;
  return (
    <Modal onClose={onClose}>
      <CheckCircle2 className="h-10 w-10 text-success" />
      <h2 className="mt-3 text-2xl font-semibold">Car on hold</h2>
      <p className="mt-1 text-muted-foreground">Your reference is</p>
      <p className="font-display text-4xl font-bold tracking-wider text-primary">#{booking.ref}</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
        <Timer className="h-4 w-4 text-warning" /> Held for{" "}
        <span className="font-mono font-bold">{fmtCountdown(left)}</span> — confirm payment before
        it expires.
      </div>
      <p className="mt-4 text-sm">
        {vehicle?.name} · {booking.start_date} → {booking.end_date} · {rwf(booking.total)}
      </p>
      <WhatsAppButton message={msg} className="mt-6 w-full py-3">
        Finalize on WhatsApp
      </WhatsAppButton>
      <a href={waLink(msg)} className="sr-only">
        WhatsApp link
      </a>
    </Modal>
  );
}
