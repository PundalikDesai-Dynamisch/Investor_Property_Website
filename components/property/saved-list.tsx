"use client";
import Link from "next/link";
import { PropertyCard } from "./property-card";
import { useIdList } from "@/lib/store";
import type { PropertyCardData } from "@/lib/types";

export function SavedList({ all }: { all: PropertyCardData[] }) {
  const { ids } = useIdList("ppi:saved");
  const items = all.filter((p) => ids.includes(p.slug));
  if (!items.length) return <div className="rounded-md border border-dashed border-line-2 p-10 text-center"><p className="h3">Nothing saved yet.</p><p className="mt-2 text-ink-2">Tap the heart on any property to keep it here.</p><Link href="/properties" className="mt-5 inline-flex h-11 items-center rounded-sm bg-brand px-5 font-semibold text-paper">Browse properties</Link></div>;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PropertyCard key={p.slug} p={p} />)}</div>;
}
