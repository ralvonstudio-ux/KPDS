import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GalleryUploader } from "@/components/admin/ImageUploader";
import { Toggle } from "@/components/admin/Toggle";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { slugify, formatINR } from "@/lib/utils";
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
  const [formError, setFormError] = useState<string | null>(null);
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

  const save = async () => {
    setFormError(null);
    if (!draft.name.trim() || !draft.slug.trim()) {
      setFormError("Name and slug are required.");
      return;
    }
    setIsSaving(true);
    const payload: ProductDraft = { ...draft, base_price_paise: Math.round(Number(priceInput) * 100) };
    try {
      if (isNew) {
        const created = await createProduct(payload);
        navigate(`/admin/products/${created.id}`, { replace: true });
      } else if (id) {
        await updateProduct(id, payload);
        refetch();
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
      description: `"${product.name}" and all of its images/variants will be permanently removed.`,
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
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Shop" title={isNew ? "New Product" : "Edit Product"} />

      <div className="flex flex-col gap-5 rounded-card-lg border border-line bg-surface p-6 md:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Name"
            required
            value={draft.name}
            onChange={(e) => {
              const name = e.target.value;
              setDraft((d) => ({ ...d, name, slug: d.slug || slugify(name) }));
            }}
          />
          <Input
            label="Slug"
            required
            value={draft.slug}
            onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))}
          />
        </div>

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
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Base price (₹)" type="number" min={0} value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
          <div className="flex items-end gap-2 pb-2.5">
            <Toggle checked={draft.stock_tracked} onChange={(v) => setDraft((d) => ({ ...d, stock_tracked: v }))} />
            <span className="text-sm text-ink">Track stock</span>
          </div>
        </div>
        {draft.stock_tracked && (
          <Input
            label="Stock quantity"
            type="number"
            min={0}
            value={draft.stock_quantity}
            onChange={(e) => setDraft((d) => ({ ...d, stock_quantity: Number(e.target.value) }))}
          />
        )}

        <div className="flex items-center gap-2">
          <Toggle checked={draft.is_customisable} onChange={(v) => setDraft((d) => ({ ...d, is_customisable: v }))} />
          <span className="text-sm text-ink">Customer can personalise this product</span>
        </div>

        {draft.is_customisable && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Customisation fields</p>
            <div className="flex flex-col gap-2">
              {draft.customisation_fields.map((f, i) => (
                <div key={f.key + i} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
                  <span>
                    {f.label} <span className="text-muted">({f.type}{f.required ? ", required" : ""})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, customisation_fields: d.customisation_fields.filter((_, idx) => idx !== i) }))}
                    className="text-xs font-medium text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-line-strong p-3">
              <Input
                label="Label"
                placeholder="e.g. Name on frame"
                value={fieldDraft.label}
                onChange={(e) => setFieldDraft((f) => ({ ...f, label: e.target.value, key: slugify(e.target.value) }))}
              />
              <Select
                label="Type"
                value={fieldDraft.type}
                onChange={(e) => setFieldDraft((f) => ({ ...f, type: e.target.value as CustomisationFieldType }))}
              >
                <option value="text">Short text</option>
                <option value="textarea">Long text</option>
                <option value="photo">Photo upload</option>
              </Select>
              <label className="flex items-center gap-1.5 pb-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={fieldDraft.required}
                  onChange={(e) => setFieldDraft((f) => ({ ...f, required: e.target.checked }))}
                />
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
                Add field
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sort order"
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))}
          />
          <div className="flex items-end gap-4 pb-2.5">
            <div className="flex items-center gap-2">
              <Toggle checked={draft.is_published} onChange={(v) => setDraft((d) => ({ ...d, is_published: v }))} />
              <span className="text-sm text-ink">Published</span>
            </div>
          </div>
        </div>

        {!isNew && product && (
          <>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">Images</p>
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
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">Variants (optional)</p>
              {variants.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-line">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line bg-black/[0.02] text-left text-xs uppercase text-muted">
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">SKU</th>
                        <th className="px-3 py-2 font-medium">Price override</th>
                        <th className="px-3 py-2 font-medium">Stock</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v) => (
                        <tr key={v.id} className="border-b border-line last:border-0">
                          <td className="px-3 py-2">{v.name}</td>
                          <td className="px-3 py-2 text-muted">{v.sku || "—"}</td>
                          <td className="px-3 py-2 text-muted">{v.price_paise ? formatINR(v.price_paise) : "Base price"}</td>
                          <td className="px-3 py-2 text-muted">{v.stock_quantity}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteProductVariant(v.id);
                                refetch();
                              }}
                              className="text-xs font-medium text-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-line-strong p-3">
                <Input label="Name" placeholder="e.g. Large" value={variantDraft.name} onChange={(e) => setVariantDraft((v) => ({ ...v, name: e.target.value }))} />
                <Input label="SKU" value={variantDraft.sku} onChange={(e) => setVariantDraft((v) => ({ ...v, sku: e.target.value }))} />
                <Input label="Price override (₹)" type="number" value={variantDraft.price} onChange={(e) => setVariantDraft((v) => ({ ...v, price: e.target.value }))} />
                <Input label="Stock" type="number" value={variantDraft.stock} onChange={(e) => setVariantDraft((v) => ({ ...v, stock: e.target.value }))} />
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  Add variant
                </Button>
              </div>
            </div>
          </>
        )}

        {formError && <p className="text-sm text-red-700">{formError}</p>}

        <div className="flex items-center justify-between border-t border-line pt-5">
          {!isNew ? (
            <div className="flex items-center gap-4">
              <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-700">
                Delete product
              </button>
              <label className="flex items-center gap-1.5 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={draft.is_archived}
                  onChange={(e) => setDraft((d) => ({ ...d, is_archived: e.target.checked }))}
                />
                Archived
              </label>
            </div>
          ) : (
            <span />
          )}
          <Button onClick={save} disabled={isSaving} className="ml-auto">
            {isSaving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>
      {dialog}
    </div>
  );
}
