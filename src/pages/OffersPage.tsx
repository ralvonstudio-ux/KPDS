import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { fadeUp, staggerChildren } from "@/lib/motion";

// Curated promotions — there's no discounts/offers table yet, so this is
// admin-maintained content in code rather than fabricated dynamic data. If
// KPDS wants these self-serve, the natural next step is an `offers` table
// (title, description, cta, valid_until) with an admin CRUD page, same
// pattern as services/products.
const OFFERS = [
  {
    title: "Wedding Package — 20% Off",
    description: "Book a full-day wedding photography package this season and save 20% on the studio rate.",
    cta: "Explore Studio",
    to: "/studio",
  },
  {
    title: "Personalized Gift Week — 30% Off",
    description: "Photo frames, albums, and custom keepsakes are 30% off for a limited time in the Gift Center.",
    cta: "Shop the Gift Center",
    to: "/gift-center",
  },
  {
    title: "This Week: Free Engagement Mini-Shoot",
    description: "Book a wedding package this week and a complimentary engagement mini-shoot comes with it.",
    cta: "Book Your Event",
    to: "/book-your-event",
  },
];

export default function OffersPage() {
  return (
    <div className="page-space content-wrap">
      <PageHeader
        eyebrow="Limited time"
        title="Offers"
        description="Current promotions across the studio and the gift center — check back often, they rotate seasonally."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren}
        className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {OFFERS.map((offer) => (
          <motion.div
            key={offer.title}
            variants={fadeUp}
            className="flex flex-col rounded-card-lg border border-line bg-surface p-7 shadow-clay"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-coral">
              <SparkleIcon />
              Offer
            </span>
            <h3 className="mt-4 font-serif text-xl text-ink">{offer.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{offer.description}</p>
            <ButtonLink to={offer.to} variant="outline" size="sm" className="mt-6 w-fit">
              {offer.cta} →
            </ButtonLink>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 13.8 9.2 21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8Z" />
    </svg>
  );
}
