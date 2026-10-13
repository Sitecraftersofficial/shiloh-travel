import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/SiteChrome";

export default function Contact() {
  return (
    <div>
      <section className="bg-secondary">
        <div className="mx-auto grid min-h-[500px] max-w-7xl items-end gap-10 px-4 py-20 md:grid-cols-[1.2fr_.8fr] md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.3em] text-accent">
              Find your way to us
            </p>
            <h1 className="mt-6 max-w-3xl text-6xl font-semibold leading-[.9] md:text-8xl">
              Come as you are.
              <br />
              <em className="font-normal text-primary">Leave with a plan.</em>
            </h1>
          </div>
          <p className="max-w-sm border-l border-foreground/20 pl-6 text-lg leading-relaxed text-muted-foreground">
            Car pickups, returns, tour consultations, and the best local advice all begin at our
            office in the heart of Kigali.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-accent">
            M. Peace Plaza
          </p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">The Shiloh desk is here.</h2>
          <div className="mt-10 space-y-6 border-t pt-6">
            <Info icon={MapPin} title="Office" text={SITE.address} />
            <Info
              icon={Phone}
              title="Call"
              text={SITE.phoneDisplay}
              href={`tel:+${SITE.whatsapp}`}
            />
            <Info icon={Mail} title="Email" text={SITE.email} href={`mailto:${SITE.email}`} />
            <div className="flex gap-4 border-t pt-6">
              <Clock className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Office hours</p>
                {SITE.hours.map((hour) => (
                  <p key={hour.d} className="mt-1 text-sm text-muted-foreground">
                    {hour.d} · {hour.h}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsAppButton message="Hello Shiloh Travel, I would like to visit your office at M. Peace Plaza.">
              Message the desk
            </WhatsAppButton>
            <Link
              to="/car-rental"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold"
            >
              Book a car <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-12">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between text-xs uppercase tracking-[.22em] text-primary-foreground/70">
              <span>Kigali, Rwanda</span>
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-foreground/70">Pickup & return point</p>
              <p className="mt-3 text-4xl font-semibold leading-none">
                M. Peace
                <br />
                Plaza
              </p>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
                KN 84 St, Inyarurembo, Nyarugenge. A practical starting point for every road ahead.
              </p>
            </div>
            <div className="border-t border-primary-foreground/20 pt-4 text-sm text-primary-foreground/70">
              Open the map below for directions
            </div>
          </div>
        </div>
      </section>
      <iframe
        title="Map of M. Peace Plaza, Kigali"
        className="h-[420px] w-full border-0 grayscale"
        loading="lazy"
        src="https://www.google.com/maps?q=M.+Peace+Plaza+Kigali&output=embed"
      />
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof MapPin;
  title: string;
  text: string;
  href?: string;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-1 h-5 w-5 text-primary" />
      <div>
        <p className="font-semibold">{title}</p>
        {href ? (
          <a href={href} className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
            {text}
          </a>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}
