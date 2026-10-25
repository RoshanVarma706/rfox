import { cn } from "@/lib/utils";

/**
 * Rfox lockup: the circular fox mark plus the script wordmark, sized from the
 * height of the wrapping element so it drops into any bar without jumps.
 */
export function BrandLogo({ className, label = "Rfox" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex select-none items-center gap-[0.3em]", className)} role="img" aria-label={label}>
      <img src="/rfox-mark.svg" alt="" draggable={false} className="h-full w-auto shrink-0" />
      <img src="/rfox-wordmark.png" alt="" draggable={false} className="h-[76%] w-auto" />
    </span>
  );
}
