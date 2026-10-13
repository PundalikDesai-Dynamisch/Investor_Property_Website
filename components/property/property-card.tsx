"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Scale } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { useLead } from "@/components/lead/lead-provider";
import { useIdList } from "@/lib/store";
import { AREAS } from "@/lib/areas";
import { bhkLabel, carpetLabel, cn, formatPrice } from "@/lib/utils";
import type { PropertyCardData } from "@/lib/types";

export function PropertyCard({ p, priority }: { p: PropertyCardData; priority?: boolean }) {
  const saved = useIdList("ppi:saved");
  const compare = useIdList("ppi:compare", 4);
  const { open } = useLead();
  const area = p.area ? AREAS[p.area].name : "Pune";
  const isSaved = saved.has(p.slug);
  const isCompared = compare.has(p.slug);
  const carpet = carpetLabel(p.carpetMin, p.carpetMax);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-card transition-shadow duration-300 hover:shadow-pop">
      <Link href={`/${p.slug}`} aria-label={`${p.name}, ${area}`} className="relative block aspect-[4/3] overflow-hidden bg-wash">
        {p.cover ? (
          <Image src={p.cover} alt="" fill priority={priority} sizes="(min-width:1280px) 420px, (min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
        ) : (
          <span className="label absolute inset-0 grid place-items-center">Photos coming soon</span>
        )}
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.status === "new_launch" && <Tag tone="accent">New launch</Tag>}
          {p.status === "ready" && <Tag>Ready to move</Tag>}
        </span>
      </Link>
      <button type="button" aria-pressed={isSaved} aria-label={isSaved ? `Remove ${p.name} from saved` : `Save ${p.name}`} onClick={() => saved.toggle(p.slug)}
        className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-paper/95 text-ink shadow-sm transition-colors hover:bg-card">
        <Heart className={cn("size-[1.05rem]", isSaved && "fill-err text-err")} aria-hidden />
      </button>
      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
        <div>
          <p className="label">{area}{p.developer ? ` · ${p.developer}` : ""}</p>
          <h3 className="h3 mt-1.5"><Link href={`/${p.slug}`} className="underline-offset-4 hover:underline">{p.name}</Link></h3>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3.5 text-[0.875rem]">
          <div><dt className="label">Configuration</dt><dd className="tnum mt-0.5 font-semibold">{bhkLabel(p.bhk) || "To be confirmed"}</dd></div>
          <div><dt className="label">Carpet area</dt><dd className="tnum mt-0.5 font-semibold">{carpet || "To be confirmed"}</dd></div>
          <div><dt className="label">Possession</dt><dd className="mt-0.5 font-semibold">{p.targetPossession ?? "To be confirmed"}</dd></div>
          <div><dt className="label">RERA</dt><dd className="mt-0.5 flex items-center gap-1 font-semibold">{p.rera ? <><Check className="size-4 text-ok" aria-hidden />Listed</> : "To be confirmed"}</dd></div>
        </dl>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3.5">
          <div>
            <p className="label">Starting from</p>
            <p className="tnum font-display text-[1.65rem] leading-none">{formatPrice(p.priceFromLakh)}{p.priceFromLakh != null && <span className="text-muted">*</span>}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-pressed={isCompared} onClick={() => compare.toggle(p.slug)}
              className={cn("flex h-9 items-center gap-1.5 rounded-sm border px-2.5 text-[0.8125rem] font-semibold transition-colors", isCompared ? "border-brand bg-brand text-paper" : "border-line-2 hover:border-ink")}>
              <Scale className="size-3.5" aria-hidden />{isCompared ? "Added" : "Compare"}
            </button>
            <Button size="sm" variant="secondary" onClick={() => open("price", { slug: p.slug, name: p.name })}>Get details</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
