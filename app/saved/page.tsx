import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { SavedList } from "@/components/property/saved-list";
import { cards } from "@/lib/data";

export const metadata: Metadata = { title: "Saved Homes", robots: { index: false }, alternates: { canonical: "/saved/" } };

export default function SavedPage() {
  return (
    <>
      <PageHero eyebrow="Saved" title="Your shortlist." intro="Saved on this device only." crumbs={[{ label: "Home", href: "/" }, { label: "Saved" }]} />
      <Container className="py-12 md:py-16"><SavedList all={cards} /></Container>
    </>
  );
}
