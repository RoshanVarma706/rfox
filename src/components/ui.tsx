import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ink" | "outline" | "light" | "quiet";
type Size = "md" | "sm";

export function btn(variant: Variant = "primary", size: Size = "md", className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase leading-none tracking-[0.16em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40";
  const sizes: Record<Size, string> = {
    md: "px-7 py-4 text-[10.5px]",
    sm: "px-5 py-3 text-[10px]",
  };
  const variants: Record<Variant, string> = {
    primary: "bg-red text-white shadow-[0_16px_30px_-18px_rgba(229,24,42,0.9)] hover:bg-red-deep hover:shadow-[0_18px_36px_-16px_rgba(184,17,31,0.75)]",
    ink: "bg-ink text-cream hover:bg-char",
    outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
    light: "bg-cream text-ink hover:bg-sand",
    quiet: "bg-transparent text-ink hover:bg-ink/5",
  };
  return cn(base, sizes[size], variants[variant], className);
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[3px]", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={cn("h-3 w-3", step <= Math.round(value) ? "fill-red text-red" : "text-line")}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-label text-muted", className)}>
      <span className="h-px w-6 bg-red" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  action,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[clamp(30px,4.4vw,54px)] leading-[1.04]">{title}</h2>
        {copy && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="flex w-max animate-marquee items-center">
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center whitespace-nowrap">
            <span className="px-7 text-[10.5px] font-semibold uppercase tracking-label">{item}</span>
            <span className="h-1 w-1 rounded-full bg-red" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Chip({ children, tone = "sand" }: { children: ReactNode; tone?: "sand" | "red" | "ink" | "light" }) {
  const tones = {
    sand: "bg-sand text-ink",
    red: "bg-red text-white",
    ink: "bg-ink text-cream",
    light: "border border-line bg-cream/90 text-ink backdrop-blur",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
