import propertiesJson from "@/data/properties.json";
import postsJson from "@/data/posts.json";
import videosJson from "@/data/videos.json";
import pagesJson from "@/data/pages.json";
import hubsJson from "@/data/hubs.json";
import type { AreaKey, LegacyPage, Post, Property, PropertyCardData, Status, Video } from "./types";
import { bhkLabel, formatPrice } from "./utils";

export const properties = propertiesJson as unknown as Property[];
export const posts = postsJson as unknown as Post[];
export const videos = videosJson as unknown as Video[];
export const legacyPages = pagesJson as unknown as Record<string, LegacyPage>;
const hubIntros = hubsJson as Record<string, string>;

import { AREAS, areaKeys, areaHref, areaFromHubSlug, BUDGETS, STATUS_LABEL } from "./areas";
export { AREAS, areaKeys, areaHref, areaFromHubSlug, BUDGETS, STATUS_LABEL };
export const areaIntro = (k: AreaKey) => hubIntros[k] ?? "";

export interface AreaStat {
  key: AreaKey; name: string; href: string; count: number; minLakh: number | null; maxLakh: number | null; ready: number; lat: number | null; lng: number | null;
}
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
export const areaStats: AreaStat[] = areaKeys
  .map((key) => {
    const items = properties.filter((p) => p.area === key);
    const prices = items.map((p) => p.priceFromLakh).filter((x): x is number => x != null);
    return {
      key, name: AREAS[key].name, href: areaHref(key), count: items.length,
      minLakh: prices.length ? Math.min(...prices) : null, maxLakh: prices.length ? Math.max(...prices) : null,
      ready: items.filter((p) => p.status === "ready").length,
      lat: avg(items.map((p) => p.lat).filter((x): x is number => x != null)), lng: avg(items.map((p) => p.lng).filter((x): x is number => x != null)),
    };
  })
  .sort((a, b) => b.count - a.count);

export const developers = [...properties.reduce((m, p) => {
  if (p.developerSlug && p.developer) m.set(p.developerSlug, { slug: p.developerSlug, name: p.developer, count: (m.get(p.developerSlug)?.count ?? 0) + 1 });
  return m;
}, new Map<string, { slug: string; name: string; count: number }>()).values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export const toCard = (p: Property): PropertyCardData => ({
  slug: p.slug, name: p.name, developer: p.developer, developerSlug: p.developerSlug, area: p.area, status: p.status, priceFromLakh: p.priceFromLakh,
  bhk: p.bhk, carpetMin: p.carpetMin, carpetMax: p.carpetMax, cover: p.cover, targetPossession: p.targetPossession, rera: !!p.rera, video: !!p.video,
});
export const cards = properties.map(toCard);
export const bySlug = new Map(properties.map((p) => [p.slug, p]));
export const postBySlug = new Map(posts.map((p) => [p.slug, p]));
export const similar = (p: Property, n = 3) => properties.filter((x) => x.slug !== p.slug && x.area === p.area && x.cover).slice(0, n);

export function propertyFaqs(p: Property): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  if (p.priceFromLakh) out.push({ q: `What is the starting price of ${p.name}?`, a: `${p.name} is published from ${formatPrice(p.priceFromLakh)} onwards. The final price depends on the unit, floor and current offers, so ask an advisor for the latest price sheet.` });
  if (p.bhk.length) out.push({ q: `Which configurations does ${p.name} offer?`, a: `${bhkLabel(p.bhk)}${p.carpetLabel ? `, with carpet areas of ${p.carpetLabel.replace(/\*/g, "")}` : ""}.` });
  if (p.rera) out.push({ q: `What is the RERA registration number of ${p.name}?`, a: `${p.rera}. Check it on the MahaRERA website before you book.` });
  if (p.targetPossession || p.reraPossession) out.push({ q: `When is possession expected at ${p.name}?`, a: [p.targetPossession && `Target possession is ${p.targetPossession}.`, p.reraPossession && `The RERA possession date is ${p.reraPossession}.`].filter(Boolean).join(" ") });
  out.push({ q: "Can I visit the project before deciding?", a: "Yes. An advisor can arrange a site visit and share sample flat timings. Use the Schedule a visit button on this page." });
  return out;
}
