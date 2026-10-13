import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/lead/lead-form";
import { MapFacade } from "@/components/property/map-facade";
import { JsonLd } from "@/components/json-ld";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Pune Property Investor: Call, WhatsApp or Visit",
  description: "Talk to a Pune property advisor. Call +91 73981 74444, WhatsApp, or visit our Kharadi office at Gera Imperium Alpha.",
  alternates: { canonical: "/contact-us/" },
};

const row = "flex gap-4 border-b border-line py-5";

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Tell us what you are looking for." intro="Share a few details and an advisor will call you back. Prefer to talk now? Call or message us." crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <Container className="grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <h2 className="h3 mb-2">Reach us directly</h2>
          <div className="border-t border-line">
            <div className={row}><Phone className="mt-1 size-5 shrink-0 text-brand" aria-hidden /><div><p className="label">Property enquiries</p><a className="text-lg font-semibold hover:underline" href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a></div></div>
            <div className={row}><MessageCircle className="mt-1 size-5 shrink-0 text-brand" aria-hidden /><div><p className="label">WhatsApp</p><a className="text-lg font-semibold hover:underline" href={waLink()} target="_blank" rel="noopener">Message an advisor</a></div></div>
            <div className={row}><Mail className="mt-1 size-5 shrink-0 text-brand" aria-hidden /><div><p className="label">Email</p><a className="text-lg font-semibold hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></div></div>
            <div className={row}><MapPin className="mt-1 size-5 shrink-0 text-brand" aria-hidden /><div><p className="label">Head office, Kharadi</p><address className="not-italic text-ink-2">{SITE.address}</address><p className="small mt-1 text-muted">Also at Dighi and Katraj.</p></div></div>
          </div>
          <div className="mt-8"><MapFacade lat={18.556824} lng={73.952449} name="our Kharadi office" /></div>
          <p className="small mt-6 text-muted">Careers: <a className="underline underline-offset-4" href="mailto:hr@punepropertyinvestor.com">hr@punepropertyinvestor.com</a></p>
        </div>
        <div className="self-start rounded-md border border-line bg-card p-6 sm:p-8">
          <h2 className="h3 mb-6">Request a call back</h2>
          <LeadForm intent="advisor" />
        </div>
      </Container>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Pune Property Investor", url: `${SITE.url}/contact-us/` }} />
    </>
  );
}
