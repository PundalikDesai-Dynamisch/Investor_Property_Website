import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button, Container, Eyebrow, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { HeroSearch } from "@/components/home/hero-search";
import { HeroGallery } from "@/components/home/hero-gallery";
import heroData from "@/data/hero.json";
import { PropertyCard } from "@/components/property/property-card";
import { PostCard } from "@/components/blog/post-card";
import { VideoLibrary } from "@/components/media/youtube";
import { LeadButton } from "@/components/lead/lead-provider";
import { SERVICES, STEPS, REVIEWS } from "@/lib/content";
import { AREAS } from "@/lib/areas";
import { areaStats, bySlug, cards, developers, posts, properties, videos } from "@/lib/data";
import { SITE, waLink } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

const FACTORS = ["Location and connectivity", "Demand and rental potential", "Development activity nearby", "Price against comparable projects", "Developer track record", "Possession timeline and RERA status"];

export default function Home() {
  const pick = (s: "new_launch" | "ready", n: number) => cards.filter((c) => c.status === s && c.cover && c.priceFromLakh && c.rera).slice(0, n);
  const featured = [...pick("new_launch", 3), ...pick("ready", 3)];
  const heroSlides = heroData.flatMap((h) => { const p = bySlug.get(h.slug); return p ? [{ slug: p.slug, name: p.name, area: p.area ? AREAS[p.area].name : "Pune", price: formatPrice(p.priceFromLakh), image: h.image }] : []; });
  const areas = areaStats.filter((a) => a.count > 0);
  const names = Object.fromEntries(properties.map((p) => [p.slug, p.name]));
  const stats = [[String(properties.length), "projects compared"], [String(developers.length), "developers covered"], ["20,000+", "clients advised"], ["10,000+", "site visits arranged"]];
  return (
    <>
      <section className="hero-glow border-b border-line">
        <Container className="grid gap-12 pb-10 pt-10 md:pt-16 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Independent property advisory in Pune</Eyebrow>
            <h1 className="display mt-6">Find a property that makes sense for your future.</h1>
            <p className="lead mt-6 max-w-xl">We compare {properties.length} projects across {areas.length} Pune areas, arrange the site visit, and stay with you through the loan and the paperwork.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/properties">Explore properties <ArrowRight /></Link></Button>
              <LeadButton intent="advisor" size="lg" variant="secondary">Talk to an advisor</LeadButton>
            </div>
          </div>
          <HeroGallery slides={heroSlides} />
        </Container>
        <Container className="pb-14 md:pb-20"><HeroSearch areas={areas.map((a) => ({ key: a.key, name: a.name, count: a.count }))} /></Container>
      </section>

      <section aria-label="In numbers" className="border-b border-line bg-card">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
            {stats.map(([n, l]) => <div key={l} className="px-4 py-8 first:pl-0 sm:px-8"><dd className="tnum font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-none">{n}</dd><dt className="label mt-3">{l}</dt></div>)}
          </dl>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHead eyebrow="Featured" title="New launches and ready homes" intro="Current projects with a published price and a RERA number. Prices are starting prices as published and change with floor and unit." action={<Button asChild variant="secondary"><Link href="/properties">View all {properties.length} <ArrowRight /></Link></Button>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 70}><PropertyCard p={p} /></Reveal>)}</div>
        </Container>
      </section>

      <section className="border-y border-line bg-tint/50 py-20 md:py-28">
        <Container>
          <SectionHead eyebrow="Locations" title="Explore Pune by area" intro="Where the projects are, and what a home costs to start with in each area." action={<Button asChild variant="secondary"><Link href="/locations">All areas <ArrowRight /></Link></Button>} />
          <ul className="grid border-l border-t border-line-2 sm:grid-cols-2 lg:grid-cols-4">
            {areas.slice(0, 8).map((a) => (
              <li key={a.key} className="border-b border-r border-line-2 bg-card">
                <Link href={a.href} className="group flex h-full flex-col justify-between gap-12 p-6 transition-colors hover:bg-brand hover:text-paper">
                  <span className="tnum label group-hover:!text-paper/70">{a.lat?.toFixed(3)}° N  {a.lng?.toFixed(3)}° E</span>
                  <span>
                    <span className="flex items-start justify-between"><span className="h3">{a.name}</span><ArrowUpRight className="size-5 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden /></span>
                    <span className="small mt-1 block text-muted group-hover:text-paper/75">{a.count} projects · from {formatPrice(a.minLakh)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-4">Why Pune Property Investor</Eyebrow>
            <h2 className="h2">Advice that starts with your budget, not a brochure.</h2>
            <p className="lead mt-5">We do the comparing, the visiting and the paperwork chasing, so your decision rests on facts.</p>
            <Button asChild className="mt-7" variant="secondary"><Link href="/services">All services <ArrowRight /></Link></Button>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {SERVICES.map((s) => <li key={s.title} className="grid gap-1 py-5 md:grid-cols-[14rem_1fr] md:gap-8"><h3 className="h4">{s.title}</h3><p className="text-ink-2">{s.body}</p></li>)}
          </ul>
        </Container>
      </section>

      <section className="blueprint bg-night py-20 text-paper md:py-28">
        <Container>
          <SectionHead light eyebrow="How we work" title="From first call to keys, seven steps." />
          <ol className="grid border-l border-t border-paper/20 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => <li key={s.title} className="border-b border-r border-paper/20 p-6"><span className="tnum font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span><h3 className="h4 mt-6">{s.title}</h3><p className="mt-2 text-[0.9375rem] text-paper/70">{s.body}</p></li>)}
            <li className="grid content-between gap-6 border-b border-r border-paper/20 bg-paper/5 p-6"><p className="font-display text-2xl">Start with a call.</p><LeadButton intent="advisor" variant="light">Request a call back</LeadButton></li>
          </ol>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Investment intelligence</Eyebrow>
            <h2 className="h2">Read the market before you buy.</h2>
            <p className="lead mt-5">We look at the same six things on every project. No promised returns, just the evidence.</p>
            <ul className="mt-8 grid gap-3">{FACTORS.map((f) => <li key={f} className="flex items-center gap-3 border-b border-line pb-3 font-semibold"><span className="h-px w-5 bg-accent" aria-hidden />{f}</li>)}</ul>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.slice(0, 2).map((p) => <PostCard key={p.slug} post={p} />)}
            <div className="sm:col-span-2"><Link href="/blogs" className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">All insights <ArrowRight className="size-4" /></Link></div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-card py-20 md:py-24">
        <Container>
          <SectionHead eyebrow="Developers" title="Projects from the builders buyers ask about." action={<Button asChild variant="secondary"><Link href="/developers">All developers <ArrowRight /></Link></Button>} />
          <ul className="grid border-l border-t border-line-2 sm:grid-cols-3 lg:grid-cols-4">
            {developers.slice(0, 12).map((d) => <li key={d.slug} className="border-b border-r border-line-2"><Link href={`/developers/${d.slug}`} className="flex h-full items-baseline justify-between gap-3 p-5 transition-colors hover:bg-tint"><span className="font-display text-xl">{d.name}</span><span className="tnum small text-muted">{d.count}</span></Link></li>)}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHead eyebrow="Walkthroughs" title="See the project before you visit." action={<Button asChild variant="secondary"><Link href="/video-gallery-project-tours">All {videos.length} videos <ArrowRight /></Link></Button>} />
          <VideoLibrary videos={videos.slice(0, 3)} names={names} flat />
        </Container>
      </section>

      <section className="border-y border-line bg-tint/50 py-20 md:py-28">
        <Container>
          <SectionHead eyebrow="In their words" title="What clients and partners say." intro="Quoted as published on our current site." />
          <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => <li key={r.name} className="border-t border-ink pt-5"><blockquote className="text-[1.0625rem] leading-relaxed">“{r.text}”</blockquote><p className="mt-4 font-semibold">{r.name}</p><p className="label mt-0.5">{r.role}</p></li>)}
          </ul>
        </Container>
      </section>

      <section className="blueprint bg-night py-20 text-paper md:py-28">
        <Container className="text-center">
          <h2 className="display mx-auto max-w-4xl">Let’s find the right property for you.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <LeadButton intent="advisor" size="lg" variant="light">Book a consultation</LeadButton>
            <LeadButton intent="visit" size="lg" variant="outlineLight">Schedule a site visit</LeadButton>
            <Button asChild size="lg" variant="outlineLight"><a href={waLink()} target="_blank" rel="noopener">WhatsApp an advisor</a></Button>
          </div>
          <p className="mt-6 text-paper/70">Or call <a className="font-semibold underline underline-offset-4" href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a></p>
        </Container>
      </section>
    </>
  );
}
