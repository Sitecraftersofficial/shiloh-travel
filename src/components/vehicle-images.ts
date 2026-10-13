import car4x4 from "@/assets/car-4x4.jpg";
import sedan from "@/assets/car-sedan.jpg";
import van from "@/assets/car-van.jpg";
import type { Category } from "@/lib/store";

export const VEHICLE_IMG: Record<Category, string> = { safari: car4x4, suv: car4x4, sedan, van };
export const CATEGORY_LABEL: Record<Category, string> = {
  safari: "Safari 4x4",
  suv: "SUV",
  sedan: "Sedan",
  van: "Executive van",
};
