import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { LeadButton } from "@/components/lead/lead-provider";
import { SERVICES, STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Property Advisory Services in Pune",
  description: "Residential and investment advisory, project comparison, site visits, price analysis, home loan support, luxury and commercial property advice in Pune.",
  alternates: { canonical: "/services/" },
};

const links: Record<string, [string, string][]> = {
  "Home loan and documentation support": [["EMI calculator", "/emi-calculator"], ["Loan eligibility checker", "/home-loan-eligibility-checker"]],
  "Luxury property advisory": [["Luxury properties", "/luxury-properties-in-pune"]],
  "Residential property advisory": [["Browse all properties", "/properties"]],
  "Project comparison": [["How comparison works", "/compare"]],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Help at every step of the purchase." intro="From the first shortlist to the paperwork after booking, our advisors work for the buyer." crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <Container className="py-14 md:py-20">
        <ul className="divide-y divide-line border-y border-line">
          {SERVICES.map((s) => (
            <li key={s.title} className="grid gap-4 py-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
              <h2 className="h3">{s.title}</h2>
              <div><p className="text-[1.0625rem] text-ink-2">{s.body}</p>
                {links[s.title] && <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">{links[s.title].map(([l, h]) => <Link key={h} href={h} className="font-semibold underline underline-offset-4">{l}</Link>)}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
      <section className="border-y border-line bg-card py-16">
        <Container>
          <h2 className="h2 mb-10">How an engagement runs</h2>
          <ol className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-4">{STEPS.map((s, i) => <li key={s.title}><span className="tnum font-display text-2xl text-accent-ink">{String(i + 1).padStart(2, "0")}</span><h3 className="h4 mt-2">{s.title}</h3><p className="mt-1 text-[0.9375rem] text-ink-2">{s.body}</p></li>)}</ol>
        </Container>
      </section>
      <Container className="flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
        <h2 className="h2 max-w-xl">Tell us what you are looking for.</h2>
        <LeadButton intent="advisor" size="lg">Book a consultation</LeadButton>
      </Container>
    </>
  );
}
