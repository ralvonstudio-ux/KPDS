import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { ProductWithImages } from "@/features/shop/api";
import { useCart } from "@/features/cart/CartContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";
import { imageZoomHover } from "@/lib/motion";

/**
 * Normalized shape a card can render from — either a real Supabase product
 * or a placeholder (see FALLBACK_PRODUCTS in GiftCenterSection.tsx). Only
 * `isReal` items get wishlist/cart wiring; a placeholder has no database
 * row to add to a cart, so its action just links through to the catalogue.
 */
export interface ProductCardItem {
  id: string;
  name: string;
  image: string | null;
  imageAlt: string;
  href: string;
  basePricePaise: number;
  comparePricePaise: number | null;
  isBestseller: boolean;
  isCustomisable: boolean;
  isReal: boolean;
}

export function productToCardItem(product: ProductWithImages): ProductCardItem {
  const cover = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
  return {
    id: product.id,
    name: product.name,
    image: cover?.image_url ?? null,
    imageAlt: cover?.alt_text ?? product.name,
    href: `/gift-center/product/${product.slug}`,
    basePricePaise: product.base_price_paise,
    comparePricePaise:
      product.compare_at_price_paise && product.compare_at_price_paise > product.base_price_paise
        ? product.compare_at_price_paise
        : null,
    isBestseller: product.is_bestseller,
    isCustomisable: product.is_customisable,
    isReal: true,
  };
}

/**
 * The one product card used everywhere — the homepage's Gift Center
 * section, the full Gift Center page, and category pages. Hover lifts the
 * card and deepens its shadow (shadow-clay -> shadow-clay-lg) on the same
 * editorial ease/duration as the rest of the site, so it "pops" smoothly
 * rather than snapping.
 */
export function ProductCard({ item }: { item: ProductCardItem }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const wished = item.isReal && has(item.id);

  const handleAdd = async () => {
    if (!user) {
      navigate(`/login?redirect=/gift-center`);
      return;
    }
    setStatus("adding");
    try {
      await addItem({ productId: item.id, variantId: null, quantity: 1, unitPricePaise: item.basePricePaise });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-card-lg border border-line bg-canvas shadow-clay transition-[box-shadow,transform] duration-300 ease-editorial hover:-translate-y-1 hover:shadow-clay-lg">
      <Link to={item.href} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/5">
          {item.image ? (
            <motion.img
              {...imageZoomHover}
              src={item.image}
              alt={item.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
          )}

          {item.isBestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-clay">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {item.isReal && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(item.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink shadow-clay transition-colors hover:text-coral"
        >
          <HeartIcon filled={wished} />
        </button>
      )}

      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <Link to={item.href} className="text-base font-medium text-ink hover:text-coral">
            {item.name}
          </Link>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-medium text-ink">{formatINR(item.basePricePaise)}</span>
            {item.comparePricePaise && <span className="text-xs text-muted line-through">{formatINR(item.comparePricePaise)}</span>}
          </p>
        </div>

        {!item.isReal ? (
          <Link to={item.href} className="shrink-0 rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-coral-deep">
            View
          </Link>
        ) : item.isCustomisable ? (
          <Link to={item.href} className="shrink-0 rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-coral-deep">
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
        )}
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
