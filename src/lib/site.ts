export const SITE = {
  name: "Shiloh Travel Agency Ltd",
  short: "Shiloh Travel",
  address: "YYUSSA City Center, Ground Floor F1-22, Kigali, Rwanda",
  office: "YYUSSA City Center, Ground Floor F1-22",
  // Real contact numbers — both lines take calls and WhatsApp.
  whatsapp: "250788362466",
  phoneDisplay: "+250 788 362 466",
  phones: [
    { display: "+250 788 362 466", wa: "250788362466" },
    { display: "+250 787 945 383", wa: "250787945383" },
  ],
  email: "shilohgroup21@gmail.com",
  hours: [
    { d: "Mon – Fri", h: "8:00 – 18:00" },
    { d: "Saturday", h: "9:00 – 15:00" },
    { d: "Sunday", h: "WhatsApp only" },
  ],
};

export function waLink(message: string, to: string = SITE.whatsapp) {
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
}

export function rwf(n: number) {
  return `RWF ${Math.round(n).toLocaleString("en-US")}`;
}
