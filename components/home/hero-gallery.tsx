"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = { slug: string; name: string; area: string; price: string; image: string };

/** Cross-fading gallery of featured projects. Sources are 1.6k to 3.8k px wide, so they stay sharp on retina screens.
 *  Only the first slide loads up front; the rest load once the page is idle. Pauses on hover and focus, and never auto-plays for reduced-motion users. */
export function HeroGallery({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!ready || hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [ready, hold, slides.length]);
  const s = slides[i];
  return (
    <div role="group" aria-roledescription="carousel" aria-label="Featured projects"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-wash">
        {slides.map((x, k) => (k === 0 || ready) && (
          <Image key={x.slug} src={x.image} alt="" fill priority={k === 0} quality={90} sizes="(min-width:1024px) 660px, 100vw"
            className={cn("object-cover transition-opacity duration-1000", k === i ? "opacity-100" : "opacity-0")} />
        ))}
        <Link href={`/${s.slug}`} aria-label={`View ${s.name}, ${s.area}`} className="absolute inset-0" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-sm" aria-live={hold ? "polite" : "off"}>
        <p className="min-w-0 truncate"><span className="label mr-3">Featured</span><span className="font-semibold">{s.name}</span><span className="text-muted"> · {s.area} · </span><span className="tnum text-muted">from {s.price}*</span></p>
        <Link href={`/${s.slug}`} className="flex shrink-0 items-center gap-1 font-semibold text-brand underline-offset-4 hover:underline">View <ArrowUpRight className="size-4" aria-hidden /></Link>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {slides.map((x, k) => (
          <button key={x.slug} type="button" onClick={() => setI(k)} aria-label={`Show ${x.name}`} aria-current={k === i}
            className={cn("relative aspect-[16/10] overflow-hidden rounded-sm bg-wash transition-opacity", k === i ? "ring-2 ring-brand ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100")}>
            {ready && <Image src={x.image} alt="" fill sizes="140px" className="object-cover" />}
          </button>
        ))}
      </div>
    </div>
  );
}
