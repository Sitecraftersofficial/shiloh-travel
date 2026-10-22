import { Plane, Mountain, FileCheck, Building2, Hotel, Car, Bus } from "lucide-react";

export const SERVICES = [
  {
    id: "flights",
    icon: Plane,
    title: "Air ticketing & flight reservations",
    blurb:
      "Best-fare searches on RwandAir, Kenya Airways, Qatar, Emirates, Turkish and more — one-way, return or multi-city, with date changes handled for you.",
    points: ["Group & student fares", "Same-day ticket issue", "Rebooking support"],
    wa: "Hello Shiloh Travel, I'd like a flight quote. From: ___ To: ___ Dates: ___ Passengers: ___",
  },
  {
    id: "car-rental",
    icon: Car,
    title: "Car rental",
    blurb:
      "Reliable cars for self-drive or chauffeur-led travel in Kigali and across Rwanda, with pickup and return arranged around your itinerary.",
    points: ["Self-drive options", "Experienced chauffeurs", "Insured vehicles"],
    wa: "Hello Shiloh Travel, I'd like to rent a car. Dates: ___ Vehicle type: ___ Self-drive or chauffeur: ___",
  },
  {
    id: "tours",
    icon: Mountain,
    title: "Tour packages & guided safaris",
    blurb:
      "Gorilla trekking in Volcanoes, Big Five game drives in Akagera, canopy walks in Nyungwe, and Kigali city tours — with licensed guides and safari vehicles.",
    points: [
      "Volcanoes gorilla trekking",
      "Akagera game drives",
      "Nyungwe canopy walk",
      "Kigali city & memorial tours",
    ],
    wa: "Hello Shiloh Travel, I'm interested in a tour package (Volcanoes / Akagera / Nyungwe / Kigali). Dates: ___ Group size: ___",
  },
  {
    id: "visa",
    icon: FileCheck,
    title: "Visa applications & entry permits",
    blurb:
      "Guidance and paperwork for Rwanda e-visas, East Africa Tourist Visa, and outbound visas for Schengen, UK, US, UAE and more.",
    points: ["Document checklist", "Appointment booking", "Application follow-up"],
    wa: "Hello Shiloh Travel, I need help with a visa application. Destination country: ___ Nationality: ___ Travel date: ___",
  },
  {
    id: "airport-transfer",
    icon: Bus,
    title: "Airport transfers",
    blurb:
      "Comfortable airport pickup and drop-off in Kigali, coordinated with your flight and available for individuals, families and groups.",
    points: ["Flight monitoring", "Meet-and-greet", "Group transfers"],
    wa: "Hello Shiloh Travel, I'd like an airport transfer. Arrival/departure: ___ Flight: ___ Date/time: ___ Passengers: ___",
  },
  {
    id: "apartments",
    icon: Building2,
    title: "Furnished apartments in Kigali",
    blurb:
      "Short and long-stay furnished apartments in Kiyovu, Kimihurura, Nyarutarama and the city centre — Wi-Fi, security and housekeeping included.",
    points: ["Nightly, weekly, monthly", "Viewings arranged", "Airport pickup on request"],
    wa: "Hello Shiloh Travel, I'm looking for a furnished apartment in Kigali. Check-in: ___ Duration: ___ Bedrooms: ___",
  },
  {
    id: "hotels",
    icon: Hotel,
    title: "Hotel bookings & group stays",
    blurb:
      "From boutique guesthouses to five-star hotels, plus conference and wedding group blocks across Rwanda and abroad.",
    points: ["Negotiated group rates", "Conference packages", "Lodges near the parks"],
    wa: "Hello Shiloh Travel, I'd like a hotel booking. City: ___ Dates: ___ Rooms/guests: ___",
  },
] as const;
