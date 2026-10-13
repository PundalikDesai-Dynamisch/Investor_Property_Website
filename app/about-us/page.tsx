import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow, Button } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { Faq } from "@/components/dialog";
import { LeadButton } from "@/components/lead/lead-provider";
import { ABOUT_FAQS, SERVICES } from "@/lib/content";
import { areaStats, developers, properties } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Pune Property Investor: Real Estate Advisory in Pune",
  description: "Pune Property Investor helps home buyers and investors make informed property decisions, with local market knowledge, project comparison and personal guidance.",
  alternates: { canonical: "/about-us/" },
};

const MISSION = ["Professional property advisory", "Local market expertise", "Transparent communication", "Personalised recommendations", "Reliable project information", "Technology-enabled property research", "Customer-focused service"];
const EXTRAS = ["Vaastu guidance", "Home loan, home insurance and loan against property", "Legal expert guidance and support", "Interior designer facility", "Guidance for resale and rental at market rates"];

export default function AboutPage() {
  const stats = [[String(properties.length), "projects compared"], [String(developers.length), "developers"], [String(areaStats.length), "areas"], ["20,000+", "clients advised"], ["200+", "team members"]];
  return (
    <>
      <PageHero eyebrow="About" title="An advisor for the buyer’s side of the table." intro="We are a real estate advisory firm that helps home buyers and investors make informed decisions in Pune." crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <div><Eyebrow className="mb-4">Who we are</Eyebrow><h2 className="h2">Research first, recommendations second.</h2></div>
        <div className="max-w-[62ch] space-y-5 text-[1.0625rem] text-ink-2">
          <p>We combine local market knowledge, property research, project analysis and personal guidance to simplify buying a property. Whether it is a first home, an upgrade, a family property or an investment, we match projects to your requirements, budget, lifestyle and long-term goals.</p>
          <p>Rather than showing you many properties, we work out what you actually need, then help you compare the options that fit. Our approach rests on four things: transparency, market knowledge, professional guidance and client satisfaction.</p>
          <p>Our head office is in Kharadi, with offices in Dighi and Katraj. <Link className="font-semibold text-ink underline underline-offset-4" href="/contact-us">Visit or call us</Link>.</p>
        </div>
      </Container>
      <section className="border-y border-line bg-card" aria-label="In numbers">
        <Container><dl className="grid grid-cols-2 divide-x divide-line md:grid-cols-5">{stats.map(([n, l]) => <div key={l} className="px-4 py-8 first:pl-0"><dd className="tnum font-display text-4xl">{n}</dd><dt className="label mt-2">{l}</dt></div>)}</dl></Container>
      </section>
      <Container className="grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <div><Eyebrow className="mb-4">Vision</Eyebrow><p className="font-display text-[1.75rem] leading-snug">To be the most trusted and respected property advisory partner in Pune, through professional guidance, transparent communication and long-term value for clients.</p></div>
        <div><Eyebrow className="mb-4">Mission</Eyebrow><p className="mb-4 text-ink-2">To simplify buying and investing in real estate through:</p><ul className="grid gap-2">{MISSION.map((m) => <li key={m} className="flex items-center gap-3 border-b border-line pb-2 font-semibold"><span className="h-px w-5 bg-accent" aria-hidden />{m}</li>)}</ul></div>
      </Container>
      <section className="border-y border-line bg-tint/50 py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div><Eyebrow className="mb-4">Expertise</Eyebrow><h2 className="h2">What we do</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">{SERVICES.slice(0, 6).map((s) => <li key={s.title} className="py-3.5 font-semibold">{s.title}</li>)}</ul>
            <Button asChild variant="secondary" className="mt-6"><Link href="/services">Service details <ArrowRight /></Link></Button></div>
          <div><Eyebrow className="mb-4">Beyond the shortlist</Eyebrow><h2 className="h2">Also available</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">{EXTRAS.map((s) => <li key={s} className="py-3.5 font-semibold">{s}</li>)}</ul></div>
        </Container>
      </section>
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <div><Eyebrow className="mb-4">Questions</Eyebrow><h2 className="h2">Good to know</h2></div>
        <Faq items={ABOUT_FAQS} />
      </Container>
      <section className="blueprint bg-night text-paper"><Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center"><h2 className="h2 max-w-xl">Talk it through with an advisor.</h2><LeadButton intent="advisor" size="lg" variant="light">Book a consultation</LeadButton></Container></section>
    </>
  );
}
