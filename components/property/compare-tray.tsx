"use client";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useIdList } from "@/lib/store";

export function CompareTray() {
  const { ids, clear } = useIdList("ppi:compare", 4);
  if (ids.length === 0) return null;
  return (
    <div role="region" aria-label="Compare tray" className="fixed inset-x-3 bottom-[4.6rem] z-30 flex items-center justify-between gap-3 rounded-md bg-night px-4 py-3 text-paper shadow-pop md:inset-x-auto md:bottom-6 md:right-6 md:w-[22rem]">
      <p className="flex items-center gap-2 text-sm font-semibold"><Scale className="size-4" aria-hidden />{ids.length} of 4 selected</p>
      <div className="flex items-center gap-2">
        <Link href={`/compare?ids=${ids.join(",")}`} className={`rounded-sm bg-paper px-3.5 py-2 text-sm font-semibold text-brand ${ids.length < 2 ? "pointer-events-none opacity-50" : ""}`} aria-disabled={ids.length < 2}>Compare</Link>
        <button type="button" onClick={clear} aria-label="Clear compare list" className="grid size-8 place-items-center rounded-sm hover:bg-paper/15"><X className="size-4" /></button>
      </div>
    </div>
  );
}
