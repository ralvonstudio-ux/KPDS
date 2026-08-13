import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePortfolioItems } from "@/features/portfolio/api";
import { TiltCard } from "@/components/ui/TiltCard";
import { imageZoomHover } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading, ArrowIcon } from "./sceneParts";

/** Scene 04 — the heart of KPDS. An editorial, asymmetric image grid, not
 * a carousel — every image at a different aspect ratio and weight. */
export function PortfolioScene() {
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
            className={cn(i === 0 && "col-span-2 row-span-2")}
          >
            <TiltCard maxTilt={4} className="group relative h-full overflow-hidden rounded-card bg-black/5">
              <Link to="/portfolio" className="block h-full" data-cursor="Open">
                <motion.img
                  {...imageZoomHover}
                  src={item.cover_image_url}
                  alt={item.title ?? item.category}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-obsidian/75 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-gold-soft">{item.category}</p>
                  {item.title && <p className="mt-0.5 text-sm font-medium text-white">{item.title}</p>}
                  <p className="mt-1 flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-white/70">
                    View Story <ArrowIcon />
                  </p>
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
