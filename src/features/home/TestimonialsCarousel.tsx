import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTestimonials } from "@/features/testimonials/api";

// Shown only when the real testimonials haven't loaded yet (offline, slow
// connection, or nothing published in Supabase yet) — this section should
// never render empty. Real testimonials always take priority the moment
// they're available.
const FALLBACK_TESTIMONIAL = {
  id: "fallback",
  rating: 5,
  quote: "KPDS understood exactly what we wanted before we could explain it properly. The Haldi photos alone made us cry — in a good way.",
  author_name: "Ananya & Rohit",
  author_role: "Wedding Photography",
  avatar_url: null as string | null,
};

/** Single-testimonial carousel with prev/next + "01/03" pagination. */
export function TestimonialsCarousel() {
  const { data } = useTestimonials();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const testimonials = data && data.length > 0 ? data : [FALLBACK_TESTIMONIAL];
  const active = testimonials[index] ?? testimonials[0];

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-space content-wrap">
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex gap-1 text-coral">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < (active.rating ?? 5)} />
              ))}
            </div>
            <blockquote className="mt-5 font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
              &ldquo;{active.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              {active.avatar_url ? (
                <img src={active.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-sm font-medium text-white">
                  {active.author_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-ink">{active.author_name}</p>
                {active.author_role && <p className="text-xs text-muted">{active.author_role}</p>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center gap-3 border-t border-line pt-6 text-sm text-muted">
            <span>
              {String(index + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-coral hover:text-coral"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-coral hover:text-coral"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="m12 2.5 2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7Z" strokeLinejoin="round" />
    </svg>
  );
}
