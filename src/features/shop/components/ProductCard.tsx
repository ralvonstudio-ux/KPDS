import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ProductWithImages } from "@/features/shop/api";
import { formatINR } from "@/lib/utils";
import { imageZoomHover } from "@/lib/motion";
import { TiltCard } from "@/components/ui/TiltCard";

export function ProductCard({ product }: { product: ProductWithImages }) {
  const cover = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  return (
    <TiltCard maxTilt={4}>
      <Link
        to={`/shop/product/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-clay focus-visible:outline-none focus-visible:shadow-focus"
      >
        <div className="aspect-square overflow-hidden bg-black/5">
          {cover ? (
            <motion.img
              {...imageZoomHover}
              src={cover.image_url}
              alt={cover.alt_text ?? product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-5">
          <h3 className="text-base font-medium text-ink">{product.name}</h3>
          <p className="mt-auto pt-2 text-sm font-medium text-gold-deep">{formatINR(product.base_price_paise)}</p>
        </div>
      </Link>
    </TiltCard>
  );
}
