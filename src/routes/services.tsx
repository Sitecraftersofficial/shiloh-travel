import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Compass,
  MessageCircle,
  Mountain,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICES } from "@/lib/services";
import { WhatsAppButton } from "@/components/SiteChrome";
import { Reveal } from "@/components/Reveal";

const tour = SERVICES.find((service) => service.id === "tours")!;
const supporting = SERVICES.filter((service) => service.id !== "tours");

export default function Services() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(208,160,75,.28),transparent_60%)]" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-end gap-10 px-4 py-20 md:grid-cols-[1.15fr_.85fr] md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.3em] text-accent">
              What we do
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[.95] md:text-7xl">
              Tours, cars, flights and visas.
              <br />
              <em className="font-normal text-accent">Discover the world with us.</em>
            </h1>
          </div>
          <div className="max-w-sm border-l border-primary-foreground/25 pl-6 text-primary-foreground/75">
            <Compass className="mb-8 h-10 w-10 text-accent" />
            <p className="text-lg leading-relaxed">
              Shiloh is a licensed Rwandan travel agency based in Kigali. We run guided safaris,
              rent cars, book flights and hotels, and handle visa paperwork — so you deal with one
              team for the whole trip.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-accent" /> Licensed guides & real office in
              Kigali
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-secondary lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[480px] bg-[linear-gradient(145deg,#164fa8,#09265d)] p-8 text-primary-foreground md:p-12">
            <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full border border-accent/50" />
            <div className="absolute bottom-20 left-24 h-48 w-48 rounded-full border border-accent/30" />
            <Mountain className="relative h-12 w-12 text-accent" />
            <p className="relative mt-32 text-sm font-semibold uppercase tracking-[.25em] text-accent">
              Featured experience · 01
            </p>
            <h2 className="relative mt-4 max-w-md text-4xl font-semibold leading-tight md:text-5xl">
              Gorilla trekking, game drives and national parks — with a guide who knows the way.
            </h2>
          </div>
          <div className="p-8 md:p-12 lg:p-16">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-accent">
              Tours & guiding
            </p>
            <h3 className="mt-4 text-3xl font-semibold md:text-4xl">{tour.title}</h3>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {tour.blurb}
            </p>
            <div className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {tour.points.map((point) => (
                <div key={point} className="flex gap-3 text-sm">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-3">
              <WhatsAppButton message={tour.wa}>Shape your itinerary</WhatsAppButton>
              <Link
                to="/car-rental"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold"
              >
                Pair it with a car <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.25em] text-accent">
                The travel desk
              </p>
              <h2 className="mt-3 text-4xl font-semibold md:text-6xl">
                The other services we
                <br />
                handle for you.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Tell us what you need — a flight, a visa, a hotel or an apartment — and we'll come
              back with options and prices, usually the same day.
            </p>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {supporting.map((service, index) => (
              <Reveal key={service.id} delay={index * 90}>
                <article
                  id={service.id}
                  className="glass group h-full rounded-2xl border border-white/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_45px_-30px_rgba(14,55,130,.7)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-sm font-bold text-primary">
                      0{index + 2}
                    </span>
                    <service.icon className="h-7 w-7 text-primary/70" />
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.blurb}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.points.slice(0, 2).map((point) => (
                      <span
                        key={point}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                  <WhatsAppButton message={service.wa} variant="quiet" className="mt-6">
                    Ask about this
                  </WhatsAppButton>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[.25em] text-accent">
          Your next move
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-6xl">
          Ready when you are — book a car or plan a tour.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/car-rental"
            className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Explore the fleet
          </Link>
          <WhatsAppButton message="Hello Shiloh Travel, I'd like help planning a trip.">
            Talk to the team
          </WhatsAppButton>
        </div>
        <ArrowDown className="mt-12 h-5 w-5 animate-bounce text-muted-foreground" />
      </section>
    </div>
  );
}
