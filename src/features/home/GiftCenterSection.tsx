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
    <section className="content-wrap py-4 md:py-6 lg:py-8">
      {/* Same "framed panel" treatment as the hero and Studio section — a
          rounded card floating on the page background rather than a
          full-bleed tinted strip, so the homepage reads as one consistent
          bento language throughout. Also matches the hero's lg:max-h fit —
          this used to use the much larger section-space padding + a full
          display-lg heading, which pushed the panel well past one
          viewport and left it feeling "cropped" scrolling into it (the
          heading only ever showing half-scrolled-past behind the sticky
          nav). Trimmed padding/heading size so the whole panel — heading
          + all three product cards — fits under one screen on desktop,
          same as the hero. */}
      <div className="rounded-hero border border-line bg-surface p-5 shadow-clay-lg sm:p-6 lg:flex lg:max-h-[calc(100vh-6.5rem)] lg:flex-col lg:overflow-hidden lg:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 lg:shrink-0">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Gifts with a personal touch</p>
            <h2 className="mt-2 font-serif text-display-sm text-ink sm:text-display-md lg:mt-3">
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
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-5 lg:min-h-0 lg:flex-1"
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
