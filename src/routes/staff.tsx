import { useEffect, useState } from "react";
import {
  CalendarDays,
  Car as CarIcon,
  CheckCircle2,
  Clock3,
  Lock,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  useBookings,
  useVehicles,
  useNow,
  effectiveStatus,
  updateStatus,
  blockDates,
  fmtCountdown,
  resetDemo,
  isBlocking,
  isSupabaseConfigured,
  type Booking,
} from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { rwf } from "@/lib/site";
import { CATEGORY_LABEL } from "@/components/vehicle-images";
import type { User } from "@supabase/supabase-js";

const STATUS_STYLE: Record<string, string> = {
  hold: "bg-warning/15 text-warning",
  paid: "bg-success/15 text-success",
  blocked: "bg-info/15 text-info",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
};
const STATUS_LABEL: Record<string, string> = {
  hold: "Payment pending · 3hr hold",
  paid: "Booked & paid",
  blocked: "Blocked (walk-in/phone)",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Hold expired",
};

export default function Staff() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setResettingPassword(true);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  if (supabase && !authReady) {
    return <div className="mx-auto max-w-md px-4 py-24 text-center">Loading staff access…</div>;
  }
  if (supabase && resettingPassword) {
    return (
      <PasswordReset
        onDone={() => {
          setResettingPassword(false);
          setAuthMessage("Password updated. You are now signed in.");
        }}
        onError={setAuthError}
        error={authError}
      />
    );
  }
  if (supabase && !user) {
    return (
      <StaffLogin
        onSignedIn={setUser}
        error={authError}
        message={authMessage}
        onError={setAuthError}
        onMessage={setAuthMessage}
      />
    );
  }
  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-accent-foreground">
              Private workspace
            </p>
            <h1 className="mt-2 text-5xl font-semibold text-primary">Good morning, Shiloh team.</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" /> Fleet and reservations · M. Peace
              Plaza, Kigali
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => supabase?.auth.signOut().then(() => setUser(null))}
                className="text-xs underline"
              >
                Sign out
              </button>
            )}
            <span className="flex items-center gap-2 rounded-full border border-primary/10 bg-white px-3 py-2 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 text-success" /> Team workspace
            </span>
          </div>
        </div>
        <Ops />
      </div>
    </div>
  );
}

