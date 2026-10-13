import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { areaStats } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pune Areas: Where to Buy, With Prices and Projects",
  description: "Compare Pune areas by number of projects and starting prices: Kharadi, Dhanori, Mundhwa, Hadapsar, Keshav Nagar, Wagholi, NIBM and more.",
  alternates: { canonical: "/locations/" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero eyebrow="Locations" title="Choose the area first." intro="Each area page lists its projects with starting prices, so you can see what your budget buys where." crumbs={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      <Container className="py-14 md:py-20">
        <ul className="grid border-l border-t border-line-2 sm:grid-cols-2 lg:grid-cols-3">
          {areaStats.map((a) => (
            <li key={a.key} className="border-b border-r border-line-2 bg-card">
              <Link href={a.href} className="group flex h-full min-h-56 flex-col justify-between gap-12 p-7 transition-colors hover:bg-brand hover:text-paper">
                <span className="tnum label group-hover:!text-paper/70">{a.lat?.toFixed(4)}° N  {a.lng?.toFixed(4)}° E</span>
                <span>
                  <span className="flex items-start justify-between"><span className="h2">{a.name}</span><ArrowUpRight className="size-6 opacity-50 transition-all group-hover:opacity-100" aria-hidden /></span>
                  <span className="mt-2 block text-muted group-hover:text-paper/75">{a.count} projects · from {formatPrice(a.minLakh)}{a.ready ? ` · ${a.ready} ready` : ""}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
