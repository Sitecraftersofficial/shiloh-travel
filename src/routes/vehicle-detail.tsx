import { ArrowLeft, Car, Check, Fuel, MessageCircle, Settings2, Users } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { WhatsAppButton } from "@/components/SiteChrome";
import { vehicleGallery, CATEGORY_LABEL } from "@/components/vehicle-images";
import { useVehicles } from "@/lib/store";
import { rwf } from "@/lib/site";

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const vehicles = useVehicles();
  const selectedVehicleId = vehicleId ?? searchParams.get("vehicle");
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Car className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-5 text-4xl font-semibold text-primary">Vehicle not found</h1>
        <Link
          to="/car-rental"
          className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 font-semibold text-white"
        >
          Back to the fleet
        </Link>
      </div>
    );
  }

  const gallery = vehicleGallery(vehicle.id, vehicle.category);
  const message = `Hello Shiloh Travel, I'm interested in the ${vehicle.name}. Please share availability and booking details.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Link
        to="/car-rental"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the fleet
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${vehicle.name} view ${index + 1}`}
                className={`w-full rounded-3xl object-cover shadow-[0_20px_55px_-35px_rgba(11,54,130,.65)] ${index === 0 ? "aspect-[16/10] sm:col-span-2" : "aspect-[4/3]"}`}
              />
            ))}
          </div>
        </div>
        <div className="self-start lg:sticky lg:top-28">
          <p className="text-sm font-bold uppercase tracking-[.22em] text-accent">
            {CATEGORY_LABEL[vehicle.category]}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-primary md:text-5xl">
            {vehicle.name}
          </h1>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            <span className="rounded-xl bg-muted p-3">
              <Users className="mb-1 h-5 w-5 text-primary" />
              {vehicle.seats} seats
            </span>
            <span className="rounded-xl bg-muted p-3">
              <Settings2 className="mb-1 h-5 w-5 text-primary" />
              {vehicle.transmission}
            </span>
            <span className="rounded-xl bg-muted p-3">
              <Fuel className="mb-1 h-5 w-5 text-primary" />
              {vehicle.fuel}
            </span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Self-drive
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                {rwf(vehicle.self_drive_rate)} <span className="text-sm font-normal">/ day</span>
              </p>
              <Link
                to={`/car-rental?reserve=${vehicle.id}&mode=self`}
                className="mt-4 block rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Reserve self-drive
              </Link>
            </div>
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                With chauffeur
              </p>
              <p className="mt-2 text-2xl font-bold">
                {rwf(vehicle.chauffeur_rate)} <span className="text-sm font-normal">/ day</span>
              </p>
              <Link
                to={`/car-rental?reserve=${vehicle.id}&mode=chauffeur`}
                className="mt-4 block rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground"
              >
                Reserve with chauffeur
              </Link>
            </div>
          </div>
          <h2 className="mt-9 text-2xl font-semibold text-primary">Vehicle details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {vehicle.features.map((feature) => (
              <p key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" /> {feature}
              </p>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Insured and available for your Rwanda itinerary. Choose self-drive or travel with an
            experienced chauffeur, then confirm your dates with our team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton message={message}>
              <MessageCircle className="mr-1 inline h-4 w-4" /> Ask about this car
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
