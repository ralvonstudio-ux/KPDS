import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopCategories } from "@/features/shop/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { staggerChildren, fadeUp, imageZoomHover } from "@/lib/motion";

export default function ShopHomePage() {
  const { data: categories, isLoading, error } = useShopCategories();

  return (
    <div className="section-space content-wrap">
      <PageHeader
        eyebrow="Custom gifts"
        title="Shop"
        description="Photo frames, printed albums, and personalised keepsakes — crafted from your favourite moments."
      />

      <div className="mt-16">
        {isLoading && <LoadingState label="Loading categories…" />}
        {error && <ErrorState description={error} />}
        {!isLoading && !error && categories && categories.length === 0 && (
          <EmptyState title="The boutique is opening soon" description="Check back shortly for our gifting collection." />
        )}
        {!isLoading && !error && categories && categories.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeUp}>
                <Link
                  to={`/shop/${category.slug}`}
                  className="group block overflow-hidden rounded-card border border-line bg-surface shadow-clay focus-visible:outline-none focus-visible:shadow-focus"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-black/5">
                    {category.cover_image_url ? (
                      <motion.img
                        {...imageZoomHover}
                        src={category.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                        Image coming soon
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-ink">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-muted line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
