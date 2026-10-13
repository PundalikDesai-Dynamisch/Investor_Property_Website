import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { LeadButton } from "@/components/lead/lead-provider";
import { AREAS } from "@/lib/areas";
import { bySlug } from "@/lib/data";
import { bhkLabel, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Compare Properties", robots: { index: false }, alternates: { canonical: "/compare/" } };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const items = (ids ?? "").split(",").map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 4);
  const clean = (s: string | null) => (s ?? "").replace(/\*/g, "") || "To be confirmed";
  const rows: [string, (p: (typeof items)[number]) => string][] = [
    ["Starting price", (p) => formatPrice(p.priceFromLakh)], ["Area", (p) => (p.area ? AREAS[p.area].name : "Pune")], ["Developer", (p) => p.developer ?? "To be confirmed"],
    ["Configuration", (p) => bhkLabel(p.bhk) || "To be confirmed"], ["Carpet area", (p) => clean(p.carpetLabel)], ["Stage", (p) => p.statusLabel ?? "To be confirmed"],
    ["Target possession", (p) => p.targetPossession ?? "To be confirmed"], ["RERA possession", (p) => p.reraPossession ?? "To be confirmed"], ["RERA number", (p) => p.rera ?? "To be confirmed"],
    ["Land parcel", (p) => p.landParcel ?? "To be confirmed"], ["Towers", (p) => p.towers ?? "To be confirmed"], ["Floors", (p) => p.floors ?? "To be confirmed"], ["Litigation disclosed", (p) => p.litigation ?? "To be confirmed"],
  ];
  return (
    <>
      <PageHero eyebrow="Compare" title="Side by side." crumbs={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      <Container className="py-12 md:py-16">
        {items.length < 2 ? (
          <div className="rounded-md border border-dashed border-line-2 p-10 text-center"><p className="h3">Pick at least two projects to compare.</p><p className="mt-2 text-ink-2">Use the Compare button on any property card.</p><Link href="/properties" className="mt-5 inline-flex h-11 items-center rounded-sm bg-brand px-5 font-semibold text-paper">Browse properties</Link></div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-line bg-card">
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">Property comparison</caption>
              <thead><tr className="border-b border-line"><th className="w-44 p-4" />{items.map((p) => <th key={p.slug} scope="col" className="p-4 align-bottom"><Link href={`/${p.slug}`} className="font-display text-xl font-medium underline-offset-4 hover:underline">{p.name}</Link></th>)}</tr></thead>
              <tbody>
                {rows.map(([k, f]) => <tr key={k} className="border-b border-line last:border-0"><th scope="row" className="label p-4 font-bold">{k}</th>{items.map((p) => <td key={p.slug} className="tnum p-4 font-semibold">{f(p)}</td>)}</tr>)}
                <tr><th scope="row" className="p-4" />{items.map((p) => <td key={p.slug} className="p-4"><LeadButton intent="visit" property={{ slug: p.slug, name: p.name }} size="sm" variant="secondary">Schedule a visit</LeadButton></td>)}</tr>
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  );
}
