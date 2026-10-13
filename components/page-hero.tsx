import { Breadcrumbs, Container, Eyebrow } from "@/components/ui";

export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; crumbs?: { label: string; href?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line bg-tint/50">
      <Container className="py-12 md:py-20">
        {crumbs && <div className="mb-8"><Breadcrumbs items={crumbs} /></div>}
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="h1 max-w-4xl">{title}</h1>
        {intro && <p className="lead mt-5 max-w-2xl">{intro}</p>}
        {children}
      </Container>
    </section>
  );
}
