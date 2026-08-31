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
    <section className="content-wrap py-4 md:py-6 lg:py-8">
      {/* Same "framed panel" + one-viewport-fit treatment as the hero and
          Gift Center section — see the longer comment in
          GiftCenterSection.tsx for why (the old section-space padding +
          display-lg heading pushed sections past one screen, which read
          as "cropped" scrolling into them). */}
      <div className="rounded-hero border border-line bg-surface p-5 shadow-clay-lg sm:p-6 lg:flex lg:max-h-[calc(100vh-6.5rem)] lg:flex-col lg:overflow-hidden lg:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 lg:shrink-0">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">KPDS Studio</p>
            <h2 className="mt-2 font-serif text-display-sm text-ink sm:text-display-md lg:mt-3">We frame your story.</h2>
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
          className="mt-6 flex gap-5 overflow-x-auto pb-2 lg:mt-5"
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
