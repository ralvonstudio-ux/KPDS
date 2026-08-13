import { motion } from "framer-motion";
import { useTestimonials } from "@/features/testimonials/api";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { SectionHeading } from "./sceneParts";

/** Real client voices — the human counterpart to the cinematic imagery. */
export function TestimonialsScene() {
  const { data: testimonials, isLoading } = useTestimonials();
  if (isLoading || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="section-space bg-canvas">
      <div className="content-wrap">
        <SectionHeading eyebrow="Kind words" title="What clients say" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.slice(0, 3).map((t) => (
            <motion.blockquote
              key={t.id}
              variants={fadeUp}
              className="flex h-full flex-col rounded-card border border-line bg-surface p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-ink/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft text-xs font-medium text-white">
                    {t.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{t.author_name}</p>
                  {t.author_role && <p className="text-xs text-muted">{t.author_role}</p>}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
