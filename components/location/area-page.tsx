import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs, Container } from "@/components/ui";
import { Discovery } from "@/components/property/discovery";
import { PropertyCard } from "@/components/property/property-card";
import { LeadButton } from "@/components/lead/lead-provider";
import { AREAS } from "@/lib/areas";
import { areaIntro, areaStats, cards } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { AreaKey, PropertyCardData } from "@/lib/types";

export const devsOf = (items: PropertyCardData[]) =>
  [...items.reduce((m, p) => { if (p.developerSlug && p.developer) m.set(p.developerSlug, { slug: p.developerSlug, name: p.developer, count: (m.get(p.developerSlug)?.count ?? 0) + 1 }); return m; }, new Map<string, { slug: string; name: string; count: number }>()).values()].sort((a, b) => b.count - a.count);

export function StaticGrid({ items }: { items: PropertyCardData[] }) {
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((p, i) => <PropertyCard key={p.slug} p={p} priority={i < 3} />)}</div>;
}

export function AreaPage({ k }: { k: AreaKey }) {
  const stat = areaStats.find((a) => a.key === k)!;
  const name = AREAS[k].name;
  const items = cards.filter((c) => c.area === k);
  const devs = devsOf(items);
  const ns = stat.lat != null && stat.lng != null ? `${stat.lat.toFixed(4)}° N  ${stat.lng.toFixed(4)}° E` : null;
  return (
    <>
      <section className="border-b border-line bg-tint/60">
        <Container className="py-12 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }, { label: name }]} />
          {ns && <p className="tnum label mt-10">{ns}</p>}
          <h1 className="h1 mt-3">Flats in {name}, Pune</h1>
          <p className="lead mt-5 max-w-2xl">{areaIntro(k) || `Compare ${stat.count} projects in ${name}, with starting prices from ${formatPrice(stat.minLakh)}.`}</p>
          <dl className="sheet mt-10">
            <div><dt>Projects</dt><dd>{stat.count}</dd></div>
            <div><dt>Starting prices</dt><dd>{stat.minLakh != null ? `${formatPrice(stat.minLakh)} – ${formatPrice(stat.maxLakh)}` : "On request"}</dd></div>
            <div><dt>Ready to move</dt><dd>{stat.ready}</dd></div>
            <div><dt>Developers</dt><dd>{devs.length}</dd></div>
          </dl>
        </Container>
      </section>
      <Container className="py-14 md:py-20">
        <Suspense fallback={<StaticGrid items={items.slice(0, 24)} />}>
          <Discovery items={items} developers={devs} lockedArea={k} />
        </Suspense>
      </Container>
      <section className="border-t border-line bg-card">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div><h2 className="h3">Not sure {name} is the right fit?</h2><p className="mt-2 max-w-xl text-ink-2">An advisor can compare it with nearby areas on price, commute and what you get for your budget.</p></div>
          <LeadButton intent="advisor" size="lg">Talk to an advisor</LeadButton>
        </Container>
      </section>
      <Container className="py-12">
        <p className="label mb-4">Other areas</p>
        <ul className="flex flex-wrap gap-2">{areaStats.filter((a) => a.key !== k && a.count > 0).map((a) => <li key={a.key}><Link href={a.href} className="inline-block rounded-sm border border-line-2 px-3 py-1.5 text-sm font-semibold hover:border-ink">{a.name} <span className="text-muted">{a.count}</span></Link></li>)}</ul>
      </Container>
    </>
  );
}
