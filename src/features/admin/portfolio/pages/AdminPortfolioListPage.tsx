import { Link } from "react-router-dom";
import { useAdminPortfolio, updatePortfolioItem, deletePortfolioItem } from "@/features/admin/portfolio/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";

export default function AdminPortfolioListPage() {
  const { data: items, isLoading, error, refetch } = useAdminPortfolio();
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string, title: string | null) => {
    const ok = await confirm({
      title: "Delete portfolio item?",
      description: `"${title ?? "This item"}" will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deletePortfolioItem(id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Portfolio"
        action={<ButtonLink to="/admin/portfolio/new">+ New Item</ButtonLink>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && items && items.length === 0 && (
        <EmptyState title="No portfolio items yet" description="Add your first project to the gallery." />
      )}

      {!isLoading && !error && items && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="aspect-square bg-black/5">
                <img src={item.cover_image_url} alt={item.title ?? ""} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink">{item.title || "Untitled"}</p>
                <p className="text-xs text-muted">{item.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Toggle
                    checked={item.is_published}
                    onChange={async (val) => {
                      await updatePortfolioItem(item.id, { is_published: val });
                      refetch();
                    }}
                  />
                  <div className="flex gap-2">
                    <Link to={`/admin/portfolio/${item.id}`} className="text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(item.id, item.title)} className="text-xs font-medium text-red-700 underline underline-offset-2">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}
