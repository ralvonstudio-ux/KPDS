import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";

/**
 * Placeholder editorial hero for Day 2–3 — the full bento homepage (featured
 * portfolio/services/shop, testimonials, immersive final CTA) lands in the
 * next phase per docs/build-plan.md.
 */
export default function HomePage() {
  return (
    <div className="section-space content-wrap flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">Khatu Pixel Digital Studio</p>
        <h1 className="mt-4 text-display-xl text-ink">
          Capturing Moments.
          <br />
          Creating Memories.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base text-muted">
          Photography, videography, and customised gifts for the moments worth keeping.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/book-your-event" variant="gold" size="lg">
            Book Your Event
          </ButtonLink>
          <ButtonLink to="/portfolio" variant="outline" size="lg">
            Explore Our Work
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
