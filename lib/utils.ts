import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function formatPrice(lakh: number | null | undefined): string {
  if (lakh == null) return "Price on request";
  return lakh >= 100 ? `₹${+(lakh / 100).toFixed(2)} Cr` : `₹${+lakh.toFixed(2)} L`;
}

export function bhkLabel(bhk: number[]): string {
  if (!bhk.length) return "";
  const parts = bhk.map((n) => String(n));
  const head = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} & ${parts.at(-1)}` : parts[0];
  return `${head} BHK`;
}

export function carpetLabel(min: number | null, max: number | null): string {
  if (min == null) return "";
  const f = (n: number) => n.toLocaleString("en-IN");
  return max && max !== min ? `${f(min)}–${f(max)} sq ft` : `${f(min)} sq ft`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const formatPriceRange = (min: number | null, max: number | null) => (min == null ? "prices on request" : `${formatPrice(min)} to ${formatPrice(max)}`);
