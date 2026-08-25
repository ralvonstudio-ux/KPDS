import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioItems } from "@/features/portfolio/api";
import { Lightbox } from "@/features/portfolio/components/Lightbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import { imageZoomHover } from "@/lib/motion";

export default function PortfolioPage() {
  const { data: items, isLoading, error, refetch } = usePortfolioItems();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    if (!items) return ["All"];
    return ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <div className="page-space content-wrap">
      <PageHeader
        eyebrow="Our work"
        title="Portfolio"
        description="A running archive of weddings, portraits, and brand stories — each frame chosen for how it feels, not just how it looks."
      />

      {isLoading && <LoadingState label="Loading portfolio…" />}
      {error && <ErrorState description={error} onRetry={refetch} />}

      {!isLoading && !error && items && items.length === 0 && (
        <div className="mt-16">
          <EmptyState
            title="Portfolio coming soon"
            description="We're curating our best work for this gallery — check back shortly."
          />
        </div>
      )}

      {!isLoading && !error && items && items.length > 0 && (
        <>
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "border-espresso bg-espresso text-white"
                    : "border-line-strong text-ink hover:border-espresso",
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16">
              <EmptyState title="No items in this category yet" />
            </div>
          ) : (
            <div className="mt-10 columns-2 gap-4 sm:columns-3 md:gap-5 [column-fill:_balance]">
              {filtered.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4 }}
                  className="mb-4 block w-full overflow-hidden rounded-card bg-black/5 focus-visible:outline-none focus-visible:shadow-focus md:mb-5"
                >
                  <motion.img
                    {...imageZoomHover}
                    src={item.cover_image_url}
                    alt={item.title ?? item.category}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}

          <Lightbox
            items={filtered}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        </>
      )}
    </div>
  );
}
