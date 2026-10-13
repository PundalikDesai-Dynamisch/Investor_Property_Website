import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { Discovery } from "@/components/property/discovery";
import { StaticGrid } from "@/components/location/area-page";
import { LeadButton } from "@/components/lead/lead-provider";
import { cards, developers } from "@/lib/data";

// "Luxury" here means a published starting price of ₹2 Cr or more. Change the threshold in one place.
const LUXURY_FROM_LAKH = 200;

export const metadata: Metadata = {
  title: "Luxury Properties in Pune: Premium Residences from ₹2 Cr",
  description: "Premium apartments and residences in Pune priced from ₹2 Cr, with floor plans, RERA details and private site visits.",
  alternates: { canonical: "/luxury-properties-in-pune/" },
};

export default function LuxuryPage() {
  const items = cards.filter((c) => (c.priceFromLakh ?? 0) >= LUXURY_FROM_LAKH && c.cover);
  return (
    <>
      <PageHero eyebrow="Luxury" title="Premium residences in Pune." intro={`${items.length} projects with a starting price of ₹2 Cr or more. Looking for commercial space as well? Ask an advisor.`} crumbs={[{ label: "Home", href: "/" }, { label: "Luxury properties" }]}>
        <LeadButton intent="visit" className="mt-8" size="lg">Arrange a private viewing</LeadButton>
      </PageHero>
      <Container className="py-12 md:py-16">
        <Suspense fallback={<StaticGrid items={items.slice(0, 24)} />}><Discovery items={items} developers={developers} /></Suspense>
      </Container>
    </>
  );
}
