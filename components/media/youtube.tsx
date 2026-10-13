"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/dialog";
import type { Video } from "@/lib/types";

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const PlayDot = () => <span className="grid size-16 place-items-center rounded-full bg-paper text-brand shadow-pop transition-transform group-hover:scale-105"><Play className="size-7 translate-x-0.5 fill-current" aria-hidden /></span>;

/** Loads the YouTube player only after a click, so the page stays fast. */
export function YouTube({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-night">
      {on ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Play video: ${title}`} className="group absolute inset-0 w-full">
          <Image src={thumb(id)} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-0 grid place-items-center"><PlayDot /></span>
        </button>
      )}
    </div>
  );
}

/** Grid of video cards that open in a modal, grouped by area. */
export function VideoLibrary({ videos, names, flat }: { videos: Video[]; names: Record<string, string>; flat?: boolean }) {
  const [cur, setCur] = useState<Video | null>(null);
  const groups = flat ? [""] : [...new Set(videos.map((v) => v.group))];
  return (
    <>
      {groups.map((g) => (
        <section key={g} className={flat ? "" : "mb-14"} aria-labelledby={flat ? undefined : `g-${g}`}>
          {!flat && <h2 id={`g-${g}`} className="h3 mb-5 border-b border-line pb-3">{g} <span className="small font-sans font-normal text-muted">{videos.filter((v) => v.group === g).length} videos</span></h2>}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.filter((v) => flat || v.group === g).map((v) => (
              <li key={v.id}>
                <button type="button" onClick={() => setCur(v)} className="group block w-full text-left">
                  <span className="relative block aspect-video overflow-hidden rounded-md bg-wash">
                    <Image src={thumb(v.id)} alt="" fill sizes="(min-width:1024px) 400px, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute inset-0 grid place-items-center bg-night/10 group-hover:bg-night/0"><PlayDot /></span>
                    {v.duration && <span className="tnum absolute bottom-2 right-2 rounded-xs bg-night/80 px-1.5 py-0.5 text-xs font-semibold text-paper">{v.duration}</span>}
                  </span>
                  <span className="mt-3 block font-display text-[1.15rem] leading-snug group-hover:underline underline-offset-4">{v.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Dialog open={!!cur} onOpenChange={(o) => !o && setCur(null)}>
        <DialogContent className="!w-[min(96vw,980px)] bg-night p-0 text-paper">
          {cur && (
            <div>
              <DialogTitle className="sr-only">{cur.title}</DialogTitle>
              <div className="relative aspect-video"><iframe src={`https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0`} title={cur.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 size-full" /></div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="font-display text-xl">{cur.title}</p>
                {cur.project && names[cur.project] && <Link href={`/${cur.project}`} className="rounded-sm bg-paper px-4 py-2 text-sm font-semibold text-brand">View {names[cur.project]}</Link>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
