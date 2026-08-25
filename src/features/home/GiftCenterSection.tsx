import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem, type ProductCardItem } from "@/features/shop/components/ProductCard";
import { FALLBACK_PRODUCTS } from "@/features/shop/components/fallbackProducts";
import { fadeUp, staggerChildren } from "@/lib/motion";

/** "Gift Center" — the customised-gifts storefront side of the business. */
export function GiftCenterSection() {
  const { data: products } = useShopProducts();
  const items: ProductCardItem[] =
    products && products.length > 0 ? products.slice(0, 3).map(productToCardItem) : FALLBACK_PRODUCTS;

  return (
    <section className="section-space bg-surface">
      <div className="content-wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Gifts with a personal touch</p>
            <h2 className="mt-3 font-serif text-display-lg text-ink">
              Designed, printed and created
              <br />
              for your moments.
            </h2>
          </div>
          <Link to="/gift-center" className="text-sm font-medium text-coral hover:text-coral-deep">
            Shop all gifts →
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={fadeUp}>
              <ProductCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
