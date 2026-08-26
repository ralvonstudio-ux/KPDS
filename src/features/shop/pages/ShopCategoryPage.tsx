import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem } from "@/features/shop/components/ProductCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { usePageMeta } from "@/lib/usePageMeta";

// "home-decor" -> "Home Decor" — a readable title-cased fallback for the
// browser tab while categorySlug is all we have (no category name loaded).
function titleCaseSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ShopCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: products, isLoading, error, refetch } = useShopProducts(categorySlug);
  usePageMeta(
    categorySlug ? `${titleCaseSlug(categorySlug)} Gifts` : "Gift Center",
    `Shop ${categorySlug ? titleCaseSlug(categorySlug) : ""} gifts from Khatu Pixel Digital Studio.`,
  );

  return (
    <div className="page-space content-wrap">
      <Link to="/gift-center" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← All categories
      </Link>

      <div className="mt-6">
        <PageHeader eyebrow="Gift Center" title={categorySlug?.replace(/-/g, " ") ?? "Gift Center"} />
      </div>

      <div className="mt-16">
        {isLoading && <LoadingState label="Loading products…" />}
        {error && <ErrorState description={error} onRetry={refetch} />}
        {!isLoading && !error && products && products.length === 0 && (
          <EmptyState title="No products here yet" description="We're adding pieces to this collection — check back soon." />
        )}
        {!isLoading && !error && products && products.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard item={productToCardItem(product)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