function StaffLogin({
  onSignedIn,
  error,
  message,
  onError,
  onMessage,
}: {
  onSignedIn: (user: User) => void;
  error: string | null;
  message: string | null;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onError(null);
    onMessage(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (mode === "forgot") {
      const result = await supabase?.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/staff`,
      });
      if (result?.error) onError(result.error.message);
      else onMessage("Check your email for a password reset link.");
      return;
    }
    const result =
      mode === "signup"
        ? await supabase?.auth.signUp({ email, password })
        : await supabase?.auth.signInWithPassword({ email, password });
    if (result?.error) onError(result.error.message);
    else if (mode === "signup" && result?.data.user && !result.data.session)
      onMessage("Account created. Check your email to confirm your account, then sign in.");
    else if (result?.data.user) onSignedIn(result.data.user);
  }
  const title =
    mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Staff sign in";
  const description =
    mode === "signup"
      ? "Create an account to access the shared team dashboard."
      : mode === "forgot"
        ? "Enter your email and we will send you a password reset link."
        : "Sign in to manage vehicles, holds, and customer reservations.";
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-3xl border bg-card p-8">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-accent">
          Private workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <form onSubmit={submit} className="mt-7 space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border bg-background px-3 py-2"
          />
          {mode !== "forgot" && (
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Password (at least 6 characters)"
              className="w-full rounded-lg border bg-background px-3 py-2"
            />
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}
          <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">
            {mode === "signup"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset link"
                : "Enter dashboard"}
          </button>
        </form>
        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
          {mode !== "signin" && (
            <button
              type="button"
              className="underline"
              onClick={() => {
                setMode("signin");
                onError(null);
              }}
            >
              Sign in
            </button>
          )}
          {mode === "signin" && (
            <>
              <button
                type="button"
                className="underline"
                onClick={() => {
                  setMode("signup");
                  onError(null);
                }}
              >
                Create account
              </button>
              <button
                type="button"
                className="underline"
                onClick={() => {
                  setMode("forgot");
                  onError(null);
                }}
              >
                Forgot password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PasswordReset({
  onDone,
  onError,
  error,
}: {
  onDone: () => void;
  onError: (message: string | null) => void;
  error: string | null;
}) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onError(null);
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const result = await supabase?.auth.updateUser({ password });
    if (result?.error) onError(result.error.message);
    else onDone();
  }
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-3xl border bg-card p-8">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-accent">
          Private workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Choose a new password</h1>
        <form onSubmit={submit} className="mt-7 space-y-3">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="New password (at least 6 characters)"
            className="w-full rounded-lg border bg-background px-3 py-2"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}

function Ops() {
  const vehicles = useVehicles();
  const { bookings, refresh, error } = useBookings(10000);
  const now = useNow();
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const act = async (fn: () => Promise<void>, ok: string) => {
    try {
      await fn();
      setMsg(ok);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Action failed");
    }
  };

  const counts = bookings.reduce<Record<string, number>>((a, b) => {
    const s = effectiveStatus(b, now);
    a[s] = (a[s] || 0) + 1;
    return a;
  }, {});
  const shown = bookings.filter((b) => filter === "all" || effectiveStatus(b, now) === filter);
  const vName = (id: string) => vehicles.find((v) => v.id === id)?.name ?? id;

  return (
    <div className="mt-10 space-y-8">
      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}
      {msg && <p className="rounded-lg bg-muted p-3 text-sm">{msg}</p>}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={Clock3}
          label="Needs attention"
          value={String(counts.hold || 0)}
          detail="active holds"
          tone="gold"
        />
        <Metric
          icon={CheckCircle2}
          label="Booked & paid"
          value={String(counts.paid || 0)}
          detail="confirmed trips"
          tone="green"
        />
        <Metric
          icon={CalendarDays}
          label="Upcoming blocks"
          value={String(counts.blocked || 0)}
          detail="reserved dates"
          tone="blue"
        />
        <Metric
          icon={CarIcon}
          label="Fleet"
          value={String(vehicles.length)}
          detail="vehicles listed"
          tone="navy"
        />
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-accent-foreground">
              At a glance
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-primary">Fleet status today</h2>
          </div>
          <span className="text-xs text-muted-foreground">Updated live</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const active = bookings.find(
              (b) =>
                b.vehicle_id === v.id &&
                isBlocking(b, now) &&
                b.start_date <= today &&
                today <= b.end_date,
            );
            const next = bookings
              .filter((b) => b.vehicle_id === v.id && isBlocking(b, now) && b.start_date > today)
              .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
            const st = active ? effectiveStatus(active, now) : "available";
            return (
              <div
                key={v.id}
                className="rounded-2xl border border-primary/10 bg-white p-5 shadow-[0_16px_40px_-30px_rgba(14,55,130,.7)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABEL[v.category]}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st === "available" ? "bg-success/15 text-success" : STATUS_STYLE[st]}`}
                  >
                    {st === "available" ? "Available" : STATUS_LABEL[st]}
                  </span>
                </div>
                {next && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Next: {next.start_date} → {next.end_date} (#{next.ref})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <BlockForm
        vehicles={vehicles}
        onBlock={(id, s, e, l) => act(() => blockDates(id, s, e, l), "Dates blocked.")}
      />

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-accent-foreground">
              Customer activity
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-primary">Reservations & inquiries</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "hold", "paid", "blocked", "completed", "cancelled", "expired"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
              >
                {s === "all" ? "All" : STATUS_LABEL[s]} {s !== "all" && `(${counts[s] || 0})`}
              </button>
            ))}
            <button
              onClick={refresh}
              aria-label="Refresh"
              className="rounded-full border bg-card px-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-[0_16px_40px_-30px_rgba(14,55,130,.6)]">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => (
                <Row key={b.id} b={b} now={now} vName={vName(b.vehicle_id)} act={act} />
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    Nothing here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!isSupabaseConfigured && (
          <button
            onClick={() => {
              resetDemo();
              refresh();
            }}
            className="mt-3 text-xs text-muted-foreground underline"
          >
            Reset demo data
          </button>
        )}
      </section>
    </div>
  );
}

