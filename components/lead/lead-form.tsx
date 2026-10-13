"use client";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { leadSchema, type Lead } from "@/lib/lead-schema";
import { AREAS, BUDGETS, areaKeys } from "@/lib/areas";
import { CONSENT, waLink } from "@/lib/site";
import type { Intent, PropertyRef } from "@/lib/types";
import { cn } from "@/lib/utils";

export const LEAD_COPY: Record<Intent, { title: string; cta: string; blurb: string }> = {
  price: { title: "Get price details", cta: "Send me the price details", blurb: "Share your details and an advisor will send current prices and availability." },
  brochure: { title: "Download the brochure", cta: "Get the brochure", blurb: "Tell us where to reach you. The brochure link appears right after you submit." },
  visit: { title: "Schedule a site visit", cta: "Request a visit", blurb: "Pick what suits you and we will confirm a time by phone." },
  advisor: { title: "Talk to an advisor", cta: "Request a call back", blurb: "An advisor will call you back, usually within a few working hours." },
};

const field = "h-11 w-full rounded-sm border border-line-2 bg-card px-3 text-[0.9375rem] outline-none transition-colors focus:border-brand aria-[invalid=true]:border-err";

export function LeadForm({ intent, property, compact, className }: { intent: Intent; property?: PropertyRef; compact?: boolean; className?: string }) {
  const id = useId();
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [first, setFirst] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<Lead>({ resolver: zodResolver(leadSchema), defaultValues: { consent: false } });
  const copy = LEAD_COPY[intent];

  async function onSubmit(values: Lead) {
    setPhase("sending");
    try {
      const res = await fetch("/api/leads/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, intent, property: property?.slug, propertyName: property?.name, source: window.location.pathname }),
      });
      if (!res.ok) throw new Error();
      setFirst(values.name.split(" ")[0]);
      setPhase("done");
    } catch { setPhase("error"); }
  }

  if (phase === "done") {
    return (
      <div role="status" className={cn("rounded-md border border-line bg-card p-6", className)}>
        <CheckCircle2 className="size-8 text-ok" aria-hidden />
        <p className="h3 mt-3">Thank you, {first}.</p>
        <p className="mt-2 text-ink-2">An advisor will call you shortly. You can also message us on WhatsApp right now.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {intent === "brochure" && property?.brochure && (
            <Button asChild><a href={property.brochure} target="_blank" rel="noopener"><Download /> Download brochure (PDF)</a></Button>
          )}
          <Button asChild variant="secondary"><a href={waLink(property ? `Hi, I just enquired about ${property.name}.` : undefined)} target="_blank" rel="noopener"><MessageCircle /> WhatsApp an advisor</a></Button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Lead) => errors[k]?.message as string | undefined;
  const fid = (k: string) => `${id}-${k}`;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("grid gap-4", className)}>
      <div className="hidden" aria-hidden><label>Company<input tabIndex={-1} autoComplete="off" {...register("company")} /></label></div>
      <div>
        <label htmlFor={fid("name")} className="label mb-1.5 block">Name</label>
        <input id={fid("name")} autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={err("name") ? fid("name-e") : undefined} {...register("name")} />
        {err("name") && <p id={fid("name-e")} className="small mt-1 text-err">{err("name")}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("mobile")} className="label mb-1.5 block">Mobile</label>
          <div className="flex">
            <span className="grid h-11 place-items-center rounded-l-sm border border-r-0 border-line-2 bg-wash px-3 text-sm font-semibold">+91</span>
            <input id={fid("mobile")} type="tel" inputMode="numeric" autoComplete="tel-national" className={cn(field, "rounded-l-none")} aria-invalid={!!errors.mobile} aria-describedby={err("mobile") ? fid("mobile-e") : undefined} {...register("mobile")} />
          </div>
          {err("mobile") && <p id={fid("mobile-e")} className="small mt-1 text-err">{err("mobile")}</p>}
        </div>
        <div>
          <label htmlFor={fid("email")} className="label mb-1.5 block">Email (optional)</label>
          <input id={fid("email")} type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} {...register("email")} />
          {err("email") && <p className="small mt-1 text-err">{err("email")}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={fid("area")} className="label mb-1.5 block">Area</label>
          <select id={fid("area")} className={field} {...register("area")}>
            <option value="">Not sure yet</option>
            {areaKeys.map((k) => <option key={k} value={AREAS[k].name}>{AREAS[k].name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={fid("budget")} className="label mb-1.5 block">Budget</label>
          <select id={fid("budget")} className={field} {...register("budget")}>
            <option value="">Flexible</option>
            {BUDGETS.map((b) => <option key={b.id} value={b.label}>{b.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={fid("config")} className="label mb-1.5 block">Configuration</label>
          <select id={fid("config")} className={field} {...register("config")}>
            <option value="">Any</option>
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Commercial"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {!compact && (
        <div>
          <label htmlFor={fid("message")} className="label mb-1.5 block">Message (optional)</label>
          <textarea id={fid("message")} rows={3} className={cn(field, "h-auto py-2.5")} {...register("message")} />
        </div>
      )}
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-snug text-ink-2">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-brand" aria-invalid={!!errors.consent} {...register("consent")} />
          <span>{CONSENT}</span>
        </label>
        {err("consent") && <p className="small mt-1 text-err">{err("consent")}</p>}
      </div>
      {phase === "error" && <p role="alert" className="small text-err">That did not go through. Please try again or call us.</p>}
      <Button type="submit" size="lg" disabled={phase === "sending"}>{phase === "sending" ? "Sending…" : copy.cta}</Button>
    </form>
  );
}
