import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { Discovery } from "@/components/property/discovery";
import { StaticGrid } from "@/components/location/area-page";
import { cards, developers } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => developers.map((d) => ({ slug: d.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = developers.find((x) => x.slug === slug);
  if (!d) return {};
  return { title: `${d.name} Projects in Pune`, description: `${d.count} ${d.name} project${d.count > 1 ? "s" : ""} in Pune with prices, floor plans and RERA details.`, alternates: { canonical: `/developers/${slug}/` } };
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params;
  const d = developers.find((x) => x.slug === slug);
  if (!d) notFound();
  const items = cards.filter((c) => c.developerSlug === slug);
  return (
    <>
      <PageHero eyebrow="Developer" title={`${d.name} projects in Pune`} intro={`${d.count} project${d.count > 1 ? "s" : ""} on our list.`} crumbs={[{ label: "Home", href: "/" }, { label: "Developers", href: "/developers" }, { label: d.name }]} />
      <Container className="py-12 md:py-16">
        <Suspense fallback={<StaticGrid items={items} />}><Discovery items={items} developers={[d]} lockedDeveloper={slug} /></Suspense>
      </Container>
    </>
  );
}
