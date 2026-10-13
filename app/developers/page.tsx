import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { developers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pune Developers and Their Projects",
  description: `Browse projects by developer: ${developers.length} developers with current residential projects in Pune.`,
  alternates: { canonical: "/developers/" },
};

export default function DevelopersPage() {
  return (
    <>
      <PageHero eyebrow="Developers" title="Browse by builder." intro="Developer names are as published on each project page." crumbs={[{ label: "Home", href: "/" }, { label: "Developers" }]} />
      <Container className="py-14 md:py-20">
        <ul className="grid border-l border-t border-line-2 sm:grid-cols-2 lg:grid-cols-4">
          {developers.map((d) => <li key={d.slug} className="border-b border-r border-line-2 bg-card"><Link href={`/developers/${d.slug}`} className="flex h-full items-baseline justify-between gap-3 p-5 transition-colors hover:bg-tint"><span className="font-display text-xl">{d.name}</span><span className="tnum small text-muted">{d.count}</span></Link></li>)}
        </ul>
      </Container>
    </>
  );
}
