"use client";
import { MessageCircle, Phone, Send } from "lucide-react";
import { useLead } from "@/components/lead/lead-provider";
import { SITE, waLink } from "@/lib/site";

const item = "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[0.75rem] font-semibold";

/** Sticky Call / WhatsApp / Enquire bar for phones. Body padding in globals.css keeps content clear of it. */
export function MobileBar() {
  const { open } = useLead();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line-2 bg-paper pb-[env(safe-area-inset-bottom)] md:hidden">
      <a href={`tel:${SITE.phone}`} className={item}><Phone className="size-5" aria-hidden />Call</a>
      <a href={waLink()} target="_blank" rel="noopener" className={`${item} border-x border-line`}><MessageCircle className="size-5" aria-hidden />WhatsApp</a>
      <button type="button" onClick={() => open("advisor")} className={`${item} bg-brand text-paper`}><Send className="size-5" aria-hidden />Enquire</button>
    </div>
  );
}
