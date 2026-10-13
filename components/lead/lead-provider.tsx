"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/dialog";
import { LeadForm, LEAD_COPY } from "./lead-form";
import { Button } from "@/components/ui";
import type { Intent, PropertyRef } from "@/lib/types";

type Ctx = { open: (intent?: Intent, property?: PropertyRef) => void };
const LeadContext = createContext<Ctx>({ open: () => {} });
export const useLead = () => useContext(LeadContext);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ intent: Intent; property?: PropertyRef } | null>(null);
  const open = useCallback((intent: Intent = "advisor", property?: PropertyRef) => setState({ intent, property }), []);
  const value = useMemo(() => ({ open }), [open]);
  const copy = state ? LEAD_COPY[state.intent] : null;
  return (
    <LeadContext.Provider value={value}>
      {children}
      <Dialog open={!!state} onOpenChange={(o) => !o && setState(null)}>
        <DialogContent>
          {state && copy && (
            <div className="p-6 sm:p-8">
              <p className="label">{state.property?.name ?? "Pune Property Investor"}</p>
              <DialogTitle className="h2 mt-2">{copy.title}</DialogTitle>
              <DialogDescription className="mb-6 mt-2 text-ink-2">{copy.blurb}</DialogDescription>
              <LeadForm intent={state.intent} property={state.property} compact />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </LeadContext.Provider>
  );
}

/** Button that opens the enquiry dialog with a given intent. */
export function LeadButton({ intent = "advisor", property, children, ...props }: { intent?: Intent; property?: PropertyRef; children: React.ReactNode } & Omit<React.ComponentProps<typeof Button>, "onClick" | "property" | "children">) {
  const { open } = useLead();
  return <Button type="button" onClick={() => open(intent, property)} {...props}>{children}</Button>;
}
