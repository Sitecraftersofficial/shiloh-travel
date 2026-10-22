import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const slides = [
  {
    src: new URL("@/assets/Santafe-rai262p-1.jpeg", import.meta.url).href,
    label: "Hyundai Santa Fe · RAI 262P",
  },
  {
    src: new URL("@/assets/Sorento2015-raj673m-1.jpeg", import.meta.url).href,
    label: "Kia Sorento 2015 · RAJ 673M",
  },
  {
    src: new URL("@/assets/Niro-rah846n-1.jpeg", import.meta.url).href,
    label: "Kia Niro · RAH 846N",
  },
  {
    src: new URL("@/assets/Sorento2014-raj736c-1.jpeg", import.meta.url).href,
    label: "Kia Sorento 2014 · RAJ 736C",
  },
  {
    src: new URL("@/assets/bydsealion-1.jpg", import.meta.url).href,
    label: "BYD Sealion",
  },
];

export function HeroSlideshow() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="group relative h-72 w-full overflow-hidden rounded-3xl border border-white/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)] sm:h-80 lg:h-full lg:min-h-105">
      {slides.map((s, idx) => (
        <div
          key={s.label}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={s.src}
            alt={s.label}
            className={`h-full w-full object-cover ${idx === i ? "animate-zoom-bg" : ""}`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-transparent to-transparent" />
          <div
            className={`absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-semibold text-white transition-all delay-200 duration-700 ${idx === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          >
            <MapPin className="h-4 w-4 shrink-0 text-accent" />
            {s.label} — ready in Kigali
          </div>
        </div>
      ))}
      <button
        aria-label="Previous car"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-all hover:bg-black/60 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next car"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-all hover:bg-black/60 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </div>
  );
}
