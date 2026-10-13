import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { PostGrid } from "@/components/blog/post-grid";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pune Real Estate Insights: Area Guides and Market Analysis",
  description: "Area comparisons, investment hotspots and market notes for Pune home buyers and investors.",
  alternates: { canonical: "/blogs/" },
};

export default function BlogsPage() {
  const lite = posts.map(({ html, metaTitle, ...rest }) => rest);
  return (
    <>
      <PageHero eyebrow="Insights" title="Reading before buying." intro="Area comparisons and market notes written for Pune buyers." crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
      <Container className="py-12 md:py-16"><PostGrid posts={lite} /></Container>
    </>
  );
}
