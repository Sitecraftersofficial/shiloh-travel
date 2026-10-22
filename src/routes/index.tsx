import {
  ArrowRight,
  Car,
  Check,
  Fuel,
  MapPinned,
  Mountain,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "@/lib/services";
import { SEED_VEHICLES } from "@/lib/store";
import { vehicleImage } from "@/components/vehicle-images";
import { WhatsAppButton } from "@/components/SiteChrome";
import { Reveal } from "@/components/Reveal";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import heroImage from "@/assets/hero.jpg";

const strip = [
  "Gorilla trekking in Volcanoes",
  "Car rental with a driver or self-drive",
  "Visas & flight tickets",
  "Furnished apartments in Kigali",
  "Akagera safari game drives",
  "Hotel & group bookings",
  "Airport pickup",
];

// Curated pick for the home page — these three, not the whole fleet.
const FEATURED_IDS = ["santafe-rai262p", "sorento2015-raj673m", "niro-rah846n"];
const featured = FEATURED_IDS.map((id) => SEED_VEHICLES.find((v) => v.id === id)!);

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
      <section className="relative isolate overflow-hidden bg-[#08224f] pb-28 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center opacity-55"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(232,190,87,.16),transparent),linear-gradient(135deg,rgba(8,34,79,.72)_0%,rgba(12,58,128,.58)_55%,rgba(22,79,168,.48)_100%)]"
        />
        {/* decorative glow blobs */}
        <div className="animate-float-y pointer-events-none absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto grid min-h-150 max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] backdrop-blur">
              <Sparkles className="h-4 w-4 text-accent" /> Travel agency in Kigali, Rwanda
            </div>
            <h1 className="animate-rise-in mt-8 max-w-2xl text-5xl font-semibold leading-[1.02] [animation-delay:120ms] md:text-6xl lg:text-7xl">
              Flights, cars and safaris — <span className="shimmer-text">booked in one place.</span>
            </h1>
            <p className="animate-rise-in mt-8 max-w-xl text-lg leading-relaxed text-white/75 [animation-delay:240ms]">
              Shiloh Travel rents cars with or without a driver, organizes gorilla trekking and
              safari tours, and takes care of flights, visas and hotels for trips across Rwanda and
              abroad.
            </p>
            <div className="animate-rise-in mt-9 flex flex-wrap gap-3 [animation-delay:360ms]">
              <Link
                to="/car-rental"
                className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Rent a car <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
              <Link
                to="/services#tours"
                className="rounded-full border border-white/35 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Plan a safari
              </Link>
            </div>
            <div className="animate-rise-in mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70 [animation-delay:480ms]">
              <span className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-accent" /> YYUSSA City Center, Kigali
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Local, trusted, personal
              </span>
            </div>
          </div>
          <div className="animate-rise-in [animation-delay:200ms]">
            <HeroSlideshow />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4">
        <div className="glass rounded-3xl border border-white/70 p-5 text-foreground shadow-[0_30px_80px_-25px_rgba(8,34,91,.55)] md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-accent-foreground">
                Car rental search
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-primary">Check availability</h2>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              <span className="live-dot relative mr-1.5 inline-block h-2 w-2 rounded-full bg-success" />
              Live
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 rounded-xl bg-secondary p-1 text-sm font-bold">
              <button
                onClick={() => setMode("chauffeur")}
                className={`flex-1 rounded-lg px-3 py-2.5 transition-colors ${mode === "chauffeur" ? "bg-primary text-white shadow" : "text-muted-foreground"}`}
              >
                With driver
              </button>
              <button
                onClick={() => setMode("self")}
                className={`flex-1 rounded-lg px-3 py-2.5 transition-colors ${mode === "self" ? "bg-primary text-white shadow" : "text-muted-foreground"}`}
              >
                Self-drive
              </button>
            </div>
            <Link
              to={bookingHref}
              className="flex items-center justify-center rounded-xl bg-accent px-6 py-3 font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Search available cars <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pickup & return at YYUSSA City Center, Ground Floor F1-22 · Free 3-hour hold
          </p>
        </div>
      </div>

      {/* scrolling marquee of what we offer */}
      <div className="overflow-hidden border-b bg-white py-5">
        <div className="animate-marquee flex w-max gap-10">
          {[...strip, ...strip].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-primary"
            >
              <Check className="h-4 w-4 text-accent" /> {item}
            </span>
          ))}
        </div>
      </div>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3">
          {[
            [
              "01",
              "Pick your dates and car",
              "See real availability for every vehicle in the fleet before you commit.",
            ],
            [
              "02",
              "Reserve in one minute",
              "Just your name and phone — no account, no payment upfront.",
            ],
            [
              "03",
              "Collect the keys in Kigali",
              "Pickup and return at YYUSSA City Center, Ground Floor F1-22, or ask about delivery.",
            ],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120}>
              <p className="text-3xl font-semibold text-primary">{n}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative bg-[radial-gradient(900px_400px_at_10%_0%,rgba(22,79,168,.08),transparent),linear-gradient(180deg,#f4f7fd_0%,#fff_100%)] py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                Two ways to travel
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-primary md:text-6xl">
                Drive it yourself, or let a driver take the wheel.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Rent any of our cars for a self-drive trip, or book the same car with an experienced
              driver who knows Rwanda's roads and national parks.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Link
                to="/car-rental"
                className="group relative flex min-h-115 flex-col justify-end overflow-hidden rounded-4xl bg-[linear-gradient(160deg,#0c3a80_0%,#08224f_100%)] p-8 text-white shadow-[0_40px_90px_-40px_rgba(8,34,91,.8)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_50px_110px_-40px_rgba(8,34,91,.9)] md:p-12"
              >
                <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/20 blur-2xl transition-all duration-700 group-hover:scale-150" />
                <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full border-28 border-accent/25 transition-transform duration-700 group-hover:rotate-45" />
                <Car className="animate-float-y absolute left-10 top-10 h-12 w-12 text-accent" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                    01 · Car rental
                  </p>
                  <h3 className="mt-3 max-w-md text-3xl font-semibold md:text-4xl">
                    A clean, insured car for your dates — self-drive or with a chauffeur.
                  </h3>
                  <span className="mt-8 inline-flex items-center gap-2 font-bold">
                    See the fleet{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={140}>
              <Link
                to="/services#tours"
                className="group relative flex min-h-115 flex-col justify-end overflow-hidden rounded-4xl bg-[linear-gradient(160deg,#fff_0%,#fdf6e6_100%)] p-8 shadow-[0_40px_90px_-45px_rgba(20,40,80,.45)] ring-1 ring-primary/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_50px_110px_-45px_rgba(20,40,80,.55)] md:p-12"
              >
                <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_center,rgba(214,166,66,.3),transparent_65%)] transition-all duration-700 group-hover:scale-125" />
                <Mountain className="animate-float-y absolute left-10 top-10 h-12 w-12 text-primary" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.25em] text-accent-foreground">
                    02 · Tours & safaris
                  </p>
                  <h3 className="mt-3 max-w-md text-3xl font-semibold text-primary md:text-4xl">
                    Gorillas, game drives and national parks — planned and guided end to end.
                  </h3>
                  <span className="mt-8 inline-flex items-center gap-2 font-bold text-primary">
                    Explore tour packages{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
                From our fleet
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-primary md:text-5xl">
                Featured vehicles, ready for your dates.
              </h2>
            </div>
            <Link
              to="/car-rental"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View all cars
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v, index) => (
              <Reveal key={v.id} delay={index * 90}>
                <article className="glass group h-full overflow-hidden rounded-3xl border border-white/70 shadow-[0_22px_55px_-35px_rgba(11,54,130,.55)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_65px_-30px_rgba(11,54,130,.6)]">
                  <div className="relative overflow-hidden">
                    <img
                      src={vehicleImage(v.id, v.category)}
                      alt={v.name}
                      loading="lazy"
                      className="aspect-16/10 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-primary">{v.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {v.seats} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings2 className="h-3.5 w-3.5" /> {v.transmission}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5" /> {v.fuel}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/car-rental?vehicle=${v.id}`}
                        className="flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                      >
                        View car details
                      </Link>
                      <WhatsAppButton
                        message={`Hello Shiloh Travel, I'm interested in the ${v.name}.`}
                        variant="quiet"
                        className="shrink-0"
                      >
                        Ask
                      </WhatsAppButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            All cars available self-drive or with an experienced driver · Insurance included ·{" "}
            <Link to="/car-rental" className="font-bold text-primary hover:underline">
              Check live availability
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[.75fr_1.25fr]">
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">
              More from Shiloh
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-primary md:text-5xl">
              Everything else your trip needs.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Flight tickets, visas, hotels and furnished apartments — the same team, the same
              WhatsApp number, one invoice if you want it.
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
              <Reveal key={service.id} delay={index * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-primary/10 bg-white p-5 shadow-[0_20px_50px_-35px_rgba(14,55,130,.5)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_25px_60px_-30px_rgba(14,55,130,.55)]">
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-accent to-primary transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="flex items-start justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-secondary to-accent/20 text-xs font-bold text-primary">
                      0{index + 1}
                    </span>
                    <service.icon className="h-6 w-6 text-primary/70 transition-all duration-300 group-hover:scale-110 group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="mt-8 font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {service.blurb}
                  </p>
                  <WhatsAppButton message={service.wa} variant="quiet" className="mt-5">
                    Ask about this
                  </WhatsAppButton>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-primary to-[#164fa8] px-5 py-4 text-sm text-white shadow-[0_20px_50px_-30px_rgba(8,34,91,.8)]">
          <span className="flex items-center gap-2 text-white/85">
            <MapPinned className="h-4 w-4 text-accent" />
            Visit the Shiloh desk at YYUSSA City Center, Ground Floor F1-22.
          </span>
          <Link to="/contact" className="font-bold text-accent hover:underline">
            Get directions <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
