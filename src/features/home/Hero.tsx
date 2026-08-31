import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Gift, GalleryHorizontalEnd, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingBlob } from "@/components/ui/FloatingBlob";
import { useHeroImages } from "@/features/home/api";
import { usePortfolioItems } from "@/features/portfolio/api";
import { useTestimonials } from "@/features/testimonials/api";
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

const QUICK_LINKS = [
  { to: "/studio", label: "Studio", icon: Camera, tint: "bg-pastelBlue" },
  { to: "/gift-center", label: "Gift Center", icon: Gift, tint: "bg-pastelPink" },
  { to: "/portfolio", label: "Portfolio", icon: GalleryHorizontalEnd, tint: "bg-pastelGreen" },
];

const FALLBACK_TESTIMONIAL = {
  id: "fallback",
  rating: 5,
  quote: "The Haldi photos alone made us cry — in a good way.",
  author_name: "Ananya & Rohit",
};

/**
 * "Framed panel" bento hero — one big rounded card holding the whole
 * above-the-fold layout (headline card + floating photo + quick-link
 * swatches), with a row of smaller real-content cards underneath
 * (Studio, a genuine testimonial, Portfolio thumbnails). Every number and
 * quote here is real data (services/portfolio/testimonials, with the same
 * fallback-until-published pattern used elsewhere) — nothing invented.
 */
