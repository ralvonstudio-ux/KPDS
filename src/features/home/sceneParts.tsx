import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  cta,
  ctaTo,
  light,
}: {
  eyebrow: string;
  title: string;
  cta?: string;
  ctaTo?: string;
  light?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={cn("text-eyebrow uppercase tracking-[0.12em]", light ? "text-gold-soft" : "text-gold")}>{eyebrow}</p>
        <h2 className={cn("mt-2 text-display-lg uppercase", light ? "text-white" : "text-ink")}>{title}</h2>
      </div>
      {cta && ctaTo && (
        <Link
          to={ctaTo}
          data-cursor="View"
          className={cn(
            "text-sm font-medium underline underline-offset-4 transition-colors",
            light ? "text-white/80 hover:text-white" : "text-ink hover:text-gold",
          )}
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

export function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
