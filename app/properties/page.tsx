import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { Discovery } from "@/components/property/discovery";
import { StaticGrid } from "@/components/location/area-page";
import { cards, developers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Flats and Apartments in Pune: Compare Prices, Areas and Developers",
  description: `Search ${cards.length} residential projects across Pune by area, budget, BHK and possession. Compare prices, floor plans and RERA details, then book a site visit.`,
  alternates: { canonical: "/properties/" },
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Properties" title="Every project we track, in one place." intro={`${cards.length} projects across Pune. Filter by area, budget, configuration and stage, then compare up to four side by side.`} crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]} />
      <Container className="py-12 md:py-16">
        <Suspense fallback={<StaticGrid items={cards.slice(0, 24)} />}>
          <Discovery items={cards} developers={developers} />
        </Suspense>
      </Container>
    </>
  );
}
