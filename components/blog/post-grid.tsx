"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";
import type { PostLite } from "@/lib/types";

export function PostGrid({ posts }: { posts: PostLite[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const shown = useMemo(() => posts.filter((p) => (cat === "All" || p.category === cat) && `${p.title} ${p.excerpt} ${p.locations.join(" ")}`.toLowerCase().includes(q.toLowerCase())), [posts, cat, q]);
  const [first, ...rest] = shown;
  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("rounded-sm border px-3 py-1.5 text-[0.8125rem] font-semibold", cat === c ? "border-brand bg-brand text-paper" : "border-line-2 hover:border-ink")}>{c}</button>)}
        </div>
        <div className="relative w-full sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden /><input type="search" aria-label="Search articles" placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 w-full rounded-sm border border-line-2 bg-card pl-9 pr-3 text-sm outline-none focus:border-brand" /></div>
      </div>
      {!first ? <p className="py-16 text-center text-ink-2">No articles match. Try another category or search term.</p> : (
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          <div className="md:col-span-2"><PostCard post={first} large /></div>
          {rest.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      )}
    </>
  );
}
