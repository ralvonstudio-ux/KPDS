import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/features/cart/CartContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { usePageMeta } from "@/lib/usePageMeta";

export default function CartPage() {
  usePageMeta("Cart");
  const { user } = useAuth();
  const { items, isLoading, subtotalPaise, updateQuantity, removeItem } = useCart();

  return (
    <div className="page-space content-wrap">
      <PageHeader eyebrow="Your bag" title="Cart" />

      <div className="mx-auto mt-12 max-w-3xl">
        {!user ? (
          <EmptyState
            title="Log in to see your cart"
            description="Your cart is saved to your account so it's there whenever you come back."
            action={
              <ButtonLink to="/login?redirect=/cart" variant="gold" className="mt-2">
                Log in
              </ButtonLink>
            }
          />
        ) : isLoading ? (
          <LoadingState label="Loading your cart…" />
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse the shop to find a gift worth wrapping."
            action={
              <ButtonLink to="/gift-center" variant="outline" className="mt-2">
                Visit the Gift Center
              </ButtonLink>
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const image = item.products?.product_images?.[0]?.image_url;
                const customEntries = Object.entries(item.customisation ?? {});
                return (
                  <div key={item.id} className="flex gap-4 rounded-card border border-line bg-surface p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-ink">{item.products?.name ?? "Product"}</p>
                          {item.product_variants && <p className="text-xs text-muted">{item.product_variants.name}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-red-700 underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                      {customEntries.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {customEntries.map(([key, value]) => (
                            <span key={key} className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-muted">
                              {key}: {value.length > 20 ? "custom photo" : value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line-strong">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-sm text-ink"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-sm text-ink"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-medium text-ink">{formatINR(item.unit_price_paise * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-card border border-line bg-surface p-6">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-base font-medium text-ink">{formatINR(subtotalPaise)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
              <ButtonLink to="/checkout" variant="gold" className="mt-4 w-full">
                Proceed to Checkout
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
