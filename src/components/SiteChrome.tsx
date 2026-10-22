import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SITE, waLink } from "@/lib/site";
import { Logo } from "@/components/Reveal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/car-rental", label: "Car rental" },
  { to: "/services#tours", label: "Tours & safaris" },
  { to: "/services", label: "Travel services" },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[.12em] text-primary-foreground sm:text-[11px] sm:tracking-[.2em]">
        Flights · Safaris · Car rental · Visas — all from one desk in Kigali
      </div>
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-16 w-auto rounded-md" />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname + location.hash === item.to || (location.pathname === item.to.split("#")[0] && !item.to.includes("#")) ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary sm:inline-flex"
            >
              Visit the desk
            </Link>
            <Link
              to="/car-rental"
              className="hidden rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-[0_8px_20px_-12px_var(--color-accent)] sm:inline-flex"
            >
              Find a car <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 lg:hidden"
            >
              {open ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-primary/10 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors hover:bg-secondary ${
                    location.pathname + location.hash === item.to
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-primary/20 px-4 py-2 text-center text-sm font-semibold text-primary"
              >
                Visit the desk
              </Link>
              <Link
                to="/car-rental"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-bold text-accent-foreground"
              >
                Find a car <ArrowUpRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.3fr_.7fr_.7fr]">
        <div>
          <Logo className="h-20 w-auto rounded-lg bg-white/5 p-1" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            Shiloh Travel Agency Ltd is a full-service travel agency in Kigali. We book flights,
            rent cars, run safaris, handle visas and find you a place to stay — in Rwanda and
            beyond.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-accent">Services</p>
          <div className="space-y-3 text-sm text-primary-foreground/75">
            <Link className="block hover:text-white" to="/car-rental">
              Car rental
            </Link>
            <Link className="block hover:text-white" to="/services#tours">
              Tours & safaris
            </Link>
            <Link className="block hover:text-white" to="/services">
              Travel services
            </Link>
            <Link className="block hover:text-white" to="/contact">
              Contact & directions
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-accent">
            YYUSSA City Center
          </p>
          <div className="space-y-3 text-sm text-primary-foreground/75">
            <p className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {SITE.address}
            </p>
            <p className="flex gap-2">
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </p>
            <p className="flex gap-2">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-primary-foreground/55">
          <span>© {new Date().getFullYear()} Shiloh Travel Agency Ltd</span>
          <p className="order-1 md:order-2">
            Made in Rwanda by the{" "}
            <a
              href="https://sitecraftersltd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/60 underline-offset-4 transition-colors duration-500 hover:text-white"
            >
              Sitecrafters Team
            </a>
          </p>
          <Link
            to="/staff"
            className="order-2 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-[0_6px_16px_-10px_var(--color-accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:order-3"
          >
            Staff access <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton({
  message,
  children,
  className = "",
  variant = "solid",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "quiet";
}) {
  const styles =
    variant === "quiet"
      ? "group rounded-xl border border-primary/10 bg-white px-3 py-2 text-primary shadow-sm hover:border-primary/30 hover:bg-secondary"
      : "rounded-full bg-whatsapp px-5 py-2.5 text-white hover:-translate-y-0.5";
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 text-sm font-bold transition-all ${styles} ${className}`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-full ${
          variant === "quiet" ? "bg-whatsapp/10 text-whatsapp" : "border border-white/50 text-white"
        }`}
      >
        <MessageCircle className="h-5 w-5" />
      </span>
      <span>{children}</span>
      {variant === "quiet" && (
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hello Shiloh Travel, I found you on your website and would like more information.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Shiloh Travel on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.8)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
