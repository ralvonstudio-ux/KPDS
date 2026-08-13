import { Link } from "react-router-dom";
import { useAdminServices, updateService, deleteService } from "@/features/admin/services/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";

export default function AdminServicesListPage() {
  const { data: services, isLoading, error, refetch } = useAdminServices();
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete service?",
      description: `"${title}" and its gallery images will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteService(id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Services"
        action={<ButtonLink to="/admin/services/new">+ New Service</ButtonLink>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && services && services.length === 0 && (
        <EmptyState title="No services yet" description="Create your first service package." />
      )}

      {!isLoading && !error && services && services.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Pricing</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      {s.cover_image_url && <img src={s.cover_image_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    {s.title}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {s.is_custom_quote || !s.starting_price_paise ? "Custom quote" : formatINR(s.starting_price_paise)}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={s.is_published}
                      onChange={async (val) => {
                        await updateService(s.id, { is_published: val });
                        refetch();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/services/${s.id}`} className="mr-3 text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(s.id, s.title)} className="text-xs font-medium text-red-700 underline underline-offset-2">
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
