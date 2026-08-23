const ITEMS = ["KPDS Special", "20% Off Wedding Packages", "Personalized Gift Week — 30% Off", "This Week"];

/**
 * Continuous offer ticker. Duplicated content + a CSS keyframe sliding
 * exactly -50% is the standard seamless-marquee trick — the two copies
 * line up perfectly at the loop point. Paused under prefers-reduced-motion
 * via the .marquee-track rule in index.css.
 */
export function MarqueeTicker() {
  return (
    <div className="overflow-hidden border-y border-line/20 bg-espresso py-3.5">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.08em] text-white">
            {item}
            <SparkleIcon />
          </span>
        ))}
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-coral">
      <path d="M12 2 13.8 9.2 21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8Z" />
    </svg>
  );
}
