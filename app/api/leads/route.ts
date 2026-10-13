import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { leadSchema } from "@/lib/lead-schema";

const body = leadSchema.extend({
  intent: z.enum(["price", "brochure", "visit", "advisor"]),
  property: z.string().optional(),
  propertyName: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Receives enquiries. Set LEAD_WEBHOOK_URL (CRM, Google Sheet, WhatsApp automation) in production.
 * Without it, leads are appended to data/leads.ndjson, which only works on a writable disk.
 */
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { company, ...lead } = parsed.data;
  if (company) return NextResponse.json({ ok: true }); // honeypot filled: pretend success, store nothing
  const record = { ...lead, receivedAt: new Date().toISOString() };
  const hook = process.env.LEAD_WEBHOOK_URL;
  try {
    if (hook) {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(record) + "\n");
    }
  } catch (e) {
    console.error("lead delivery failed", e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
