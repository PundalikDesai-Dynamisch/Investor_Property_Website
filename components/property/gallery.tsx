"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/dialog";
import { cn } from "@/lib/utils";

/** Photo grid with a keyboard-friendly lightbox. variant="plans" shows drawings uncropped. */
export function Gallery({ images, name, variant = "photos", max = 5 }: { images: string[]; name: string; variant?: "photos" | "plans"; max?: number }) {
  const [at, setAt] = useState<number | null>(null);
  const plans = variant === "plans";
  const shown = plans ? images : images.slice(0, max);
  const go = (d: number) => setAt((i) => (i === null ? i : (i + d + images.length) % images.length));
  return (
    <>
      <div className={cn("grid gap-2", plans ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-4 grid-rows-2 [&>*:first-child]:col-span-2 [&>*:first-child]:row-span-2")}>
        {shown.map((src, i) => (
          <button key={src} type="button" onClick={() => setAt(i)} aria-label={`Open ${plans ? "floor plan" : "photo"} ${i + 1} of ${images.length}`}
            className={cn("group relative overflow-hidden rounded-sm bg-wash", plans ? "aspect-[4/3] border border-line bg-card" : "min-h-28")}>
            <Image src={src} alt={`${name} ${plans ? "floor plan" : "photo"} ${i + 1}`} fill quality={i === 0 && !plans ? 90 : 75} sizes={plans ? "(min-width:1024px) 280px, 45vw" : i === 0 ? "(min-width:1024px) 600px, 100vw" : "25vw"}
              className={cn("transition-transform duration-500 group-hover:scale-[1.03]", plans ? "object-contain p-2" : "object-cover")} />
            {!plans && i === shown.length - 1 && images.length > shown.length && (
              <span className="absolute inset-0 grid place-items-center bg-night/55 text-sm font-semibold text-paper"><Expand className="mr-2 size-4" />+{images.length - shown.length} more</span>
            )}
          </button>
        ))}
      </div>
      <Dialog open={at !== null} onOpenChange={(o) => !o && setAt(null)}>
        <DialogContent className="!inset-0 !left-0 !top-0 !h-dvh !max-h-none !w-screen !translate-x-0 !translate-y-0 !rounded-none !bg-night" onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
          <DialogTitle className="sr-only">{name} gallery</DialogTitle>
          {at !== null && (
            <div className="relative size-full">
              <Image src={images[at]} alt={`${name} ${plans ? "floor plan" : "photo"} ${at + 1}`} fill sizes="100vw" className="object-contain p-4 sm:p-12" priority />
              <p className="label absolute left-5 top-5 !text-paper/70">{at + 1} / {images.length}</p>
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink hover:bg-card"><ChevronLeft /></button>
                  <button type="button" onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink hover:bg-card"><ChevronRight /></button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
