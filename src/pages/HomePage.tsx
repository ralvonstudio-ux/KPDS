import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";
import { useServices } from "@/features/services/api";
import { usePortfolioItems } from "@/features/portfolio/api";
import { useTestimonials } from "@/features/testimonials/api";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { fadeUp, staggerChildren, imageZoomHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedServices />
      <FeaturedPortfolio />
      <Testimonials />
      <GiftingTeaser />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <div className="content-wrap flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
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

function SectionHeading({
  eyebrow,
  title,
  cta,
  ctaTo,
}: {
  eyebrow: string;
  title: string;
  cta?: string;
  ctaTo?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">{eyebrow}</p>
        <h2 className="mt-2 text-display-sm text-ink">{title}</h2>
      </div>
      {cta && ctaTo && (
        <Link to={ctaTo} className="text-sm font-medium text-ink underline underline-offset-4 hover:text-gold-deep">
          {cta}
        </Link>
      )}
    </div>
  );
}

function FeaturedServices() {
  const { data: services, isLoading } = useServices(3);
  if (isLoading || !services || services.length === 0) return null;

  return (
    <section className="section-space content-wrap">
      <SectionHeading eyebrow="What we offer" title="Services" cta="View all services" ctaTo="/services" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren}
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <motion.div key={service.id} variants={fadeUp}>
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function FeaturedPortfolio() {
  const { data: items, isLoading } = usePortfolioItems(5);
  if (isLoading || !items || items.length === 0) return null;

  // Asymmetric bento: first tile spans two rows/cols on larger screens.
  return (
    <section className="section-space content-wrap">
      <SectionHeading eyebrow="Our work" title="Portfolio" cta="View full portfolio" ctaTo="/portfolio" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={cn(
              "overflow-hidden rounded-card bg-black/5",
              i === 0 && "col-span-2 row-span-2",
            )}
          >
            <Link to="/portfolio" className="block h-full">
              <motion.img
                {...imageZoomHover}
                src={item.cover_image_url}
                alt={item.title ?? item.category}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  if (isLoading || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="section-space bg-surface">
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
              className="flex h-full flex-col rounded-card border border-line bg-canvas p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-ink/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft text-xs font-medium text-espresso">
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

function GiftingTeaser() {
  return (
    <section className="section-space content-wrap">
      <div className="grid grid-cols-1 items-center gap-8 rounded-card-lg border border-line bg-surface p-8 shadow-clay md:grid-cols-[1.2fr_1fr] md:p-14">
        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">Custom gifts</p>
          <h2 className="mt-2 text-display-sm text-ink">Turn favourite frames into keepsakes</h2>
          <p className="mt-4 max-w-md text-sm text-muted">
            Photo frames, printed albums, and personalised gifts — crafted from your best moments.
            Our gifting boutique is opening soon.
          </p>
          <ButtonLink to="/shop" variant="outline" className="mt-6">
            Visit the Shop
          </ButtonLink>
        </div>
        <div className="aspect-[4/3] rounded-card bg-gradient-to-br from-gold-soft/40 to-espresso/10" />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-espresso py-20 text-center text-white md:py-28">
      <div className="content-wrap">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-soft">Let's get started</p>
        <h2 className="mx-auto mt-3 max-w-xl text-display-md">Ready to book your event?</h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          Tell us about your date — we'll follow up with availability and a tailored quote.
        </p>
        <ButtonLink to="/book-your-event" variant="gold" size="lg" className="mt-8">
          Book Your Event
        </ButtonLink>
      </div>
    </section>
  );
}
