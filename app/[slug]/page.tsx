import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PropertyPage } from "@/components/property/property-page";
import { AreaPage } from "@/components/location/area-page";
import { ArticlePage } from "@/components/blog/article";
import { AREAS, areaKeys } from "@/lib/areas";
import { areaFromHubSlug, bySlug, legacyPages, postBySlug, posts, properties, areaStats } from "@/lib/data";
import { formatPriceRange } from "@/lib/utils";

/**
 * Root-level slugs are kept on purpose: project, article, area-hub and legacy pages already rank at /{slug}/.
 * Static routes (about-us, contact-us, ...) take precedence over this segment.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...properties.map((p) => ({ slug: p.slug })),
    ...posts.map((p) => ({ slug: p.slug })),
    ...areaKeys.filter((k) => AREAS[k].legacy).map((k) => ({ slug: `2-bhk-flats-in-${k}` })),
    ...Object.keys(legacyPages).map((slug) => ({ slug })),
  ];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `/${slug}/`;
  const p = bySlug.get(slug);
  if (p) {
    const description = p.description || `${p.name}${p.developer ? ` by ${p.developer}` : ""}: prices, floor plans, RERA details and site visits.`;
    return { title: { absolute: p.metaTitle }, description: description.slice(0, 200), alternates: { canonical }, openGraph: { title: p.metaTitle, description: description.slice(0, 200), url: canonical, images: p.cover ? [p.cover] : undefined } };
  }
  const post = postBySlug.get(slug);
  if (post) return { title: { absolute: post.metaTitle }, description: post.excerpt, alternates: { canonical }, openGraph: { type: "article", title: post.title, description: post.excerpt, images: post.cover ? [post.cover] : undefined, publishedTime: post.date } };
  const area = areaFromHubSlug(slug);
  if (area) {
    const s = areaStats.find((a) => a.key === area)!;
    return { title: { absolute: `Flats in ${AREAS[area].name}, Pune | ${s.count} Projects, ${formatPriceRange(s.minLakh, s.maxLakh)} | Pune Property Investor` }, description: `Compare ${s.count} residential projects in ${AREAS[area].name}, Pune: 2, 3 and 4 BHK flats with prices, floor plans, RERA details and site visits.`, alternates: { canonical } };
  }
  const page = legacyPages[slug];
  if (page) return { title: { absolute: page.metaTitle }, description: page.description || undefined, alternates: { canonical } };
  return {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const p = bySlug.get(slug);
  if (p) return <PropertyPage p={p} />;
  const post = postBySlug.get(slug);
  if (post) return <ArticlePage post={post} />;
  const area = areaFromHubSlug(slug);
  if (area) return <AreaPage k={area} />;
  const page = legacyPages[slug];
  if (!page) notFound();
  return (
    <Container className="max-w-[56rem] py-14 md:py-20">
      <h1 className="h1 mb-10">{page.title}</h1>
      <div className="prose-ppi sans" dangerouslySetInnerHTML={{ __html: page.html }} />
    </Container>
  );
}
