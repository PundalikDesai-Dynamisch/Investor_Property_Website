import type { MetadataRoute } from "next";
import { AREAS, areaKeys } from "@/lib/areas";
import { developers, legacyPages, posts, properties } from "@/lib/data";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, lastModified?: string | null, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${SITE.url}${path === "/" ? "/" : path + "/"}`, lastModified: lastModified ?? undefined, priority });
  return [
    u("/", null, 1), u("/properties", null, 0.9), u("/locations", null, 0.8), u("/services", null, 0.7), u("/blogs", null, 0.7), u("/about-us"), u("/contact-us", null, 0.7),
    u("/video-gallery-project-tours"), u("/luxury-properties-in-pune", null, 0.8), u("/emi-calculator"), u("/home-loan-eligibility-checker"), u("/developers", null, 0.5),
    ...areaKeys.map((k) => u(AREAS[k].legacy ?? `/locations/${k}`, null, 0.8)),
    ...properties.map((p) => u(`/${p.slug}`, p.lastmod, 0.8)),
    ...posts.map((p) => u(`/${p.slug}`, p.date, 0.6)),
    ...developers.map((d) => u(`/developers/${d.slug}`, null, 0.4)),
    ...Object.keys(legacyPages).map((s) => u(`/${s}`, null, 0.3)),
  ];
}
