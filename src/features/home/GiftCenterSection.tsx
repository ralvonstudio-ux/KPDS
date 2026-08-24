import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem, type ProductCardItem } from "@/features/shop/components/ProductCard";
import { fadeUp, staggerChildren } from "@/lib/motion";

// Shown only when the real catalogue hasn't loaded yet (offline, slow
// connection, or nothing published in Supabase yet) — this section should
// never render empty. These aren't real, orderable products (no row in the
// database), so their card skips cart/wishlist and just links through to
// the Gift Center. Real products always take priority the moment they're
// available.
const FALLBACK_PRODUCTS: ProductCardItem[] = [
  {
    id: "fallback-tshirt",
    name: "Customized Couple T-Shirt",
    image: "https://picsum.photos/seed/kpds-gift-tshirt/900/900",
    imageAlt: "Customized Couple T-Shirt",
    href: "/gift-center",
    basePricePaise: 79900,
    comparePricePaise: 99900,
    isBestseller: true,
    isCustomisable: false,
    isReal: false,
  },
  {
    id: "fallback-mug",
    name: "Customized Photo Mug",
    image: "https://picsum.photos/seed/kpds-gift-mug/900/900",
    imageAlt: "Customized Photo Mug",
    href: "/gift-center",
    basePricePaise: 39900,
    comparePricePaise: null,
    isBestseller: false,
    isCustomisable: false,
    isReal: false,
  },
  {
    id: "fallback-frame",
    name: "Personalized Photo Frame",
    image: "https://picsum.photos/seed/kpds-gift-frame/900/900",
    imageAlt: "Personalized Photo Frame",
    href: "/gift-center",
    basePricePaise: 69900,
    comparePricePaise: null,
    isBestseller: false,
    isCustomisable: false,
    isReal: false,
  },
];

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
