import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem } from "@/features/shop/components/ProductCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { staggerChildren, fadeUp } from "@/lib/motion";

export default function ShopCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: products, isLoading, error } = useShopProducts(categorySlug);

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
        {error && <ErrorState description={error} />}
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
