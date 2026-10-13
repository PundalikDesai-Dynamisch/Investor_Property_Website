import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center md:py-32">
      <p className="label">404</p>
      <h1 className="h1 mt-4">We could not find that page.</h1>
      <p className="lead mx-auto mt-5 max-w-lg">It may have moved. Search our projects, or head back to the start.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/properties" className="inline-flex h-12 items-center rounded-sm bg-brand px-6 font-semibold text-paper">Browse properties</Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-sm border border-ink/30 px-6 font-semibold">Home</Link>
      </div>
    </Container>
  );
}
