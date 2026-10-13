"use client";
import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyCard } from "./property-card";
import { Button } from "@/components/ui";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/dialog";
import { LeadButton } from "@/components/lead/lead-provider";
import { AREAS, BUDGETS, STATUS_LABEL, areaKeys } from "@/lib/areas";
import { cn } from "@/lib/utils";
import type { AreaKey, PropertyCardData, Status } from "@/lib/types";

const PAGE = 24;
const BHK = ["1", "2", "3", "4"];
const SORTS = [["new", "Recently updated"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["name", "Name A to Z"]] as const;
type Dev = { slug: string; name: string; count: number };

const chip = (on: boolean) => cn("rounded-sm border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors", on ? "border-brand bg-brand text-paper" : "border-line-2 bg-card hover:border-ink");

export function Discovery({ items, developers, lockedArea, lockedDeveloper }: { items: PropertyCardData[]; developers: Dev[]; lockedArea?: AreaKey; lockedDeveloper?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const get = (k: string) => sp.get(k) ?? "";
  const list = (k: string) => (get(k) ? get(k).split(",") : []);
  const q = get("q"), budget = get("budget"), sort = get("sort") || "new", video = get("video") === "1";
  const areas = lockedArea ? [lockedArea] : list("area");
  const bhk = list("bhk"), status = list("status");
  const dev = lockedDeveloper ?? get("dev");

  const set = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    setShown(PAGE);
  }, [sp, router, pathname]);
  const toggle = (k: string, v: string) => { const cur = list(k); set({ [k]: (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]).join(",") || null }); };

  const filtered = useMemo(() => {
    const b = BUDGETS.find((x) => x.id === budget);
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const r = items.filter((p) => {
      if (terms.length) { const hay = `${p.name} ${p.developer ?? ""} ${p.area ? AREAS[p.area].name : ""}`.toLowerCase(); if (!terms.every((t) => hay.includes(t))) return false; }
      if (areas.length && (!p.area || !areas.includes(p.area))) return false;
      if (bhk.length && !p.bhk.some((x) => bhk.includes(String(Math.min(4, Math.floor(x)))))) return false;
      if (status.length && (!p.status || !status.includes(p.status))) return false;
      if (b && (p.priceFromLakh == null || p.priceFromLakh < b.min || p.priceFromLakh >= b.max)) return false;
      if (dev && p.developerSlug !== dev) return false;
      if (video && !p.video) return false;
      return true;
    });
    const price = (p: PropertyCardData, nil: number) => p.priceFromLakh ?? nil;
    if (sort === "price-asc") r.sort((a, c) => price(a, Infinity) - price(c, Infinity));
    if (sort === "price-desc") r.sort((a, c) => price(c, -1) - price(a, -1));
    if (sort === "name") r.sort((a, c) => a.name.localeCompare(c.name));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q, budget, sort, video, dev, sp.toString()]);

  const counts = useMemo(() => Object.fromEntries(areaKeys.map((k) => [k, items.filter((p) => p.area === k).length])), [items]);
  const active: { label: string; clear: () => void }[] = [
    ...(lockedArea ? [] : areas.map((a) => ({ label: AREAS[a as AreaKey]?.name ?? a, clear: () => toggle("area", a) }))),
    ...bhk.map((b) => ({ label: `${b === "4" ? "4+" : b} BHK`, clear: () => toggle("bhk", b) })),
    ...status.map((s) => ({ label: STATUS_LABEL[s as Status] ?? s, clear: () => toggle("status", s) })),
    ...(budget ? [{ label: BUDGETS.find((x) => x.id === budget)?.label ?? budget, clear: () => set({ budget: null }) }] : []),
    ...(!lockedDeveloper && dev ? [{ label: developers.find((d) => d.slug === dev)?.name ?? dev, clear: () => set({ dev: null }) }] : []),
    ...(video ? [{ label: "Has video", clear: () => set({ video: null }) }] : []),
  ];

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="border-t border-line py-5 first:border-0 first:pt-0"><legend className="label mb-3 float-left w-full">{title}</legend><div className="clear-both flex flex-wrap gap-2">{children}</div></fieldset>
  );
  const Panel = (
    <div>
      {!lockedArea && (
        <Group title="Area">
          {areaKeys.filter((k) => counts[k] > 0).sort((a, b) => counts[b] - counts[a]).map((k) => (
            <button key={k} type="button" aria-pressed={areas.includes(k)} onClick={() => toggle("area", k)} className={chip(areas.includes(k))}>{AREAS[k].name} <span className="opacity-60">{counts[k]}</span></button>
          ))}
        </Group>
      )}
      <Group title="Budget">
        {BUDGETS.map((b) => <button key={b.id} type="button" aria-pressed={budget === b.id} onClick={() => set({ budget: budget === b.id ? null : b.id })} className={chip(budget === b.id)}>{b.label}</button>)}
      </Group>
      <Group title="Configuration">
        {BHK.map((b) => <button key={b} type="button" aria-pressed={bhk.includes(b)} onClick={() => toggle("bhk", b)} className={chip(bhk.includes(b))}>{b === "4" ? "4+ BHK" : `${b} BHK`}</button>)}
      </Group>
      <Group title="Stage">
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <button key={s} type="button" aria-pressed={status.includes(s)} onClick={() => toggle("status", s)} className={chip(status.includes(s))}>{STATUS_LABEL[s]}</button>)}
      </Group>
      {!lockedDeveloper && (
        <fieldset className="border-t border-line py-5"><legend className="label mb-3 float-left w-full">Developer</legend>
          <select aria-label="Developer" value={dev} onChange={(e) => set({ dev: e.target.value || null })} className="clear-both h-10 w-full rounded-sm border border-line-2 bg-card px-3 text-sm">
            <option value="">All developers</option>
            {developers.map((d) => <option key={d.slug} value={d.slug}>{d.name} ({d.count})</option>)}
          </select>
        </fieldset>
      )}
      <label className="flex cursor-pointer items-center gap-3 border-t border-line pt-5 text-sm font-semibold">
        <input type="checkbox" className="size-4 accent-brand" checked={video} onChange={() => set({ video: video ? null : "1" })} />Has a video walkthrough
      </label>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Filters"><div className="sticky top-24">{Panel}</div></aside>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input type="search" aria-label="Search projects, developers or areas" placeholder="Search project, developer or area" defaultValue={q} onChange={(e) => set({ q: e.target.value || null })}
              className="h-11 w-full rounded-sm border border-line-2 bg-card pl-9 pr-3 text-[0.9375rem] outline-none focus:border-brand" />
          </div>
          <select aria-label="Sort by" value={sort} onChange={(e) => set({ sort: e.target.value === "new" ? null : e.target.value })} className="h-11 rounded-sm border border-line-2 bg-card px-3 text-sm font-semibold">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <Dialog>
            <DialogTrigger asChild><Button variant="secondary" className="lg:hidden"><SlidersHorizontal /> Filters{active.length ? ` (${active.length})` : ""}</Button></DialogTrigger>
            <DialogContent side="right"><div className="p-6 pt-14"><DialogTitle className="h3 mb-5">Filters</DialogTitle>{Panel}</div></DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-live="polite">
          <p className="small mr-2 font-semibold tnum">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p>
          {active.map((a) => <button key={a.label} type="button" onClick={a.clear} className="flex items-center gap-1.5 rounded-sm bg-tint px-2.5 py-1 text-[0.8125rem] font-semibold text-brand">{a.label}<X className="size-3.5" aria-label="Remove" /></button>)}
          {active.length > 0 && <button type="button" className="small underline underline-offset-4" onClick={() => router.replace(pathname, { scroll: false })}>Clear all</button>}
        </div>
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-md border border-dashed border-line-2 p-10 text-center">
            <p className="h3">Nothing matches these filters</p>
            <p className="mt-2 text-ink-2">Loosen a filter, or tell an advisor what you need and we will search the projects we have not listed here.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3"><Button variant="secondary" onClick={() => router.replace(pathname, { scroll: false })}>Clear filters</Button><LeadButton intent="advisor">Talk to an advisor</LeadButton></div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, shown).map((p, i) => <PropertyCard key={p.slug} p={p} priority={i < 3} />)}
            </div>
            {shown < filtered.length && (
              <div className="mt-10 text-center"><Button variant="secondary" size="lg" onClick={() => setShown((s) => s + PAGE)}>Show more ({filtered.length - shown} left)</Button></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
