import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices, type Service } from "@/features/services/api";
import { TiltCard } from "@/components/ui/TiltCard";
import { imageZoomHover } from "@/lib/motion";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { cn } from "@/lib/utils";
import { SectionHeading, ArrowIcon } from "./sceneParts";

/**
 * Scene 03 — asymmetric bento. Two tiles are live, admin-managed service
 * data; the rest are the studio's fixed navigational anchors (Portfolio,
 * Book Your Event, Shop) so the section always reads as complete even
 * before a single service has been published.
 */
export function BentoExperience() {
  const { data: services } = useServices(4);
  const gridRef = useRef<HTMLDivElement>(null);
  const [svc1, svc2, svc3] = services ?? [];

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const ctx = gsap.context(() => {
      const tiles = gridRef.current!.querySelectorAll(".bento-tile");
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
        },
      );
    }, gridRef);
    return () => ctx.revert();
  }, [services]);

  return (
    <section className="section-space content-wrap">
      <SectionHeading eyebrow="What we do" title="Services & Studio" cta="View all services" ctaTo="/services" />

      <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]">
        <BentoServiceTile index="01" service={svc1} fallbackTitle="Wedding Photography" className="sm:col-span-2 lg:col-span-2 lg:row-span-2" />
        <BentoLinkTile
          index="02"
          to="/portfolio"
          eyebrow="Our work"
          title="Portfolio"
          description="Every wedding, every shoot, every story we've told."
          image="https://picsum.photos/seed/kpds-bento-portfolio/900/900"
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
        />
        <BentoServiceTile index="03" service={svc2} fallbackTitle="Pre-Wedding" className="lg:col-span-1" compact />
        <BentoCtaTile index="04" className="lg:col-span-1" />
        <BentoServiceTile index="05" service={svc3} fallbackTitle="Cinematic Films" className="sm:col-span-2 lg:col-span-2" />
        <BentoLinkTile
          index="06"
          to="/shop"
          eyebrow="Gifting"
          title="Shop"
          description="Frames, albums, and keepsakes made from your favourite moments."
          image="https://picsum.photos/seed/kpds-bento-gifts/900/700"
          className="sm:col-span-2 lg:col-span-2"
        />
      </div>
    </section>
  );
}

function TileIndex({ index }: { index: string }) {
  return <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">{index} —</p>;
}

function BentoServiceTile({
  index,
  service,
  fallbackTitle,
  className,
  compact = false,
}: {
  index: string;
  service: Service | undefined;
  fallbackTitle: string;
  className?: string;
  compact?: boolean;
}) {
  const to = service ? `/services/${service.slug}` : "/services";
  const title = service?.title ?? fallbackTitle;
  const image = service?.cover_image_url;

  return (
    <TiltCard maxTilt={5} className={cn("bento-tile group relative overflow-hidden rounded-card-lg shadow-clay", className)}>
      <Link to={to} className="block h-full w-full focus-visible:outline-none" data-cursor="View">
        <div className="absolute inset-0 bg-obsidian">
          {image && (
            <motion.img {...imageZoomHover} src={image} alt="" loading="lazy" className="h-full w-full object-cover opacity-90" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
        <div className={cn("relative flex h-full flex-col justify-between p-5", compact ? "min-h-[180px]" : "min-h-[220px]")}>
          <TileIndex index={index} />
          <div>
            <h3 className={cn("text-white", compact ? "text-base font-medium" : "text-display-sm")}>{title}</h3>
            {!compact && service?.summary && <p className="mt-1 max-w-xs text-sm text-white/70">{service.summary}</p>}
            <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-white/80 transition-transform group-hover:translate-x-1">
              Explore <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

function BentoLinkTile({
  index,
  to,
  eyebrow,
  title,
  description,
  image,
  className,
}: {
  index: string;
  to: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  className?: string;
}) {
  return (
    <TiltCard maxTilt={5} className={cn("bento-tile group relative overflow-hidden rounded-card-lg shadow-clay", className)}>
      <Link to={to} className="block h-full w-full focus-visible:outline-none" data-cursor="View">
        <div className="absolute inset-0 bg-obsidian">
          <motion.img {...imageZoomHover} src={image} alt="" loading="lazy" className="h-full w-full object-cover opacity-90" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/15 to-transparent" />
        <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5">
          <TileIndex index={index} />
          <div>
            <p className="text-eyebrow uppercase tracking-[0.1em] text-gold-soft">{eyebrow}</p>
            <h3 className="mt-1 text-display-sm text-white">{title}</h3>
            <p className="mt-1 max-w-xs text-sm text-white/70">{description}</p>
            <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-white/80 transition-transform group-hover:translate-x-1">
              Explore <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

function BentoCtaTile({ index, className }: { index: string; className?: string }) {
  return (
    <TiltCard maxTilt={5} className={cn("bento-tile relative overflow-hidden rounded-card-lg bg-espresso shadow-clay", className)}>
      <Link to="/book-your-event" className="group flex h-full min-h-[180px] flex-col justify-between p-6 focus-visible:outline-none" data-cursor="Open">
        <TileIndex index={index} />
        <div>
          <h3 className="text-display-sm text-white">Book Your Event</h3>
          <span className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-gold-soft transition-transform group-hover:translate-x-1">
            Start now <ArrowIcon />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
