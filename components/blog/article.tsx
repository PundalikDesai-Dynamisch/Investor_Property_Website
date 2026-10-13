import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Container } from "@/components/ui";
import { LeadButton } from "@/components/lead/lead-provider";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "./post-card";
import { areaStats, posts } from "@/lib/data";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function ArticlePage({ post }: { post: Post }) {
  const related = posts.filter((p) => p.slug !== post.slug).sort((a) => (a.category === post.category ? -1 : 1)).slice(0, 3);
  const areas = areaStats.filter((a) => post.locations.some((l) => l.toLowerCase() === a.name.toLowerCase()));
  return (
    <>
      <Container className="pt-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/blogs" }, { label: post.title }]} /></Container>
      <article>
        <Container className="max-w-[56rem] pb-10 pt-10">
          <p className="label">{post.category}</p>
          <h1 className="h1 mt-4">{post.title}</h1>
          <p className="small mt-5 flex flex-wrap gap-x-4 text-muted"><span>By the Pune Property Investor team</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingMinutes} min read</span></p>
          {post.cover && <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-md bg-wash"><Image src={post.cover} alt="" fill priority sizes="(min-width:1024px) 900px, 100vw" className="object-cover" /></div>}
        </Container>
        <Container className="max-w-[56rem] pb-16"><div className="prose-ppi" dangerouslySetInnerHTML={{ __html: post.html }} /></Container>
      </article>
      <section className="blueprint bg-night text-paper">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="h2">Turn the reading into a shortlist.</h2>
            <p className="mt-3 text-paper/75">{areas.length ? `Browse current projects in ${areas.map((a) => a.name).join(" and ")}, or talk to an advisor.` : "Browse current projects or talk to an advisor about your budget."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {areas.map((a) => <Link key={a.key} href={a.href} className="inline-flex h-11 items-center rounded-sm border border-paper/40 px-5 text-[0.9375rem] font-semibold hover:bg-paper hover:text-brand">Flats in {a.name}</Link>)}
            <LeadButton intent="advisor" variant="light">Talk to an advisor</LeadButton>
          </div>
        </Container>
      </section>
      <Container className="py-16">
        <h2 className="h3 mb-8">Keep reading</h2>
        <div className="grid gap-8 md:grid-cols-3">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
      </Container>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, datePublished: post.date, image: post.cover, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name }, mainEntityOfPage: `${SITE.url}/${post.slug}/` }} />
    </>
  );
}
