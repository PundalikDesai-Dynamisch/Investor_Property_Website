import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand text-paper hover:bg-brand-2",
        secondary: "border border-ink/30 text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-ink/5",
        light: "bg-paper text-brand hover:bg-white",
        outlineLight: "border border-paper/40 text-paper hover:bg-paper hover:text-brand",
        accent: "bg-accent text-ink hover:bg-accent/85",
      },
      size: { sm: "h-9 px-3.5 text-sm", md: "h-11 px-5 text-[0.9375rem]", lg: "h-[3.25rem] px-7 text-base" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10", className)} {...props} />;
}

export function Eyebrow({ children, className, light }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cn("label flex items-center gap-3", light && "text-paper/70", className)}>
      <span className="h-px w-8 bg-accent" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHead({ eyebrow, title, intro, action, light, className }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; action?: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 md:mb-14", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow light={light} className="mb-4">{eyebrow}</Eyebrow>}
        <h2 className={cn("h2", light && "text-paper")}>{title}</h2>
        {intro && <p className={cn("lead mt-4", light && "text-paper/75")}>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Tag({ children, tone = "paper" }: { children: React.ReactNode; tone?: "paper" | "night" | "accent" }) {
  return (
    <span className={cn("label inline-block rounded-xs px-2 py-1 !text-[0.625rem]", tone === "paper" && "bg-paper/95 !text-ink", tone === "night" && "bg-night !text-white", tone === "accent" && "bg-accent !text-ink")}>
      {children}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="small text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="hover:text-ink hover:underline">{it.label}</Link> : <span aria-current="page" className="text-ink">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
