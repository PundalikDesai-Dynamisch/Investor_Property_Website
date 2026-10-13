import Link from "next/link";
import { Container } from "@/components/ui";
import { Logo } from "./header";
import { SITE } from "@/lib/site";
import { areaStats } from "@/lib/data";

const col = "grid content-start gap-2.5 text-[0.9375rem] text-paper/80 [&_a:hover]:text-paper [&_a:hover]:underline";

export function Footer() {
  return (
    <footer className="blueprint bg-night text-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-5">
          <Logo light />
          <p className="max-w-sm text-[0.9375rem] text-paper/75">Independent property advisory for home buyers and investors in Pune. We compare projects, arrange site visits and help with loans and paperwork.</p>
          <address className="grid gap-1.5 text-[0.9375rem] not-italic text-paper/80">
            <span>{SITE.address}</span>
            <a href={`tel:${SITE.phone}`} className="font-semibold text-paper hover:underline">{SITE.phoneLabel}</a>
            <a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a>
            <span className="text-paper/60">Also at {SITE.branches.slice(1).join(" and ")}</span>
          </address>
        </div>
        <nav aria-label="Areas" className={col}>
          <p className="label !text-paper/55">Areas</p>
          {areaStats.filter((a) => a.count > 0).slice(0, 8).map((a) => <Link key={a.key} href={a.href}>Flats in {a.name}</Link>)}
          <Link href="/locations" className="font-semibold text-paper">All areas</Link>
        </nav>
        <nav aria-label="Explore" className={col}>
          <p className="label !text-paper/55">Explore</p>
          <Link href="/properties">All properties</Link>
          <Link href="/luxury-properties-in-pune">Luxury properties</Link>
          <Link href="/developers">Developers</Link>
          <Link href="/video-gallery-project-tours">Project videos</Link>
          <Link href="/emi-calculator">EMI calculator</Link>
          <Link href="/home-loan-eligibility-checker">Loan eligibility</Link>
          <Link href="/blogs">Insights</Link>
        </nav>
        <nav aria-label="Company" className={col}>
          <p className="label !text-paper/55">Company</p>
          <Link href="/about-us">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/awards-certifications">Awards</Link>
          <Link href="/media">In the media</Link>
          <Link href="/career-in-pune">Careers</Link>
          <Link href="/contact-us">Contact</Link>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-paper/60">
            {SITE.social.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
          </div>
        </nav>
      </Container>
      <div className="border-t border-paper/15">
        <Container className="flex flex-col gap-3 py-6 text-[0.8125rem] text-paper/60 md:flex-row md:justify-between">
          <p>Prices are indicative and subject to change. Project details are as published by developers; verify RERA registrations on the MahaRERA website before booking.</p>
          <p className="flex shrink-0 gap-5"><Link href="/privacy-policy" className="hover:text-paper">Privacy</Link><Link href="/term-condition" className="hover:text-paper">Terms</Link><span>© {new Date().getFullYear()} {SITE.name}</span></p>
        </Container>
      </div>
    </footer>
  );
}