function Row({
  b,
  now,
  vName,
  act,
}: {
  b: Booking;
  now: number;
  vName: string;
  act: (fn: () => Promise<void>, ok: string) => void;
}) {
  const s = effectiveStatus(b, now);
  const left = b.hold_expires_at ? new Date(b.hold_expires_at).getTime() - now : 0;
  return (
    <tr className="border-t align-top">
      <td className="p-3 font-mono font-semibold">#{b.ref}</td>
      <td className="p-3">
        <p className="font-medium">{b.customer_name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          {b.phone}
        </p>
      </td>
      <td className="p-3">
        {vName}
        <p className="text-xs text-muted-foreground">
          {b.mode === "self" ? "Self-drive" : "Chauffeur"}
        </p>
      </td>
      <td className="p-3 whitespace-nowrap">
        {b.start_date}
        <br />
        {b.end_date}
      </td>
      <td className="p-3 whitespace-nowrap">{b.total ? rwf(b.total) : "—"}</td>
      <td className="p-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[s]}`}>
          {STATUS_LABEL[s]}
        </span>
        {s === "hold" && (
          <p className="mt-1 font-mono text-xs text-warning">⏱ {fmtCountdown(left)}</p>
        )}
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1.5">
          {(s === "hold" || s === "expired") && (
            <Btn
              onClick={() =>
                act(() => updateStatus(b.id, "paid"), `#${b.ref} marked booked & paid.`)
              }
              primary
            >
              Mark booked & paid
            </Btn>
          )}
          {(s === "hold" || s === "blocked" || s === "expired") && (
            <Btn onClick={() => act(() => updateStatus(b.id, "cancelled"), `#${b.ref} released.`)}>
              Release car
            </Btn>
          )}
          {s === "paid" && (
            <Btn onClick={() => act(() => updateStatus(b.id, "completed"), `#${b.ref} completed.`)}>
              Mark completed
            </Btn>
          )}
          {s === "paid" && (
            <Btn onClick={() => act(() => updateStatus(b.id, "cancelled"), `#${b.ref} cancelled.`)}>
              Cancel
            </Btn>
          )}
        </div>
      </td>
    </tr>
  );
}

function Btn({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${primary ? "bg-primary text-primary-foreground" : "border bg-background"}`}
    >
      {children}
    </button>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "green" | "blue" | "navy";
}) {
  const tones = {
    gold: "bg-accent/15 text-accent-foreground",
    green: "bg-success/10 text-success",
    blue: "bg-info/10 text-info",
    navy: "bg-primary/10 text-primary",
  };
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-3xl font-semibold text-primary">{value}</span>
        <span className="pb-1 text-xs text-muted-foreground">{detail}</span>
      </div>
    </div>
  );
}

function BlockForm({
  vehicles,
  onBlock,
}: {
  vehicles: { id: string; name: string }[];
  onBlock: (id: string, s: string, e: string, l: string) => void;
}) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Lock className="h-4 w-4" />
        Block dates for walk-in / phone client
      </h2>
      <form
        className="mt-4 grid gap-3 md:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const s = String(f.get("s")),
            en = String(f.get("e"));
          if (!s || !en || en < s) return;
          onBlock(String(f.get("v")), s, en, String(f.get("l") || "").slice(0, 100));
          e.currentTarget.reset();
        }}
      >
        <select name="v" className="rounded-lg border bg-background px-3 py-2 text-sm">
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input
          name="s"
          type="date"
          required
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <input
          name="e"
          type="date"
          required
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <input
          name="l"
          maxLength={100}
          placeholder="Client name / note"
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Block dates
        </button>
      </form>
    </section>
  );
}
