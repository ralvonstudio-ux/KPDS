import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { ProductCard } from "@/features/shop/components/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp, staggerChildren } from "@/lib/motion";

/**
 * Scene 09 — the transition from photography into the gift shop: memory
 * turned into something physical. Real product data, never fabricated —
 * hides itself entirely until the studio has actually published products
 * (same "no fake content" rule as every other data-driven section).
 */
export function ShopTransition() {
  const { data: products, isLoading } = useShopProducts();
  if (isLoading || !products || products.length === 0) return null;

  return (
    <section className="section-space bg-surface">
      <div className="content-wrap">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-eyebrow uppercase tracking-[0.12em] text-gold">Custom gifts</p>
          <h2 className="mt-3 text-display-lg uppercase text-ink">
            Turn memories into
            <br />
            something you can hold.
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
          className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4"
        >
          {products.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <ButtonLink to="/shop" variant="outline" data-cursor="View">
            Visit the Shop
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
