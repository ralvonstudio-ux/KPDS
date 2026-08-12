import { Link } from "react-router-dom";
import { useAdminProducts, updateProduct, deleteProduct } from "@/features/admin/products/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";

export default function AdminProductsListPage() {
  const { data: products, isLoading, error, refetch } = useAdminProducts();
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete product?",
      description: `"${name}", its images, and variants will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteProduct(id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Shop"
        title="Products"
        action={<ButtonLink to="/admin/products/new">+ New Product</ButtonLink>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && products && products.length === 0 && (
        <EmptyState title="No products yet" description="Add your first gift or print product." />
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.categories?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatINR(p.base_price_paise)}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={p.is_published}
                      onChange={async (val) => {
                        await updateProduct(p.id, { is_published: val });
                        refetch();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}`} className="mr-3 text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-xs font-medium text-red-700 underline underline-offset-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {dialog}
    </div>
  );
}
