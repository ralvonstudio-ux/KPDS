import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";
import { useServices, type Service } from "@/features/services/api";
import { usePortfolioItems } from "@/features/portfolio/api";
import { useTestimonials } from "@/features/testimonials/api";
import { fadeUp, staggerChildren, imageZoomHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Placeholder editorial photography until the studio uploads real work
// through /admin/services and /admin/portfolio — see docs/handover.md §5.
const HERO_IMAGE_MAIN = "https://picsum.photos/seed/kps-hero-main/1000/1300";
const HERO_IMAGE_ACCENT = "https://picsum.photos/seed/kps-hero-accent/700/700";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BentoGrid />
      <BrandStatement />
      <FeaturedPortfolio />
      <Testimonials />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <div className="content-wrap grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="order-2 lg:order-1">
        <p className="text-eyebrow uppercase tracking-[0.12em] text-gold">Khatu Pixel Digital Studio</p>
        <h1 className="mt-5 text-display-xl text-ink">
          Capturing
          <br />
          moments
          <br />
          that matter.
        </h1>
        <p className="mt-6 max-w-sm text-base text-muted md:text-lg">
          Photography, videography, and customised gifts — for the moments worth keeping.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink to="/book-your-event" variant="gold" size="lg">
            Book Your Event
          </ButtonLink>
          <ButtonLink to="/portfolio" variant="outline" size="lg">
            View Our Work
          </ButtonLink>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative order-1 lg:order-2"
      >
        <div className="aspect-[4/5] w-full overflow-hidden rounded-hero shadow-clay-lg">
          <img src={HERO_IMAGE_MAIN} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -bottom-8 -left-6 hidden aspect-square w-[38%] overflow-hidden rounded-card-lg border-4 border-canvas shadow-clay-lg sm:block">
          <img src={HERO_IMAGE_ACCENT} alt="" className="h-full w-full object-cover" />
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
  light,
}: {
  eyebrow: string;
  title: string;
  cta?: string;
  ctaTo?: string;
  light?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={cn("text-eyebrow uppercase tracking-[0.12em]", light ? "text-gold-soft" : "text-gold")}>{eyebrow}</p>
        <h2 className={cn("mt-2 text-display-lg", light ? "text-white" : "text-ink")}>{title}</h2>
      </div>
      {cta && ctaTo && (
        <Link
          to={ctaTo}
          className={cn(
            "text-sm font-medium underline underline-offset-4 transition-colors",
            light ? "text-white/80 hover:text-white" : "text-ink hover:text-gold",
          )}
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

/**
 * The homepage centerpiece: an intentionally asymmetric bento — never a
 * repeated grid of identical cards. Two tiles are live studio data (the
 * top two published services, admin-managed), the rest are the studio's
 * fixed navigational anchors (Portfolio, Book Your Event, Shop) so the
 * section always reads as complete even before any services are published.
 */
function BentoGrid() {
  const { data: services } = useServices(4);
  const [svc1, svc2, svc3, svc4] = services ?? [];

  return (
    <section className="section-space content-wrap">
      <SectionHeading eyebrow="What we do" title="Services & studio" cta="View all services" ctaTo="/services" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]">
        <BentoServiceTile service={svc1} fallbackTitle="Wedding Photography" className="sm:col-span-2 lg:col-span-2 lg:row-span-2" />
        <BentoLinkTile
          to="/portfolio"
          eyebrow="02 — Our work"
          title="Portfolio"
          description="Every wedding, every shoot, every story we've told."
          image="https://picsum.photos/seed/kps-bento-portfolio/900/900"
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
        />
        <BentoServiceTile service={svc2} fallbackTitle="Pre-Wedding Shoot" className="lg:col-span-1" compact />
        <BentoServiceTile service={svc3} fallbackTitle="Drone Coverage" className="lg:col-span-1" compact />
        <BentoCtaTile className="lg:col-span-2" />
        <BentoLinkTile
          to="/shop"
          eyebrow="06 — Gifting"
          title="Personalised Gifts"
          description="Frames, albums, and keepsakes made from your favourite moments."
          image="https://picsum.photos/seed/kps-bento-gifts/900/700"
          className="sm:col-span-2 lg:col-span-2"
        />
        <BentoServiceTile service={svc4} fallbackTitle="Corporate Events" className="sm:col-span-2 lg:col-span-2" />
      </div>
    </section>
  );
}

function BentoServiceTile({
  service,
  fallbackTitle,
  className,
  compact = false,
}: {
  service: Service | undefined;
  fallbackTitle: string;
  className?: string;
  compact?: boolean;
}) {
  const to = service ? `/services/${service.slug}` : "/services";
  const title = service?.title ?? fallbackTitle;
  const image = service?.cover_image_url;

  return (
    <motion.div {...cardHoverProps} className={cn("group relative overflow-hidden rounded-card-lg shadow-clay", className)}>
      <Link to={to} className="block h-full w-full focus-visible:outline-none">
        <div className="absolute inset-0 bg-obsidian">
          {image && (
            <motion.img
              {...imageZoomHover}
              src={image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
        <div className={cn("relative flex h-full flex-col justify-end p-5", compact ? "min-h-[180px]" : "min-h-[220px]")}>
          <h3 className={cn("text-white", compact ? "text-base font-medium" : "text-display-sm")}>{title}</h3>
          {!compact && service?.summary && <p className="mt-1 max-w-xs text-sm text-white/70">{service.summary}</p>}
          <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-white/80 transition-transform group-hover:translate-x-1">
            Explore <ArrowIcon />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function BentoLinkTile({
  to,
  eyebrow,
  title,
  description,
  image,
  className,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  className?: string;
}) {
  return (
    <motion.div {...cardHoverProps} className={cn("group relative overflow-hidden rounded-card-lg shadow-clay", className)}>
      <Link to={to} className="block h-full w-full focus-visible:outline-none">
        <div className="absolute inset-0 bg-obsidian">
          <motion.img {...imageZoomHover} src={image} alt="" loading="lazy" className="h-full w-full object-cover opacity-90" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/15 to-transparent" />
        <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5">
          <p className="text-eyebrow uppercase tracking-[0.1em] text-gold-soft">{eyebrow}</p>
          <h3 className="mt-1 text-display-sm text-white">{title}</h3>
          <p className="mt-1 max-w-xs text-sm text-white/70">{description}</p>
          <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-white/80 transition-transform group-hover:translate-x-1">
            Explore <ArrowIcon />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function BentoCtaTile({ className }: { className?: string }) {
  return (
    <motion.div {...cardHoverProps} className={cn("relative overflow-hidden rounded-card-lg bg-espresso shadow-clay", className)}>
      <Link to="/book-your-event" className="group flex h-full min-h-[180px] flex-col justify-between p-6 focus-visible:outline-none">
        <p className="text-eyebrow uppercase tracking-[0.1em] text-gold-soft">05 — Reserve your date</p>
        <div>
          <h3 className="text-display-sm text-white">Book Your Event</h3>
          <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-gold-soft transition-transform group-hover:translate-x-1">
            Start now <ArrowIcon />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

const cardHoverProps = {
  whileHover: { scale: 1.015 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
};

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The brand line, given room to breathe — full-bleed, dark, editorial. */
function BrandStatement() {
  return (
    <section className="bg-espresso py-20 text-center md:py-28">
      <div className="content-wrap">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-display-lg text-white"
        >
          We don't just capture photographs.
          <br />
          <span className="text-gold-soft">We preserve moments.</span>
        </motion.p>
      </div>
    </section>
  );
}

function FeaturedPortfolio() {
  const { data: items, isLoading } = usePortfolioItems(5);
  if (isLoading || !items || items.length === 0) return null;

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
            className={cn("group relative overflow-hidden rounded-card bg-black/5", i === 0 && "col-span-2 row-span-2")}
          >
            <Link to="/portfolio" className="block h-full">
              <motion.img
                {...imageZoomHover}
                src={item.cover_image_url}
                alt={item.title ?? item.category}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-obsidian/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.title && <p className="text-sm font-medium text-white">{item.title}</p>}
                <p className="flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-white/70">
                  {item.category} <ArrowIcon />
                </p>
              </div>
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

function FinalCta() {
  return (
    <section className="section-space content-wrap">
      <div className="rounded-hero bg-espresso px-8 py-16 text-center shadow-clay-lg md:py-20">
        <p className="text-eyebrow uppercase tracking-[0.12em] text-gold-soft">Let's get started</p>
        <h2 className="mx-auto mt-3 max-w-xl text-display-lg text-white">Ready to book your event?</h2>
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

