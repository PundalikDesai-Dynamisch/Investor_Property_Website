"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/dialog";
import { Button, Container } from "@/components/ui";
import { LeadButton } from "@/components/lead/lead-provider";
import { ThemeToggle } from "./theme-toggle";
import { NAV, SITE, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", light ? "text-paper" : "text-brand")}>
      <svg viewBox="0 0 28 28" className="size-8" aria-hidden>
        <rect x="3" y="11" width="6" height="14" fill="currentColor" />
        <rect x="11" y="3" width="6" height="22" fill="currentColor" />
        <rect x="19" y="15" width="6" height="10" fill="currentColor" />
        <rect x="1" y="26" width="26" height="1.6" fill="var(--color-accent)" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.3rem] font-medium tracking-tight">Pune Property Investor</span>
        <span className={cn("label mt-1 block !text-[0.625rem]", light && "!text-paper/70")}>Real estate advisory</span>
      </span>
    </span>
  );
}

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[100] focus:rounded-sm focus:bg-brand focus:px-4 focus:py-2 focus:text-paper">Skip to content</a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Pune Property Investor, home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                className={cn("relative rounded-sm px-3.5 py-2 text-[0.9375rem] font-semibold text-ink-2 transition-colors hover:text-ink", active && "text-ink after:absolute after:inset-x-3.5 after:-bottom-px after:h-0.5 after:bg-accent")}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={`tel:${SITE.phone}`} className="hidden items-center gap-2 px-3 text-sm font-semibold text-ink-2 hover:text-ink xl:flex"><Phone className="size-4" aria-hidden />{SITE.phoneLabel}</a>
          <LeadButton intent="advisor" size="md" className="hidden sm:inline-flex">Book a consultation</LeadButton>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="md" className="lg:hidden" aria-label="Open menu"><Menu className="!size-6" /></Button>
            </DialogTrigger>
            <DialogContent side="right">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <div className="flex min-h-full flex-col p-6 pt-16">
                <nav aria-label="Mobile" className="grid">
                  {[{ label: "Home", href: "/" }, ...NAV, { label: "Contact", href: "/contact-us" }].map((n) => (
                    <DialogClose asChild key={n.href}>
                      <Link href={n.href} className="border-b border-line py-4 font-display text-2xl">{n.label}</Link>
                    </DialogClose>
                  ))}
                </nav>
                <div className="mt-8 grid gap-3">
                  <LeadButton intent="advisor" size="lg">Book a consultation</LeadButton>
                  <Button asChild variant="secondary" size="lg"><a href={`tel:${SITE.phone}`}><Phone /> {SITE.phoneLabel}</a></Button>
                  <Button asChild variant="secondary" size="lg"><a href={waLink()} target="_blank" rel="noopener">WhatsApp an advisor</a></Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}
