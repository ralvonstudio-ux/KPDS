import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ImageOff } from "lucide-react";
import { useAdminProducts, updateProduct, deleteProduct } from "@/features/admin/products/api";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";
import { fadeUp, staggerChildren } from "@/lib/motion";

export default function AdminProductsListPage() {
  const { data: products, isLoading, error, refetch } = useAdminProducts();
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete product?",
      description: `"${name}", its photos, and options will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteProduct(id);
    refetch();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">Shop</p>
          <h1 className="mt-1 text-display-md text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted">Everything you sell in the gift shop.</p>
        </div>
        <ButtonLink to="/admin/products/new" variant="gold" className="flex items-center gap-1.5">
          <Plus size={16} strokeWidth={2} /> Add product
        </ButtonLink>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && products && products.length === 0 && (
        <EmptyState
          title="No products yet"
          description="Add your first gift or print product to get the shop started."
          action={
            <ButtonLink to="/admin/products/new" variant="gold" className="mt-2">
              Add your first product
            </ButtonLink>
          }
        />
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={fadeUp} className="group overflow-hidden rounded-card border border-line bg-surface shadow-clay">
              <Link to={`/admin/products/${p.id}`} className="block">
                <div className="aspect-square bg-black/5">
                  {p.product_images[0] ? (
                    <img src={p.product_images[0].image_url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <ImageOff size={22} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                <p className="text-xs text-muted">{p.categories?.name ?? "No category"} · {formatINR(p.base_price_paise)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Toggle
                    checked={p.is_published}
                    onChange={async (val) => {
                      await updateProduct(p.id, { is_published: val });
                      refetch();
                    }}
                    label={`${p.name} published`}
                  />
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${p.id}`} className="text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-xs font-medium text-red-700 underline underline-offset-2">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {dialog}
    </div>
  );
}
