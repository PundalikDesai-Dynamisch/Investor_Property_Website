import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AreaPage } from "@/components/location/area-page";
import { AREAS, areaKeys } from "@/lib/areas";
import { areaStats } from "@/lib/data";
import type { AreaKey } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => areaKeys.map((k) => ({ slug: k }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = AREAS[slug as AreaKey];
  const s = areaStats.find((x) => x.key === slug);
  if (!a || !s || a.legacy) return {};
  return { title: `Flats in ${a.name}, Pune | ${s.count} Projects`, description: `Compare ${s.count} residential projects in ${a.name}, Pune, with prices, floor plans and RERA details.`, alternates: { canonical: `/locations/${slug}/` } };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const a = AREAS[slug as AreaKey];
  if (!a) notFound();
  if (a.legacy) permanentRedirect(`${a.legacy}/`); // areas with an existing ranking URL keep it
  return <AreaPage k={slug as AreaKey} />;
}
