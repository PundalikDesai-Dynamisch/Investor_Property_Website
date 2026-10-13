import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { VideoLibrary } from "@/components/media/youtube";
import { properties, videos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pune Project Tours: Video Walkthroughs by Area",
  description: "Watch walkthroughs of Pune residential projects in Kharadi, Dhanori, Lohegaon, Mundhwa, Wagholi and more.",
  alternates: { canonical: "/video-gallery-project-tours/" },
};

export default function VideosPage() {
  const names = Object.fromEntries(properties.map((p) => [p.slug, p.name]));
  return (
    <>
      <PageHero eyebrow="Walkthroughs" title="Tour the project from your sofa." intro={`${videos.length} project videos, grouped by area. Where we have the project page, the player links to it.`} crumbs={[{ label: "Home", href: "/" }, { label: "Videos" }]} />
      <Container className="py-14 md:py-20"><VideoLibrary videos={videos} names={names} /></Container>
    </>
  );
}
