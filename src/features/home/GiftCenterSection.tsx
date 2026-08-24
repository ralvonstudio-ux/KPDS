import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProducts } from "@/features/shop/api";
import { useCart } from "@/features/cart/CartContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";
import { fadeUp, staggerChildren, imageZoomHover } from "@/lib/motion";

// Shown only when the real catalogue hasn't loaded yet (offline, slow
// connection, or nothing published in Supabase yet) — this section should
// never render empty. These aren't real, orderable products (no row in the
// database), so their card skips cart/wishlist entirely and just links
// through to the Gift Center. Real products always take priority the
// moment they're available.
const FALLBACK_PRODUCTS = [
  {
    name: "Customized Couple T-Shirt",
    pricePaise: 79900,
    comparePricePaise: 99900,
    bestseller: true,
    image: "https://picsum.photos/seed/kpds-gift-tshirt/900/900",
  },
  {
    name: "Customized Photo Mug",
    pricePaise: 39900,
    comparePricePaise: null,
    bestseller: false,
    image: "https://picsum.photos/seed/kpds-gift-mug/900/900",
  },
  {
    name: "Personalized Photo Frame",
    pricePaise: 69900,
    comparePricePaise: null,
    bestseller: false,
    image: "https://picsum.photos/seed/kpds-gift-frame/900/900",
  },
];

/** "Gift Center" — the customised-gifts storefront side of the business. */
export function GiftCenterSection() {
  const { data: products } = useShopProducts();
  const hasRealProducts = !!products && products.length > 0;

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
          {hasRealProducts
            ? products.slice(0, 3).map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <RealGiftCard product={product} />
                </motion.div>
              ))
            : FALLBACK_PRODUCTS.map((product) => (
                <motion.div key={product.name} variants={fadeUp}>
                  <FallbackGiftCard product={product} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}

function RealGiftCard({ product }: { product: import("@/features/shop/api").ProductWithImages }) {
  const cover = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
  const { user } = useAuth();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const wished = has(product.id);

  const handleAdd = async () => {
    if (!user) {
      navigate(`/login?redirect=/gift-center`);
      return;
    }
    setStatus("adding");
    try {
      await addItem({
        productId: product.id,
        variantId: null,
        quantity: 1,
        unitPricePaise: product.base_price_paise,
      });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <GiftCardShell
      image={cover?.image_url ?? null}
      imageAlt={cover?.alt_text ?? product.name}
      bestseller={product.is_bestseller}
      wishlistButton={
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink shadow-clay transition-colors hover:text-coral"
        >
          <HeartIcon filled={wished} />
        </button>
      }
      titleLink={`/gift-center/product/${product.slug}`}
      title={product.name}
      price={formatINR(product.base_price_paise)}
      comparePrice={
        product.compare_at_price_paise && product.compare_at_price_paise > product.base_price_paise
          ? formatINR(product.compare_at_price_paise)
          : null
      }
      action={
        product.is_customisable ? (
          <Link
            to={`/gift-center/product/${product.slug}`}
            className="shrink-0 rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-coral-deep"
          >
            Customize
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={status === "adding"}
            className="shrink-0 rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-coral-deep disabled:opacity-60"
          >
            {status === "added" ? "Added ✓" : status === "adding" ? "Adding…" : "Add to Cart"}
          </button>
        )
      }
    />
  );
}

function FallbackGiftCard({ product }: { product: (typeof FALLBACK_PRODUCTS)[number] }) {
  return (
    <GiftCardShell
      image={product.image}
      imageAlt={product.name}
      bestseller={product.bestseller}
      wishlistButton={null}
      titleLink="/gift-center"
      title={product.name}
      price={formatINR(product.pricePaise)}
      comparePrice={product.comparePricePaise ? formatINR(product.comparePricePaise) : null}
      action={
        <Link
          to="/gift-center"
          className="shrink-0 rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-coral-deep"
        >
          View
        </Link>
      }
    />
  );
}

function GiftCardShell({
  image,
  imageAlt,
  bestseller,
  wishlistButton,
  titleLink,
  title,
  price,
  comparePrice,
  action,
}: {
  image: string | null;
  imageAlt: string;
  bestseller: boolean;
  wishlistButton: ReactNode;
  titleLink: string;
  title: string;
  price: string;
  comparePrice: string | null;
  action: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-card-lg border border-line bg-canvas shadow-clay">
      <Link to={titleLink} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/5">
          {image ? (
            <motion.img
              {...imageZoomHover}
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
          )}

          {bestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-clay">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {wishlistButton}

      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <Link to={titleLink} className="text-base font-medium text-ink hover:text-coral">
            {title}
          </Link>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-medium text-ink">{price}</span>
            {comparePrice && <span className="text-xs text-muted line-through">{comparePrice}</span>}
          </p>
        </div>
        {action}
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
      <path d="M12 21s-7.5-4.6-10.2-9.3C.3 8.6 1.7 5 5.2 4.3c2-.4 3.9.5 5.1 2.2 1.2-1.7 3.1-2.6 5.1-2.2 3.5.7 4.9 4.3 3.4 7.4C19.5 16.4 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}
