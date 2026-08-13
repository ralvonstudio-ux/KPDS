import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShopProduct } from "@/features/shop/api";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import { uploadCustomerFile } from "@/lib/storage";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { LoadingState, ErrorState, EmptyState, Spinner } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useShopProduct(slug);
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customisation, setCustomisation] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => product?.product_variants.find((v) => v.id === variantId) ?? null,
    [product, variantId],
  );
  const activeVariantId = variantId ?? product?.product_variants.find((v) => v.is_default)?.id ?? null;
  const effectiveVariant = variantId ? selectedVariant : product?.product_variants.find((v) => v.is_default) ?? null;
  const unitPrice = effectiveVariant?.price_paise ?? product?.base_price_paise ?? 0;

  if (isLoading) return <LoadingState label="Loading product…" />;
  if (error) return <ErrorState description={error} />;
  if (!product) {
    return (
      <div className="section-space content-wrap">
        <EmptyState
          title="Product not found"
          description="This item may be sold out or no longer available."
          action={
            <ButtonLink to="/shop" variant="outline" className="mt-2">
              Back to Shop
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const images = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);

  const handleFileField = async (key: string, file: File) => {
    if (!user) {
      navigate(`/login?redirect=/shop/product/${slug}`);
      return;
    }
    setUploadingKey(key);
    setFormError(null);
    try {
      const path = await uploadCustomerFile(user.id, file);
      setCustomisation((c) => ({ ...c, [key]: path }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleAddToCart = async () => {
    setFormError(null);
    if (!user) {
      navigate(`/login?redirect=/shop/product/${slug}`);
      return;
    }
    if (product.is_customisable) {
      for (const field of product.customisation_fields) {
        if (field.required && !customisation[field.key]?.trim()) {
          setFormError(`"${field.label}" is required.`);
          return;
        }
      }
    }
    setIsAdding(true);
    try {
      await addItem({
        productId: product.id,
        variantId: activeVariantId,
        quantity,
        unitPricePaise: unitPrice,
        customisation: product.is_customisable ? customisation : {},
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 4000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="section-space content-wrap">
      <Link to="/shop" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← Shop
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="aspect-square overflow-hidden rounded-card bg-black/5">
            {images[activeImage] ? (
              <img src={images[activeImage].image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === activeImage ? "border-gold" : "border-transparent"}`}
                >
                  <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {product.categories && (
            <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">{product.categories.name}</p>
          )}
          <h1 className="mt-2 text-display-sm text-ink">{product.name}</h1>
          <p className="mt-2 text-xl font-medium text-ink">{formatINR(unitPrice)}</p>
          {product.description && <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>}

          {product.product_variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      (activeVariantId === v.id)
                        ? "border-espresso bg-espresso text-white"
                        : "border-line-strong text-ink hover:border-espresso"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.is_customisable && product.customisation_fields.length > 0 && (
            <div className="mt-6 flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
              <p className="text-sm font-medium text-ink">Personalise this item</p>
              {product.customisation_fields.map((field) => {
                if (field.type === "photo") {
                  return (
                    <div key={field.key}>
                      <label className="mb-1.5 block text-sm font-medium text-ink">
                        {field.label}
                        {field.required && <span className="text-gold-deep"> *</span>}
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium hover:border-espresso">
                          {uploadingKey === field.key ? <Spinner className="h-3.5 w-3.5" /> : customisation[field.key] ? "Replace photo" : "Upload photo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileField(field.key, file);
                            }}
                          />
                        </label>
                        {customisation[field.key] && <span className="text-xs text-muted">Photo uploaded ✓</span>}
                      </div>
                    </div>
                  );
                }
                const Field = field.type === "textarea" ? Textarea : Input;
                return (
                  <Field
                    key={field.key}
                    label={field.label}
                    required={field.required}
                    value={customisation[field.key] ?? ""}
                    onChange={(e) => setCustomisation((c) => ({ ...c, [field.key]: e.target.value }))}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line-strong">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-ink"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button variant="gold" className="flex-1" disabled={isAdding} onClick={handleAddToCart}>
              {isAdding ? "Adding…" : "Add to Cart"}
            </Button>
          </div>

          {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
          {added && (
            <p className="mt-3 rounded-lg bg-gold-soft/20 px-3 py-2 text-sm text-espresso">
              Added to your cart.{" "}
              <Link to="/cart" className="font-medium underline underline-offset-2">
                View cart
              </Link>
            </p>
          )}
          {!user && (
            <p className="mt-3 text-xs text-muted">
              You'll need to{" "}
              <Link to={`/login?redirect=/shop/product/${slug}`} className="underline underline-offset-2">
                log in
              </Link>{" "}
              to add items to your cart.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
