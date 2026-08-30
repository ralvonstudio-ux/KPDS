import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingBlob } from "@/components/ui/FloatingBlob";
import { useHeroImages } from "@/features/home/api";
import { fadeUp, staggerChildren, prefersReducedMotion } from "@/lib/motion";

interface HeroImage {
  src: string;
  alt: string;
}

// Shown only until the studio uploads its own photos from /admin/hero —
// same fallback pattern as FALLBACK_SERVICES/FALLBACK_PRODUCTS elsewhere.
// Real photography always takes priority the moment it's published; this
// never overrides it.
const FALLBACK_HERO_IMAGES: HeroImage[] = [
  { src: "/images/seed/kpds-hero-a.webp", alt: "A KPDS wedding photography moment" },
  { src: "/images/seed/kpds-hero-b.webp", alt: "A personalised KPDS keepsake gift" },
  { src: "/images/seed/kps-port-1.webp", alt: "A KPDS portfolio moment" },
  { src: "/images/seed/kps-port-3.webp", alt: "A KPDS portfolio moment" },
  { src: "/images/seed/kps-port-5.webp", alt: "A KPDS portfolio moment" },
];
const SLIDE_INTERVAL_MS = 4500;

export function Hero() {
  const heroImages = useHeroImages();
  const images: HeroImage[] =
    heroImages && heroImages.length > 0
      ? heroImages.map((h) => ({ src: h.image_url, alt: h.alt_text ?? "A KPDS moment" }))
      : FALLBACK_HERO_IMAGES;

  return (
    <section className="relative overflow-hidden">
      <FloatingBlob color="bg-pastelBlue" size="h-80 w-80" top="5%" left="5%" duration={18} />
      <FloatingBlob color="bg-pastelPink" size="h-96 w-96" top="45%" left="80%" duration={22} delay={1} />
      <FloatingBlob color="bg-pastelGreen" size="h-64 w-64" top="70%" left="15%" duration={16} delay={2} />

      <div className="content-wrap grid grid-cols-1 items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <motion.div initial="hidden" animate="visible" variants={staggerChildren}>
          <motion.p variants={fadeUp} className="text-eyebrow uppercase tracking-[0.14em] text-muted">
            KPDS / Creative House
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-4 font-serif text-display-lg text-ink lg:text-display-xl">
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
          <HeroSlot images={images} slotOffset={0} floatClassName="animate-tilt-float" />
          <HeroSlot images={images} slotOffset={1} floatClassName="animate-float-subtle mt-10" floatDelay="1.5s" />
        </motion.div>
      </div>
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
  images,
  slotOffset,
  floatClassName,
  floatDelay,
}: {
  images: HeroImage[];
  slotOffset: number;
  floatClassName: string;
  floatDelay?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const image = images[(index + slotOffset) % images.length];

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
          // The slot-0 image is the largest above-the-fold image on the
          // page (the LCP candidate) — fetchPriority tells the browser to
          // fetch it ahead of same-priority requests queued after it.
          fetchPriority={slotOffset === 0 ? "high" : undefined}
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
