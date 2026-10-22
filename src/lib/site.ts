export const SITE = {
  name: "Shiloh Travel Agency Ltd",
  short: "Shiloh Travel",
  address: "YYUSSA City Center, Ground Floor F1-22, Kigali, Rwanda",
  office: "YYUSSA City Center, Ground Floor F1-22",
  // Placeholder contact details — replace with the agency's real numbers.
  whatsapp: "250787945383",
  phoneDisplay: "+250 787 945 383",
  email: "shilohgroup21@gmail.com",
  hours: [
    { d: "Mon – Fri", h: "8:00 – 18:00" },
    { d: "Saturday", h: "9:00 – 15:00" },
    { d: "Sunday", h: "WhatsApp only" },
  ],
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function rwf(n: number) {
  return `RWF ${Math.round(n).toLocaleString("en-US")}`;
}
