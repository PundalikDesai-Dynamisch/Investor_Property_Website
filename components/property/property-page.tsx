import Link from "next/link";
import { Check, FileDown, MapPin, Phone, ShieldAlert } from "lucide-react";
import { Breadcrumbs, Container, Tag } from "@/components/ui";
import { Faq } from "@/components/dialog";
import { LeadButton } from "@/components/lead/lead-provider";
import { LeadForm } from "@/components/lead/lead-form";
import { Gallery } from "./gallery";
import { MapFacade } from "./map-facade";
import { PropertyCard } from "./property-card";
import { YouTube } from "@/components/media/youtube";
import { JsonLd } from "@/components/json-ld";
import { AREAS, areaHref } from "@/lib/areas";
import { propertyFaqs, similar, toCard } from "@/lib/data";
import { SITE, waLink } from "@/lib/site";
import { bhkLabel, formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";

const clean = (s: string | null | undefined) => (s ?? "").replace(/\*/g, "").trim();

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="mt-16 scroll-mt-28"><h2 className="h2 mb-6">{title}</h2>{children}</section>;
}

function PriceCard({ p }: { p: Property }) {
  const ref = { slug: p.slug, name: p.name, brochure: p.brochure };
  return (
    <div className="rounded-md border border-line bg-card p-6">
      <p className="label">Starting from</p>
      <p className="tnum mt-1 font-display text-[2.5rem] leading-none">{formatPrice(p.priceFromLakh)}{p.priceFromLakh != null && <span className="text-muted">*</span>}</p>
      <p className="small mt-2 text-muted">{[bhkLabel(p.bhk), clean(p.carpetLabel)].filter(Boolean).join(" · ") || "Configuration to be confirmed"}</p>
      <div className="mt-5 grid gap-2.5">
        <LeadButton intent="price" property={ref} size="lg">Get price details</LeadButton>
        <LeadButton intent="visit" property={ref} size="lg" variant="secondary">Schedule a visit</LeadButton>
        <LeadButton intent="brochure" property={ref} variant="ghost"><FileDown /> Download brochure</LeadButton>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-sm font-semibold">
        <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 hover:underline"><Phone className="size-4" aria-hidden />Call</a>
        <a href={waLink(`Hi, I am interested in ${p.name}.`)} target="_blank" rel="noopener" className="hover:underline">WhatsApp</a>
      </div>
      <p className="caption mt-3">*Indicative starting price as published. Confirm the current price sheet with an advisor.</p>
    </div>
  );
}

