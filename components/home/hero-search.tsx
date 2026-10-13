"use client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui";
import { BUDGETS } from "@/lib/areas";

const sel = "h-12 w-full appearance-none bg-card px-4 text-[0.9375rem] font-semibold outline-none focus:bg-tint/60";

export function HeroSearch({ areas }: { areas: { key: string; name: string; count: number }[] }) {
  const router = useRouter();
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const q = new URLSearchParams();
    for (const k of ["area", "budget", "bhk"]) { const v = String(f.get(k) ?? ""); if (v) q.set(k, v); }
    router.push(`/properties${q.size ? `?${q}` : ""}`);
  }
  return (
    <form onSubmit={submit} aria-label="Search properties" className="grid gap-px overflow-hidden rounded-md border border-line-2 bg-line-2 shadow-pop md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="block bg-card pt-3"><span className="label px-4">Area</span>
        <select name="area" className={sel} defaultValue=""><option value="">Anywhere in Pune</option>{areas.map((a) => <option key={a.key} value={a.key}>{a.name} ({a.count})</option>)}</select></label>
      <label className="block bg-card pt-3"><span className="label px-4">Budget</span>
        <select name="budget" className={sel} defaultValue=""><option value="">Any budget</option>{BUDGETS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}</select></label>
      <label className="block bg-card pt-3"><span className="label px-4">Configuration</span>
        <select name="bhk" className={sel} defaultValue=""><option value="">Any BHK</option>{["1", "2", "3", "4"].map((b) => <option key={b} value={b}>{b === "4" ? "4+ BHK" : `${b} BHK`}</option>)}</select></label>
      <Button type="submit" size="lg" className="h-auto min-h-14 rounded-none px-8"><Search /> Search</Button>
    </form>
  );
}
