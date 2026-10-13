import type { AreaKey, Status } from "./types";

/** Areas with a legacy hub keep their ranking URL; the rest get /locations/[slug]. */
export const AREAS: Record<AreaKey, { name: string; legacy?: string }> = {
  kharadi: { name: "Kharadi", legacy: "/2-bhk-flats-in-kharadi" },
  dhanori: { name: "Dhanori", legacy: "/2-bhk-flats-in-dhanori" },
  mundhwa: { name: "Mundhwa", legacy: "/2-bhk-flats-in-mundhwa" },
  hadapsar: { name: "Hadapsar", legacy: "/2-bhk-flats-in-hadapsar" },
  "keshav-nagar": { name: "Keshav Nagar", legacy: "/2-bhk-flats-in-keshav-nagar" },
  charholi: { name: "Charholi", legacy: "/2-bhk-flats-in-charholi" },
  wagholi: { name: "Wagholi", legacy: "/2-bhk-flats-in-wagholi" },
  nibm: { name: "NIBM", legacy: "/2-bhk-flats-in-nibm" },
  undri: { name: "Undri" },
  lohegaon: { name: "Lohegaon" },
  "wadgaon-sheri": { name: "Wadgaon Sheri" },
  "viman-nagar": { name: "Viman Nagar" },
  manjari: { name: "Manjari" },
  "kalyani-nagar": { name: "Kalyani Nagar" },
};
export const areaKeys = Object.keys(AREAS) as AreaKey[];
export const areaHref = (k: AreaKey) => AREAS[k].legacy ?? `/locations/${k}`;
export function areaFromHubSlug(slug: string): AreaKey | null {
  const k = slug.replace(/^2-bhk-flats-in-/, "") as AreaKey;
  return slug.startsWith("2-bhk-flats-in-") && AREAS[k]?.legacy ? k : null;
}

export const BUDGETS = [
  { id: "u75", label: "Under ₹75 L", min: 0, max: 75 },
  { id: "75-125", label: "₹75 L – 1.25 Cr", min: 75, max: 125 },
  { id: "125-200", label: "₹1.25 – 2 Cr", min: 125, max: 200 },
  { id: "200p", label: "Above ₹2 Cr", min: 200, max: Infinity },
] as const;

export const STATUS_LABEL: Record<Status, string> = { new_launch: "New launch", under_construction: "Under construction", ready: "Ready to move" };

