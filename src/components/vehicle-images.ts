// Real fleet photos (src/assets) — one per vehicle.
import bydSealion from "@/assets/bydsealion-1.jpg";
import niro from "@/assets/Niro-rah846n-1.jpeg";
import santafe from "@/assets/Santafe-rai262p-1.jpeg";
import sorento2013 from "@/assets/Sorento2013-rad626d-1.jpeg";
import sorento2014 from "@/assets/Sorento2014-raj736c-1.jpeg";
import sorento2015 from "@/assets/Sorento2015-raj673m-1.jpeg";
import niro2 from "@/assets/Niro-rah846n-2.jpeg";
import santafe2 from "@/assets/Santafe-rai262p-2.jpeg";
import sorento2014b from "@/assets/Sorento2014-raj736c-2.jpeg";
import sorento2015b from "@/assets/Sorento2015-raj673m-2.jpeg";
import sorento2015c from "@/assets/Sorento2015-raj673m-3.jpeg";
import type { Category } from "@/lib/store";

export const VEHICLE_IMAGES: Record<string, string> = {
  "niro-rah846n": niro,
  "santafe-rai262p": santafe,
  "sorento2013-rad626d": sorento2013,
  "sorento2014-raj736c": sorento2014,
  "sorento2015-raj673m": sorento2015,
  "byd-sealion": bydSealion,
};

export function vehicleImage(id: string, _category: Category): string {
  return VEHICLE_IMAGES[id] ?? VEHICLE_IMAGES["byd-sealion"];
}

/** Extras (gallery) — extra angles for the same fleet cars. */
export const VEHICLE_GALLERY: Record<string, string[]> = {
  "niro-rah846n": [niro, niro2],
  "santafe-rai262p": [santafe, santafe2],
  "sorento2014-raj736c": [sorento2014, sorento2014b],
  "sorento2015-raj673m": [sorento2015, sorento2015b, sorento2015c],
};

export function vehicleGallery(id: string, category: Category): string[] {
  return VEHICLE_GALLERY[id] ?? [vehicleImage(id, category)];
}
export const CATEGORY_LABEL: Record<Category, string> = {
  safari: "Safari 4x4",
  suv: "SUV",
  sedan: "Sedan",
  van: "Executive van",
};