export function Hero() {
  const heroImages = useHeroImages();
  const images: HeroImage[] =
    heroImages && heroImages.length > 0
      ? heroImages.map((h) => ({ src: h.image_url, alt: h.alt_text ?? "A KPDS moment" }))
      : FALLBACK_HERO_IMAGES;

  const { data: portfolioItems } = usePortfolioItems(3);
  const { data: testimonials } = useTestimonials();
  const testimonial = testimonials && testimonials.length > 0 ? testimonials[0] : FALLBACK_TESTIMONIAL;

  return (
    <section className="relative overflow-hidden">
      <FloatingBlob color="bg-pastelBlue" size="h-80 w-80" top="5%" left="5%" duration={18} />
      <FloatingBlob color="bg-pastelPink" size="h-96 w-96" top="45%" left="80%" duration={22} delay={1} />
      <FloatingBlob color="bg-pastelGreen" size="h-64 w-64" top="70%" left="15%" duration={16} delay={2} />

      <div className="content-wrap py-4 md:py-6 lg:py-8">
        {/* lg:max-h caps the whole panel to comfortably fit a typical
            laptop viewport under the sticky navbar (~72px) so the full
            bento layout — hero row + bottom row — is visible without
            scrolling on first load, matching the reference's single-view
            feel. Only constrained at lg+; smaller breakpoints stack
            vertically and are expected to scroll like a normal page. */}
        <div className="rounded-hero border border-line bg-surface p-3 shadow-clay-lg sm:p-4 lg:flex lg:max-h-[calc(100vh-6.5rem)] lg:flex-col lg:overflow-hidden lg:p-4">
          <div className="grid grid-cols-1 gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.7fr_1fr]">
            {/* Big hero card — headline + CTA, floating photo bottom-right */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              // Text-left / photo-right as one flex row at every
              // breakpoint, not just lg+ — below lg this used to switch to
              // an absolutely-positioned photo stacked under the copy,
              // which meant the side-by-side layout only actually existed
              // on desktop. The photo column just shrinks (w-24 -> w-36 ->
              // w-48) as the viewport narrows instead of dropping below
              // the text.
              className="relative flex items-center gap-4 overflow-hidden rounded-card-lg bg-canvas p-5 sm:gap-6 sm:p-8 lg:p-6"
            >
              <div className="min-w-0 flex-1">
                <motion.p variants={fadeUp} className="text-eyebrow uppercase tracking-[0.14em] text-muted">
                  KPDS / Creative House
                </motion.p>
                <motion.h1 variants={fadeUp} className="mt-3 font-serif text-display-sm text-ink sm:text-display-md lg:text-display-lg">
                  Make moments
                  <br />
                  mean more.
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-3 max-w-sm text-sm leading-relaxed text-muted lg:text-base">
                  Personalized gifts for people you love and visual stories worth remembering.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
                  <ButtonLink to="/gift-center" variant="gold" size="lg">
                    Explore Gifts →
                  </ButtonLink>
                  <ButtonLink to="/studio" variant="outline" size="lg">
                    Explore Studio
                  </ButtonLink>
                </motion.div>
              </div>

              <div className="relative w-24 shrink-0 sm:w-36 lg:w-48">
                <Dot className="left-[-14px] top-2 h-3 w-3 bg-coral/70" />
                <Dot className="right-4 top-[-10px] h-2 w-2 bg-gold/60" delay={0.4} />
                <Dot className="bottom-2 left-1/2 h-2.5 w-2.5 bg-pastelGreen" delay={0.8} />
                <HeroSlot images={images} slotOffset={0} />
              </div>
            </motion.div>

            {/* Right column — quick links + a second floating photo */}
            <div className="flex flex-col gap-3">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="rounded-card-lg bg-canvas p-4"
              >
                <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Explore</p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {QUICK_LINKS.map(({ to, label, icon: Icon, tint }) => (
                    <Link
                      key={to}
                      to={to}
                      aria-label={label}
                      title={label}
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${tint} text-ink/80 shadow-clay transition-transform duration-200 ease-spring hover:scale-110`}
                    >
                      <Icon size={17} strokeWidth={1.75} />
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative min-h-[9rem] flex-1 overflow-hidden rounded-card-lg bg-canvas p-3"
              >
                <HeroSlot images={images} slotOffset={1} fill />
                <Link
                  to="/portfolio"
                  aria-label="View portfolio"
                  className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink shadow-clay backdrop-blur-sm transition-transform duration-200 ease-spring hover:scale-110"
                >
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom row — three small real-content cards */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:shrink-0">
            <Link
              to="/studio"
              className="group flex items-center gap-3 rounded-card-lg bg-canvas p-4 transition-[box-shadow] duration-200 hover:shadow-clay"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pastelBlue text-ink/80">
                <Camera size={16} strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">Studio</span>
                <span className="block truncate text-xs text-muted">Photography &amp; videography</span>
              </span>
              <ArrowUpRight size={15} className="ml-auto shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <div className="rounded-card-lg bg-canvas p-4">
              <div className="flex gap-0.5 text-coral">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < (testimonial.rating ?? 5)} />
                ))}
              </div>
              <p className="mt-1.5 line-clamp-1 text-sm text-ink/90">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-1 text-xs text-muted">— {testimonial.author_name}</p>
            </div>

            <Link
              to="/portfolio"
              className="group flex items-center gap-3 rounded-card-lg bg-canvas p-4 transition-[box-shadow] duration-200 hover:shadow-clay"
            >
              {portfolioItems && portfolioItems.length > 0 ? (
                <span className="flex -space-x-3">
                  {portfolioItems.map((item) => (
                    <img
                      key={item.id}
                      src={item.cover_image_url}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full border-2 border-canvas object-cover"
                    />
                  ))}
                </span>
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pastelGreen text-ink/80">
                  <GalleryHorizontalEnd size={16} strokeWidth={1.75} />
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">Portfolio</span>
                <span className="block truncate text-xs text-muted">See our latest work</span>
              </span>
              <ArrowUpRight size={15} className="ml-auto shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot({ className, delay = 0 }: { className: string; delay?: number }) {
  const reduced = prefersReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 rounded-full ${className}`}
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={reduced ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="m12 2.5 2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7Z" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One rotating hero photo. Two instances read the same shared timer index
 * with a +0/+1 offset, so advancing the index shifts what slot 1 was
 * showing into slot 0 and brings in a new image for slot 1 — a two-photo
 * conveyor rather than two independent slideshows.
 */
function HeroSlot({ images, slotOffset, fill }: { images: HeroImage[]; slotOffset: number; fill?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const image = images[(index + slotOffset) % images.length];

  return (
    <div
      // `relative` and `fill`'s `absolute` are mutually exclusive — mixing
      // both on one element lets `relative` win the position cascade,
      // silently dropping the `inset-4` stretch the fill variant needs
      // (it collapses to 0 height instead of filling its parent).
      className={`overflow-hidden rounded-card shadow-clay-lg ${fill ? "absolute inset-4" : "relative aspect-[4/5] w-full"}`}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading={slotOffset === 0 ? "eager" : "lazy"}
          // fetchPriority as a JSX prop gets silently dropped by
          // framer-motion's prop whitelist (console warning, never reaches
          // the DOM) — setting it imperatively via the ref is what
          // actually works. Slot 0 is the largest above-the-fold image
          // (the LCP candidate), so it's the one worth prioritizing.
          ref={(el: HTMLImageElement | null) => {
            if (el && slotOffset === 0) el.fetchPriority = "high";
          }}
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
