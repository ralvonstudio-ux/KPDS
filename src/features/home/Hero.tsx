import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp, staggerChildren, prefersReducedMotion } from "@/lib/motion";

// Real photography — hero portraits plus a few portfolio moments, all
// already self-hosted (see public/images/seed/) so cycling through them
// costs nothing extra to load.
const HERO_IMAGES = [
  { src: "/images/seed/kpds-hero-a.jpg", alt: "A KPDS wedding photography moment" },
  { src: "/images/seed/kpds-hero-b.jpg", alt: "A personalised KPDS keepsake gift" },
  { src: "/images/seed/kps-port-1.jpg", alt: "A KPDS portfolio moment" },
  { src: "/images/seed/kps-port-3.jpg", alt: "A KPDS portfolio moment" },
  { src: "/images/seed/kps-port-5.jpg", alt: "A KPDS portfolio moment" },
];
const SLIDE_INTERVAL_MS = 4500;

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
        <HeroSlot slotOffset={0} floatClassName="animate-tilt-float" />
        <HeroSlot slotOffset={1} floatClassName="animate-float-subtle mt-10" floatDelay="1.5s" />
      </motion.div>
    </section>
  );
}

/**
 * One hero image "card" — cycles through HERO_IMAGES on a shared timer.
 * Two slots read the same index with an offset (0 and +1), so advancing
 * the index by one always shifts what slot 2 was showing into slot 1 and
 * brings in a new image for slot 2 — a two-card conveyor rather than two
 * independent slideshows.
 */
function HeroSlot({
  slotOffset,
  floatClassName,
  floatDelay,
}: {
  slotOffset: number;
  floatClassName: string;
  floatDelay?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const image = HERO_IMAGES[(index + slotOffset) % HERO_IMAGES.length];

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-card-lg shadow-clay-lg ${floatClassName}`}
      style={floatDelay ? { animationDelay: floatDelay } : undefined}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading={slotOffset === 0 ? "eager" : "lazy"}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
