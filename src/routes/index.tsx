import { ArrowRight, Car, Check, MapPinned, Mountain, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import hero from "@/assets/hero.jpg";
import { SERVICES } from "@/lib/services";
import { WhatsAppButton } from "@/components/SiteChrome";

export default function Home() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const after = new Date(tomorrow);
  after.setDate(after.getDate() + 2);
  const [pickup, setPickup] = useState(tomorrow.toISOString().slice(0, 10));
  const [dropoff, setDropoff] = useState(after.toISOString().slice(0, 10));
  const [mode, setMode] = useState<"self" | "chauffeur">("chauffeur");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [dropoffTime, setDropoffTime] = useState("17:00");
  const bookingHref = `/car-rental?pickup=${pickup}&dropoff=${dropoff}&pickupTime=${pickupTime}&dropoffTime=${dropoffTime}&mode=${mode}`;
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-primary text-white">
        <img
          src={hero}
          alt="Rwandan mountain road and safari vehicle"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(8,34,91,.98)_0%,rgba(12,57,135,.84)_48%,rgba(5,28,80,.2)_100%)]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] backdrop-blur">
              <Sparkles className="h-4 w-4 text-accent" /> Travel, arranged beautifully
            </div>
            <h1 className="mt-8 max-w-3xl text-6xl font-semibold leading-[.86] md:text-8xl">
              Rwanda is waiting.
              <br />
              <span className="text-accent">Take the long way.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              Private cars, expert guides, and one trusted Kigali desk for the journey you have been
              meaning to take.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/car-rental"
                className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground"
              >
                Choose your car <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
              <Link
                to="/services#tours"
                className="rounded-full border border-white/35 px-6 py-3 font-semibold text-white"
              >
                Meet our guides
              </Link>
            </div>
            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-accent" /> M. Peace Plaza, Kigali
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Local, trusted, personal
              </span>
            </div>
          </div>
          <div className="lg:pt-12">
            <div className="ml-auto max-w-lg rounded-[2rem] border border-primary/15 bg-white p-6 text-foreground shadow-2xl md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-accent-foreground">
                    Car rental search
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-primary">Start your booking</h2>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                  Live availability
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Pickup date
                  <input
                    type="date"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal text-foreground"
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Return date
                  <input
                    type="date"
                    min={pickup}
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal text-foreground"
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Pickup time
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal text-foreground"
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Return time
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal text-foreground"
                  />
                </label>
              </div>
              <div className="mt-4 flex rounded-xl bg-secondary p-1 text-sm font-bold">
                <button
                  onClick={() => setMode("chauffeur")}
                  className={`flex-1 rounded-lg px-3 py-2.5 ${mode === "chauffeur" ? "bg-primary text-white shadow" : "text-muted-foreground"}`}
                >
                  With chauffeur
                </button>
                <button
                  onClick={() => setMode("self")}
                  className={`flex-1 rounded-lg px-3 py-2.5 ${mode === "self" ? "bg-primary text-white shadow" : "text-muted-foreground"}`}
                >
                  Self-drive
                </button>
              </div>
              <Link
                to={bookingHref}
                className="mt-5 flex items-center justify-center rounded-full bg-accent px-5 py-3.5 font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Search available cars <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Pickup & return at M. Peace Plaza, Kigali · Hold for 3 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-primary">01</p>
            <p className="mt-1 text-sm text-muted-foreground">Search a car that fits the journey</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-primary">02</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak to a guide who knows the terrain
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-primary">03</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start and finish at our Kigali desk
            </p>
          </div>
        </div>
      </section>

      <section className="blue-grid bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                Two ways to begin
              </p>
              <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-none text-primary md:text-7xl">
                Make the journey yours.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Some trips need open roads. Others need someone who knows exactly where to look. We do
              both.
            </p>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <Link
              to="/car-rental"
              className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-primary p-8 text-white md:p-12"
            >
              <Car className="h-10 w-10 text-accent" />
              <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full border-[32px] border-accent/30 transition-transform duration-700 group-hover:scale-125" />
              <div className="relative mt-36">
                <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                  01 · Private car hire
                </p>
                <h3 className="mt-3 max-w-md text-4xl font-semibold">
                  Find the right vehicle for your next road.
                </h3>
                <span className="mt-8 inline-flex items-center gap-2 font-bold">
                  Explore the fleet <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
            <Link
              to="/services#tours"
              className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm md:p-12"
            >
              <Mountain className="h-10 w-10 text-primary" />
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(214,166,66,.25),transparent_60%)]" />
              <div className="relative mt-36">
                <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                  02 · Tours & guiding
                </p>
                <h3 className="mt-3 max-w-md text-4xl font-semibold text-primary">
                  See more because someone local is looking with you.
                </h3>
                <span className="mt-8 inline-flex items-center gap-2 font-bold text-primary">
                  Explore Rwanda <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[.75fr_1.25fr]">
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
              More from Shiloh
            </p>
            <h2 className="mt-4 text-5xl font-semibold leading-none text-primary">
              One desk.
              <br />
              Many possibilities.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Flights, stays, visas, apartments, and the little details that make a big trip feel
              effortless.
            </p>
            <WhatsAppButton
              message="Hello Shiloh Travel, I'd like help planning a trip."
              className="mt-8"
            >
              Talk to the travel desk
            </WhatsAppButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.filter((service) => service.id !== "tours").map((service, index) => (
              <div
                key={service.id}
                className="group rounded-2xl border border-primary/10 bg-background p-5 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_45px_-30px_rgba(14,55,130,.7)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-xs font-bold text-primary">
                    0{index + 1}
                  </span>
                  <service.icon className="h-6 w-6 text-primary/70 transition-colors group-hover:text-accent-foreground" />
                </div>
                <h3 className="mt-8 font-semibold text-primary">{service.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {service.blurb}
                </p>
                <WhatsAppButton message={service.wa} variant="quiet" className="mt-5">
                  Start a conversation
                </WhatsAppButton>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-secondary/60 px-5 py-4 text-sm">
          <span className="text-muted-foreground">
            <MapPinned className="mr-2 inline h-4 w-4 text-primary" />
            Visit the Shiloh desk at M. Peace Plaza, Kigali.
          </span>
          <Link to="/contact" className="font-bold text-primary hover:underline">
            Get directions <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
