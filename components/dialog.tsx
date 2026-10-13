"use client";
import * as D from "@radix-ui/react-dialog";
import * as A from "@radix-ui/react-accordion";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = D.Title;
export const DialogDescription = D.Description;

/** Centered modal, or a side sheet when side="right". Radix handles focus trap, Escape and aria. */
export function DialogContent({ className, children, side = "center", ...props }: D.DialogContentProps & { side?: "center" | "right" }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[80] bg-night/60 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_0.2s_ease-out]" />
      <D.Content
        className={cn(
          "fixed z-[90] bg-paper outline-none",
          side === "right"
            ? "inset-y-0 right-0 w-[min(92vw,420px)] overflow-y-auto data-[state=open]:animate-[slide-r_0.28s_cubic-bezier(0.2,0.7,0.2,1)]"
            : "left-1/2 top-1/2 max-h-[92dvh] w-[min(94vw,580px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg shadow-pop data-[state=open]:animate-[pop-in_0.22s_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
        <D.Close aria-label="Close" className="absolute right-3 top-3 grid size-9 place-items-center rounded-sm text-ink hover:bg-ink/5">
          <X className="size-5" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <A.Root type="single" collapsible className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <A.Item key={i} value={`q${i}`}>
          <A.Header>
            <A.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold hover:text-brand">
              {it.q}
              <Plus className="size-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.2s_ease-in] data-[state=open]:animate-[acc-down_0.25s_ease-out]">
            <p className="max-w-[68ch] pb-5 text-ink-2">{it.a}</p>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
