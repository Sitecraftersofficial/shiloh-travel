import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MessageCircle,
  Mountain,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICES } from "@/lib/services";
import { WhatsAppButton } from "@/components/SiteChrome";
import { Reveal } from "@/components/Reveal";
import fourByFourImage from "@/assets/car-4x4.jpg";
import vanImage from "@/assets/car-van.jpg";
import sedanImage from "@/assets/car-sedan.jpg";

const heroSlides = [
  { src: fourByFourImage, alt: "Safari-ready 4x4 vehicle", mobilePosition: "object-[72%_center]" },
  {
    src: vanImage,
    alt: "Comfortable passenger van for group travel",
    mobilePosition: "object-[24%_center]",
  },
  {
    src: sedanImage,
    alt: "Comfortable sedan for city travel",
    mobilePosition: "object-[24%_center]",
  },
];

const tour = SERVICES.find((service) => service.id === "tours")!;
const supporting = SERVICES.filter((service) => service.id !== "tours");

export default function Services() {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const changeHeroSlide = (direction: number) => {
    setHeroSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            aria-hidden={index !== heroSlide}
            className={`absolute inset-0 h-full w-full object-cover ${slide.mobilePosition} transition-opacity duration-1000 lg:object-[center_45%] ${
              index === heroSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,25,55,.94)_0%,rgba(8,25,55,.76)_42%,rgba(8,25,55,.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,25,55,.82)_0%,transparent_55%)]" />
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
        <div className="absolute bottom-8 right-4 flex items-center gap-2 sm:right-8 lg:right-[max(2rem,calc((100vw-80rem)/2))]">
          <button
            type="button"
            aria-label="Previous services hero image"
            onClick={() => changeHeroSlide(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show services hero image ${index + 1}`}
                onClick={() => setHeroSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === heroSlide ? "w-6 bg-accent" : "w-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next services hero image"
            onClick={() => changeHeroSlide(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
                Travel support
              </p>
              <h2 className="mt-3 text-4xl font-semibold md:text-6xl">
                Every service,
                <br />
                handled one by one.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Visa assistance, hotel booking, airport transfers, flights and apartments — pick what
              you need and message our team directly about it.
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
                    {service.points.slice(0, 3).map((point) => (
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
          <Link to="/services#visa" className="rounded-full border px-6 py-3 font-semibold">
            Visa assistance
          </Link>
          <Link to="/services#hotels" className="rounded-full border px-6 py-3 font-semibold">
            Hotel booking
          </Link>
          <Link
            to="/services#airport-transfer"
            className="rounded-full border px-6 py-3 font-semibold"
          >
            Airport transfer
          </Link>
        </div>
        <ArrowDown className="mt-12 h-5 w-5 animate-bounce text-muted-foreground" />
      </section>
    </div>
  );
}
