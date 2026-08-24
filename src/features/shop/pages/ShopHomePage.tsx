import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useShopCategories, useShopProducts } from "@/features/shop/api";
import { ProductCard, productToCardItem } from "@/features/shop/components/ProductCard";
import { FALLBACK_PRODUCTS } from "@/features/shop/components/fallbackProducts";
import { EmptyState } from "@/components/ui/States";
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

// Shown only when the real occasion list hasn't loaded — purely visual
// (there's no real category behind them to filter by), so selecting one
// while this is showing has no effect. Matches the reference design.
const FALLBACK_OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Couple"];

export default function ShopHomePage() {
  const { data: categories, error: categoriesError, refetch: refetchCategories } = useShopCategories();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const { data: products, isLoading, error: productsError, refetch: refetchProducts } = useShopProducts(activeCategorySlug ?? undefined);

  const hasRealProducts = !!products && products.length > 0;
  // Fallback is only meaningful for the unfiltered view — it's a generic
  // "here's what the Gift Center looks like" placeholder, not tied to any
  // one occasion, so a genuinely empty *filtered* result still shows the
  // real empty state rather than unrelated placeholder products.
  const useFallback = !activeCategorySlug && !hasRealProducts;
  const cardItems = useFallback ? FALLBACK_PRODUCTS : (products ?? []).map(productToCardItem);

  return (
    <div className="section-space content-wrap">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Gift Center</p>
      <h1 className="mt-3 font-serif text-display-lg text-ink">Gifts with a personal touch.</h1>
      <p className="mt-3 text-base text-muted">What are you shopping for?</p>

      <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by occasion">
        <FilterPill active={activeCategorySlug === null} onClick={() => setActiveCategorySlug(null)}>
          All occasions
        </FilterPill>
        {categories && categories.length > 0
          ? categories.map((category) => (
              <FilterPill
                key={category.id}
                active={activeCategorySlug === category.slug}
                onClick={() => setActiveCategorySlug(category.slug)}
              >
                <span aria-hidden="true">{categoryEmoji(category.name)}</span> {category.name}
              </FilterPill>
            ))
          : categoriesError &&
            FALLBACK_OCCASIONS.map((name) => (
              <FilterPill key={name} active={false} onClick={() => {}}>
                <span aria-hidden="true">{categoryEmoji(name)}</span> {name}
              </FilterPill>
            ))}
      </div>

      {(productsError || categoriesError) && (
        <p className="mt-4 text-xs text-muted">
          Having trouble reaching the live catalogue — showing example gifts below.{" "}
          <button
            type="button"
            onClick={() => {
              refetchProducts();
              refetchCategories();
            }}
            className="font-medium text-coral underline underline-offset-2 hover:text-coral-deep"
          >
            Try again
          </button>
        </p>
      )}

      <div className="mt-12">
        {isLoading && cardItems.length === 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-card-lg bg-black/5" />
            ))}
          </div>
        )}
        {!isLoading && cardItems.length === 0 && (
          <EmptyState
            title={activeCategorySlug ? "Nothing here yet" : "The boutique is opening soon"}
            description={
              activeCategorySlug
                ? "We're adding pieces to this collection — check back soon, or browse all occasions."
                : "Check back shortly for our gifting collection."
            }
          />
        )}
        {!isLoading && cardItems.length > 0 && (
          <motion.div
            key={activeCategorySlug ?? "all"}
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            {cardItems.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <ProductCard item={item} />
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
