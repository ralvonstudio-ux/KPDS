import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useShopCategories, useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem } from "@/features/shop/components/ProductCard";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// A category's name doesn't carry an emoji in the database — this is a
// purely cosmetic lookup for the filter pills, keyed by keyword so any
// category the studio adds later still gets a reasonable icon instead of
// none at all.
const CATEGORY_EMOJI: [pattern: RegExp, emoji: string][] = [
  [/birthday/i, "🎂"],
  [/anniversary/i, "❤️"],
  [/wedding/i, "💍"],
  [/couple/i, "🧑‍🤝‍🧑"],
  [/baby|kids?/i, "🍼"],
  [/festiv|diwali|holi/i, "✨"],
  [/home|decor/i, "🏠"],
  [/frame|photo/i, "🖼️"],
];
function categoryEmoji(name: string): string {
  return CATEGORY_EMOJI.find(([pattern]) => pattern.test(name))?.[1] ?? "🎁";
}

export default function ShopHomePage() {
  const { data: categories } = useShopCategories();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const { data: products, isLoading, error } = useShopProducts(activeCategorySlug ?? undefined);

  return (
    <div className="section-space content-wrap">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Gift Center</p>
      <h1 className="mt-3 font-serif text-display-lg text-ink">Gifts with a personal touch.</h1>
      <p className="mt-3 text-base text-muted">What are you shopping for?</p>

      <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by occasion">
        <FilterPill active={activeCategorySlug === null} onClick={() => setActiveCategorySlug(null)}>
          All occasions
        </FilterPill>
        {categories?.map((category) => (
          <FilterPill
            key={category.id}
            active={activeCategorySlug === category.slug}
            onClick={() => setActiveCategorySlug(category.slug)}
          >
            <span aria-hidden="true">{categoryEmoji(category.name)}</span> {category.name}
          </FilterPill>
        ))}
      </div>

      <div className="mt-12">
        {isLoading && <LoadingState label="Loading gifts…" />}
        {error && <ErrorState description={error} />}
        {!isLoading && !error && products && products.length === 0 && (
          <EmptyState
            title={activeCategorySlug ? "Nothing here yet" : "The boutique is opening soon"}
            description={
              activeCategorySlug
                ? "We're adding pieces to this collection — check back soon, or browse all occasions."
                : "Check back shortly for our gifting collection."
            }
          />
        )}
        {!isLoading && !error && products && products.length > 0 && (
          <motion.div
            key={activeCategorySlug ?? "all"}
            initial="hidden"
            animate="visible"
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

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
        active ? "border-coral bg-coral/10 text-coral" : "border-line-strong bg-surface text-ink hover:border-coral/50",
      )}
    >
      {children}
    </button>
  );
}