export function PropertyPage({ p }: { p: Property }) {
  const area = p.area ? AREAS[p.area] : null;
  const faqs = propertyFaqs(p);
  const ref = { slug: p.slug, name: p.name, brochure: p.brochure };
  const images = [p.cover, ...p.gallery].filter((x): x is string => !!x);
  const facts: [string, string | null][] = [
    ["RERA number", p.rera], ["Land parcel", p.landParcel], ["Towers", p.towers], ["Floors", p.floors], ["Configuration", bhkLabel(p.bhk) || null],
    ["Carpet area", clean(p.carpetLabel) || null], ["Stage", p.statusLabel], ["Target possession", p.targetPossession], ["RERA possession", p.reraPossession], ["Litigation", p.litigation],
  ];
  const rows = facts.filter(([, v]) => v);
  const overview = p.description || `${p.name} is a ${bhkLabel(p.bhk) || "residential"} project${p.developer ? ` by ${p.developer}` : ""}${area ? ` in ${area.name}, Pune` : " in Pune"}.`;
  const checks: string[] = [];
  if (p.rera) checks.push(`Verify RERA number ${p.rera} on the MahaRERA website.`);
  if (p.targetPossession && p.reraPossession && p.targetPossession !== p.reraPossession) checks.push(`The target possession (${p.targetPossession}) differs from the RERA possession date (${p.reraPossession}). Plan around the later date.`);
  if (p.litigation === "Yes") checks.push("The project discloses litigation. Ask for the case details and read the MahaRERA record before you book.");
  if (p.flags.includes("Headline price differs from configuration cards")) checks.push("Published prices differ between the headline and the configuration table. Ask for the current price sheet.");
  checks.push("Visit the site and the sample flat, and compare at least two nearby projects.");
  const near = similar(p, 3).map(toCard);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }, ...(area && p.area ? [{ label: area.name, href: areaHref(p.area) }] : []), { label: p.name }];
  const url = `${SITE.url}/${p.slug}/`;
  return (
    <>
      <Container className="pt-6"><Breadcrumbs items={crumbs} /></Container>
      <Container className="mt-6 grid gap-x-14 pb-4 lg:grid-cols-[minmax(0,1fr)_22.5rem]">
        <div className="min-w-0">
          <header>
            <div className="mb-3 flex flex-wrap gap-2">{p.status === "new_launch" && <Tag tone="accent">New launch</Tag>}{p.status === "ready" && <Tag tone="night">Ready to move</Tag>}{p.status === "under_construction" && <Tag tone="night">Under construction</Tag>}</div>
            <h1 className="h1">{p.name}</h1>
            <p className="lead mt-3 flex flex-wrap items-center gap-x-3">
              {area && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{area.name}, Pune</span>}
              {p.developer && <span>by <Link href={`/developers/${p.developerSlug}`} className="underline underline-offset-4">{p.developer}</Link></span>}
            </p>
          </header>
          <div className="mt-8">{images.length > 0 ? <Gallery images={images} name={p.name} /> : <div className="label grid aspect-[16/9] place-items-center rounded-md bg-wash">Photos coming soon</div>}</div>
          <div className="mt-8 lg:hidden"><PriceCard p={p} /></div>

          <Section id="facts" title="Project facts">
            {rows.length ? (
              <dl className="sheet">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            ) : <p className="text-ink-2">Project specifications are not published yet. An advisor can share them.</p>}
          </Section>

          <Section id="overview" title="Overview"><p className="max-w-[68ch] text-[1.0625rem] text-ink-2">{overview}</p></Section>

          <Section id="pricing" title="Configurations and pricing">
            {p.configs.length ? (
              <div className="overflow-x-auto rounded-md border border-line bg-card">
                <table className="w-full min-w-[34rem] text-left text-[0.9375rem]">
                  <thead><tr className="border-b border-line">{["Type", "Carpet area", "Starting price", ""].map((h) => <th key={h} className="label px-5 py-3 font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {p.configs.map((c) => (
                      <tr key={c.type} className="border-b border-line last:border-0">
                        <th scope="row" className="px-5 py-4 font-display text-xl font-medium">{c.type}</th>
                        <td className="tnum px-5 py-4">{clean(c.carpet.replace(/onwards/i, "")) || "On request"}</td>
                        <td className="tnum px-5 py-4 font-semibold">{clean(c.price.replace(/onwards/i, "")) || "On request"}<span className="text-muted">*</span></td>
                        <td className="px-5 py-3 text-right"><LeadButton intent="price" property={ref} size="sm" variant="secondary">Get price</LeadButton></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-line-2 p-6"><p className="text-ink-2">Unit-wise prices are shared on request.</p><LeadButton intent="price" property={ref} className="mt-4">Get price details</LeadButton></div>
            )}
          </Section>

          {p.video && <Section id="video" title="Video walkthrough"><YouTube id={p.video} title={`${p.name} walkthrough`} /></Section>}

          {(p.floorPlans.length > 0 || p.masterPlans.length > 0) && (
            <Section id="plans" title="Floor plans">
              <Gallery images={[...p.floorPlans, ...p.masterPlans]} name={p.name} variant="plans" />
              <LeadButton intent="brochure" property={ref} variant="secondary" className="mt-5"><FileDown /> Download brochure</LeadButton>
            </Section>
          )}

          {p.lat != null && p.lng != null && (
            <Section id="location" title="Location">
              <MapFacade lat={p.lat} lng={p.lng} name={p.name} />
              {area && p.area && <p className="mt-4 text-ink-2">See all <Link className="font-semibold underline underline-offset-4" href={areaHref(p.area)}>projects in {area.name}</Link> to compare prices nearby.</p>}
            </Section>
          )}

          <Section id="checks" title="Before you book">
            <ul className="grid gap-3">
              {checks.map((c) => <li key={c} className="flex gap-3 text-[1.0625rem] text-ink-2">{c.startsWith("The project discloses") ? <ShieldAlert className="mt-1 size-5 shrink-0 text-warn" aria-hidden /> : <Check className="mt-1 size-5 shrink-0 text-ok" aria-hidden />}{c}</li>)}
            </ul>
          </Section>

          <Section id="faqs" title="Questions buyers ask"><Faq items={faqs} /></Section>

          <Section id="enquire" title={`Talk to an advisor about ${p.name}`}>
            <div className="rounded-md border border-line bg-card p-6 sm:p-8"><LeadForm intent="advisor" property={ref} compact /></div>
          </Section>
        </div>
        <aside className="hidden lg:block"><div className="sticky top-24"><PriceCard p={p} /></div></aside>
      </Container>

      {near.length > 0 && area && (
        <Container className="py-16">
          <h2 className="h2 mb-8">More in {area.name}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{near.map((c) => <PropertyCard key={c.slug} p={c} />)}</div>
        </Container>
      )}
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: SITE.url + c.href } : { item: url }) })) },
        { "@context": "https://schema.org", "@type": "RealEstateListing", name: p.name, url, description: overview, ...(p.cover ? { image: p.cover } : {}), about: { "@type": "ApartmentComplex", name: p.name, address: { "@type": "PostalAddress", addressLocality: area?.name ?? "Pune", addressRegion: "MH", addressCountry: "IN" }, ...(p.lat != null ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}) } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ]} />
    </>
  );
}
