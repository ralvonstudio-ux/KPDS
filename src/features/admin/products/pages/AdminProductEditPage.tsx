import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Tag,
  ImagePlus,
  IndianRupee,
  Sparkles,
  Layers,
  Eye,
  ChevronDown,
  Type,
  AlignLeft,
  Camera,
  Check,
  Trash2,
} from "lucide-react";
import {
  useAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
  createProductVariant,
  deleteProductVariant,
  type ProductDraft,
} from "@/features/admin/products/api";
import { useAdminCategories } from "@/features/admin/categories/api";
import { GalleryUploader } from "@/components/admin/ImageUploader";
import { Toggle } from "@/components/admin/Toggle";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { slugify, formatINR, cn } from "@/lib/utils";
import type { CustomisationField, CustomisationFieldType } from "@/types/database";

const emptyDraft: ProductDraft = {
  category_id: null,
  slug: "",
  name: "",
  description: "",
  base_price_paise: 0,
  is_customisable: false,
  customisation_fields: [],
  stock_tracked: false,
  stock_quantity: 0,
  is_published: true,
  is_archived: false,
  sort_order: 0,
};

const FIELD_TYPE_ICON: Record<CustomisationFieldType, typeof Type> = {
  text: Type,
  textarea: AlignLeft,
  photo: Camera,
};

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const { data: categories } = useAdminCategories();

  const { product, images, variants, isLoading, error, refetch } = useAdminProduct(isNew ? undefined : id);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [priceInput, setPriceInput] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fieldDraft, setFieldDraft] = useState<CustomisationField>({ key: "", label: "", type: "text", required: false });
  const [variantDraft, setVariantDraft] = useState({ name: "", sku: "", price: "", stock: "0" });

  useEffect(() => {
    if (product) {
      setDraft({
        category_id: product.category_id,
        slug: product.slug,
        name: product.name,
        description: product.description ?? "",
        base_price_paise: product.base_price_paise,
        is_customisable: product.is_customisable,
        customisation_fields: product.customisation_fields,
        stock_tracked: product.stock_tracked,
        stock_quantity: product.stock_quantity,
        is_published: product.is_published,
        is_archived: product.is_archived,
        sort_order: product.sort_order,
      });
      setPriceInput(String(product.base_price_paise / 100));
    }
  }, [product]);

  if (!isNew && isLoading) return <LoadingState />;
  if (!isNew && error) return <ErrorState description={error} onRetry={refetch} />;

  const categoryName = categories?.find((c) => c.id === draft.category_id)?.name;

  const save = async () => {
    setFormError(null);
    if (!draft.name.trim()) {
      setFormError("Give your product a name to continue.");
      return;
    }
    setIsSaving(true);
    const payload: ProductDraft = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      base_price_paise: Math.round(Number(priceInput) * 100),
    };
    try {
      if (isNew) {
        const created = await createProduct(payload);
        navigate(`/admin/products/${created.id}`, { replace: true });
      } else if (id) {
        await updateProduct(id, payload);
        refetch();
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2200);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const ok = await confirm({
      title: "Delete product?",
      description: `"${product.name}" and all of its photos/options will be permanently removed. This can't be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteProduct(product.id);
    navigate("/admin/products");
  };

  const addVariant = async () => {
    if (!product || !variantDraft.name.trim()) return;
    await createProductVariant(product.id, {
      name: variantDraft.name,
      sku: variantDraft.sku || null,
      price_paise: variantDraft.price ? Math.round(Number(variantDraft.price) * 100) : null,
      stock_quantity: Number(variantDraft.stock) || 0,
      is_default: variants.length === 0,
    });
    setVariantDraft({ name: "", sku: "", price: "", stock: "0" });
    refetch();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} strokeWidth={1.75} /> All products
      </Link>

      <div className="mb-6 mt-3">
        <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">Shop</p>
        <h1 className="mt-1 text-display-md text-ink">{isNew ? "Add a new product" : product?.name}</h1>
        {isNew && <p className="mt-1 text-sm text-muted">Fill in the essentials below — you can add photos and options right after.</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <FormCard icon={Tag} title="Basic details" description="What is it, and which shelf does it belong on?">
            <Input
              label="Product name"
              required
              placeholder="e.g. Classic Wooden Frame"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <Select
              label="Category"
              value={draft.category_id ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value || null }))}
            >
              <option value="">No category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Textarea
              label="Description"
              placeholder="A line or two customers will see on the product page."
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </FormCard>

          {!isNew && product ? (
            <FormCard icon={ImagePlus} title="Photos" description="The first photo is what customers see in the shop grid.">
              <GalleryUploader
                bucket="products"
                folder={product.id}
                images={images.map((i) => i.image_url)}
                onAdd={async (url) => {
                  await addProductImage(product.id, url, images.length);
                  refetch();
                }}
                onRemove={async (url) => {
                  const img = images.find((i) => i.image_url === url);
                  if (img) {
                    await removeProductImage(img.id);
                    refetch();
                  }
                }}
              />
            </FormCard>
          ) : (
            <FormCard icon={ImagePlus} title="Photos" description="Save the product first, then add photos here.">
              <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-sm text-muted">
                Once you save, you'll be able to upload as many photos as you like.
              </p>
            </FormCard>
          )}

          <FormCard icon={IndianRupee} title="Pricing & stock" description="What it costs, and whether you're tracking how many you have.">
            <Input label="Price (₹)" type="number" min={0} value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
            <ToggleRow
              checked={draft.stock_tracked}
              onChange={(v) => setDraft((d) => ({ ...d, stock_tracked: v }))}
              label="Track stock"
              description="Turn this on if you want to know exactly how many are left."
            />
            {draft.stock_tracked && (
              <Input
                label="Quantity in stock"
                type="number"
                min={0}
                value={draft.stock_quantity}
                onChange={(e) => setDraft((d) => ({ ...d, stock_quantity: Number(e.target.value) }))}
              />
            )}
          </FormCard>

          <FormCard icon={Sparkles} title="Personalisation" description="Let customers add their own touch — a name, a message, or their own photo.">
            <ToggleRow
              checked={draft.is_customisable}
              onChange={(v) => setDraft((d) => ({ ...d, is_customisable: v }))}
              label="Customers can personalise this"
              description="Turns on the fields below at checkout."
            />
            {draft.is_customisable && (
              <div className="flex flex-col gap-3">
                {draft.customisation_fields.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {draft.customisation_fields.map((f, i) => {
                      const FieldIcon = FIELD_TYPE_ICON[f.type];
                      return (
                        <div key={f.key + i} className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
                          <span className="flex items-center gap-2">
                            <FieldIcon size={15} strokeWidth={1.75} className="text-muted" />
                            {f.label}
                            {f.required && <span className="rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[10px] uppercase text-muted">Required</span>}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDraft((d) => ({ ...d, customisation_fields: d.customisation_fields.filter((_, idx) => idx !== i) }))}
                            className="text-muted hover:text-red-700"
                            aria-label={`Remove ${f.label}`}
                          >
                            <Trash2 size={15} strokeWidth={1.75} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-line-strong p-3">
                  <Input
                    label="What should we ask for?"
                    placeholder="e.g. Name on frame"
                    value={fieldDraft.label}
                    onChange={(e) => setFieldDraft((f) => ({ ...f, label: e.target.value, key: slugify(e.target.value) }))}
                  />
                  <Select label="Answer type" value={fieldDraft.type} onChange={(e) => setFieldDraft((f) => ({ ...f, type: e.target.value as CustomisationFieldType }))}>
                    <option value="text">Short text</option>
                    <option value="textarea">Long text</option>
                    <option value="photo">A photo upload</option>
                  </Select>
                  <label className="flex items-center gap-1.5 pb-2.5 text-sm text-ink">
                    <input type="checkbox" checked={fieldDraft.required} onChange={(e) => setFieldDraft((f) => ({ ...f, required: e.target.checked }))} />
                    Required
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fieldDraft.label.trim()) {
                        setDraft((d) => ({ ...d, customisation_fields: [...d.customisation_fields, fieldDraft] }));
                        setFieldDraft({ key: "", label: "", type: "text", required: false });
                      }
                    }}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            )}
          </FormCard>

          {!isNew && product && (
            <FormCard icon={Layers} title="Sizes & options" description="Optional — add variants like size or colour, each with its own price and stock.">
              {variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  {variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-ink">{v.name}</p>
                        <p className="text-xs text-muted">
                          {v.sku ? `SKU ${v.sku} · ` : ""}
                          {v.price_paise ? formatINR(v.price_paise) : "Base price"} · {v.stock_quantity} in stock
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteProductVariant(v.id);
                          refetch();
                        }}
                        className="text-muted hover:text-red-700"
                        aria-label={`Remove ${v.name}`}
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-line-strong p-3">
                <Input label="Name" placeholder="e.g. Large" value={variantDraft.name} onChange={(e) => setVariantDraft((v) => ({ ...v, name: e.target.value }))} />
                <Input label="SKU (optional)" value={variantDraft.sku} onChange={(e) => setVariantDraft((v) => ({ ...v, sku: e.target.value }))} />
                <Input label="Price override (₹)" type="number" value={variantDraft.price} onChange={(e) => setVariantDraft((v) => ({ ...v, price: e.target.value }))} />
                <Input label="Stock" type="number" value={variantDraft.stock} onChange={(e) => setVariantDraft((v) => ({ ...v, stock: e.target.value }))} />
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  + Add
                </Button>
              </div>
            </FormCard>
          )}

          <FormCard icon={Eye} title="Visibility">
            <ToggleRow
              checked={draft.is_published}
              onChange={(v) => setDraft((d) => ({ ...d, is_published: v }))}
              label="Published"
              description="Visible in the shop right now. Turn off to hide it while you finish setting it up."
            />
            {!isNew && (
              <ToggleRow
                checked={draft.is_archived}
                onChange={(v) => setDraft((d) => ({ ...d, is_archived: v }))}
                label="Archived"
                description="Hides it everywhere, including in your own product list search."
              />
            )}

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
            >
              <ChevronDown size={14} strokeWidth={1.75} className={cn("transition-transform", showAdvanced && "rotate-180")} />
              Advanced settings
            </button>
            {showAdvanced && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="URL slug"
                  hint="Used in the product's web address."
                  value={draft.slug}
                  onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))}
                />
                <Input
                  label="Display position"
                  hint="Lower numbers show first."
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))}
                />
              </div>
            )}
          </FormCard>

          {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

          <div className="flex items-center justify-between">
            {!isNew ? (
              <button type="button" onClick={handleDelete} className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800">
                <Trash2 size={15} strokeWidth={1.75} /> Delete product
              </button>
            ) : (
              <span />
            )}
            <Button onClick={save} disabled={isSaving} variant="gold" className="min-w-40">
              <AnimatePresence mode="wait" initial={false}>
                {justSaved ? (
                  <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                    <Check size={16} strokeWidth={2.25} /> Saved
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {isSaving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:h-fit">
          <ProductPreviewCard name={draft.name} priceInput={priceInput} categoryName={categoryName} imageUrl={images[0]?.image_url} isPublished={draft.is_published} />
        </div>
      </div>
      {dialog}
    </div>
  );
}

function FormCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Tag;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 rounded-card-lg border border-line bg-surface p-5 shadow-clay md:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Icon size={17} strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-medium text-ink">{title}</p>
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-black/[0.02] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function ProductPreviewCard({
  name,
  priceInput,
  categoryName,
  imageUrl,
  isPublished,
}: {
  name: string;
  priceInput: string;
  categoryName: string | undefined;
  imageUrl: string | undefined;
  isPublished: boolean;
}) {
  const priceLabel = priceInput ? formatINR(Math.round(Number(priceInput) * 100)) : "₹0.00";
  return (
    <div>
      <p className="mb-2 text-eyebrow uppercase tracking-[0.1em] text-muted">Customers will see</p>
      <div className="overflow-hidden rounded-card-lg border border-line bg-surface shadow-clay">
        <div className="aspect-square bg-black/5">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
              <ImagePlus size={28} strokeWidth={1.5} />
              <span className="text-xs">Photo preview</span>
            </div>
          )}
        </div>
        <div className="p-5">
          {categoryName && <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">{categoryName}</p>}
          <p className="mt-1 text-base font-medium text-ink">{name || "Product name"}</p>
          <p className="mt-1 text-sm font-medium text-gold-deep">{priceLabel}</p>
        </div>
      </div>
      {!isPublished && (
        <p className="mt-2 text-center text-xs text-muted">Hidden from the shop until you publish it.</p>
      )}
    </div>
  );
}
