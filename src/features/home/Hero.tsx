import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp, staggerChildren } from "@/lib/motion";

export function Hero() {
  return (
    <section className="content-wrap grid grid-cols-1 items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
      <motion.div initial="hidden" animate="visible" variants={staggerChildren}>
        <motion.p variants={fadeUp} className="text-eyebrow uppercase tracking-[0.14em] text-muted">
          KPDS / Creative House
        </motion.p>
        <motion.h1 variants={fadeUp} className="mt-4 font-serif text-display-lg uppercase text-ink lg:text-display-xl">
          Make moments
          <br />
          mean more.
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Personalized gifts for people you love and visual stories worth remembering.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink to="/gift-center" variant="gold" size="lg">
            Explore Gifts →
          </ButtonLink>
          <ButtonLink to="/studio" variant="outline" size="lg">
            Explore Studio
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="aspect-[3/4] overflow-hidden rounded-card-lg shadow-clay-lg">
          <img
            src="https://picsum.photos/seed/kpds-hero-a/900/1200"
            alt="A KPDS wedding photography moment"
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-10 aspect-[3/4] overflow-hidden rounded-card-lg shadow-clay-lg">
          <img
            src="https://picsum.photos/seed/kpds-hero-b/900/1200"
            alt="A personalised KPDS keepsake gift"
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
