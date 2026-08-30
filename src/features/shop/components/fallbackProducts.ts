import type { ProductCardItem } from "./ProductCard";

/**
 * Shown wherever the real catalogue hasn't loaded yet (offline, slow
 * connection, Supabase project unreachable, or nothing published yet) — no
 * product-driven surface should ever render completely empty. These aren't
 * real, orderable rows, so `isReal: false` tells ProductCard to skip
 * cart/wishlist and just link through to the Gift Center. Real products
 * always take priority the instant they're available.
 */
export const FALLBACK_PRODUCTS: ProductCardItem[] = [
  {
    id: "fallback-tshirt",
    name: "Customized Couple T-Shirt",
    image: "/images/seed/kpds-gift-tshirt.webp",
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
    image: "/images/seed/kpds-gift-mug.webp",
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
    image: "/images/seed/kpds-gift-frame.webp",
    imageAlt: "Personalized Photo Frame",
    href: "/gift-center",
    basePricePaise: 69900,
    comparePricePaise: null,
    isBestseller: false,
    isCustomisable: false,
    isReal: false,
  },
];
