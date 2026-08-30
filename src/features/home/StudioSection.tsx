import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices } from "@/features/services/api";
import { formatINR } from "@/lib/utils";
import { fadeUp, staggerChildren, imageZoomHover } from "@/lib/motion";

// Shown only when the real catalogue hasn't loaded yet (offline, slow
// connection, or nothing published in Supabase yet) — this section should
// never render empty. Real services always take priority the moment
// they're available; this never overrides them.
const FALLBACK_SERVICES = [
  { title: "Wedding Stories", startingPricePaise: 2500000, image: "/images/seed/kpds-studio-wedding.webp" },
  { title: "Pre-Wedding Stories", startingPricePaise: 1500000, image: "/images/seed/kpds-studio-prewedding.webp" },
  { title: "Cinematic Films", startingPricePaise: 2000000, image: "/images/seed/kpds-studio-films.webp" },
  { title: "Haldi Celebration", startingPricePaise: 1200000, image: "/images/seed/kpds-studio-haldi.webp" },
];

/** "KPDS Studio" — the photography/videography side of the business. */
export function StudioSection() {
  const { data: services } = useServices(4);

  const cards =
    services && services.length > 0
      ? services.map((s) => ({
          key: s.id,
          title: s.title,
          image: s.cover_image_url,
          to: `/studio/${s.slug}`,
          priceLabel: s.is_custom_quote || !s.starting_price_paise ? "Custom Quote" : `From ${formatINR(s.starting_price_paise)}`,
        }))
      : FALLBACK_SERVICES.map((s) => ({
          key: s.title,
          title: s.title,
          image: s.image,
          to: "/studio",
          priceLabel: `From ${formatINR(s.startingPricePaise)}`,
        }));

  return (
    <section className="section-space content-wrap">
      {/* Same "framed panel" treatment as the hero — a rounded card
          floating on the page background, holding its own nested-tone
          (bg-canvas) tiles — so the homepage reads as one consistent
          bento language rather than the hero looking like a one-off. */}
      <div className="rounded-hero border border-line bg-surface p-5 shadow-clay-lg sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">KPDS Studio</p>
            <h2 className="mt-3 font-serif text-display-lg text-ink">We frame your story.</h2>
          </div>
          <Link to="/studio" className="text-sm font-medium text-coral hover:text-coral-deep">
            Explore Studio →
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
          className="mt-8 flex gap-5 overflow-x-auto pb-2"
        >
          {cards.map((card) => (
            <motion.div key={card.key} variants={fadeUp} className="w-52 shrink-0 sm:w-60">
              <Link
                to={card.to}
                className="group block overflow-hidden rounded-card border border-transparent bg-canvas transition-[border-color,box-shadow,transform] duration-300 ease-spring hover:-translate-y-1 hover:border-coral hover:shadow-clay focus-visible:outline-none focus-visible:border-coral"
              >
                <div className="aspect-[3/4] overflow-hidden bg-black/5">
                  {card.image ? (
                    <motion.img
                      {...imageZoomHover}
                      src={card.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-ink">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted">{card.priceLabel}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
