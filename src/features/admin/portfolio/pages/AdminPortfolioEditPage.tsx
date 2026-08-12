import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type PortfolioDraft,
} from "@/features/admin/portfolio/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploader, GalleryUploader } from "@/components/admin/ImageUploader";
import { Toggle } from "@/components/admin/Toggle";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";

const emptyDraft: PortfolioDraft = {
  title: "",
  category: "",
  description: "",
  cover_image_url: "",
  gallery: [],
  is_published: true,
  sort_order: 0,
};

export default function AdminPortfolioEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();

  const { item, isLoading, error, refetch } = useAdminPortfolioItem(isNew ? undefined : id);
  const [draft, setDraft] = useState<PortfolioDraft>(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setDraft({
        title: item.title,
        category: item.category,
        description: item.description,
        cover_image_url: item.cover_image_url,
        gallery: item.gallery,
        is_published: item.is_published,
        sort_order: item.sort_order,
      });
    }
  }, [item]);

  if (!isNew && isLoading) return <LoadingState />;
  if (!isNew && error) return <ErrorState description={error} onRetry={refetch} />;

  const save = async () => {
    setFormError(null);
    if (!draft.category.trim() || !draft.cover_image_url) {
      setFormError("Category and a cover image are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (isNew) {
        const created = await createPortfolioItem(draft);
        navigate(`/admin/portfolio/${created.id}`, { replace: true });
      } else if (id) {
        await updatePortfolioItem(id, draft);
        refetch();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    const ok = await confirm({
      title: "Delete portfolio item?",
      description: "This will be permanently removed from the gallery.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deletePortfolioItem(item.id);
    navigate("/admin/portfolio");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader eyebrow="Studio" title={isNew ? "New Portfolio Item" : "Edit Portfolio Item"} />

      <div className="flex flex-col gap-5 rounded-card-lg border border-line bg-surface p-6 md:p-8">
        <ImageUploader
          label="Cover image"
          bucket="portfolio"
          value={draft.cover_image_url || null}
          onChange={(url) => setDraft((d) => ({ ...d, cover_image_url: url ?? "" }))}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Title (optional)"
            value={draft.title ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <Input
            label="Category"
            required
            hint="e.g. Weddings, Portraits, Corporate"
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
          />
        </div>

        <Textarea
          label="Description (optional)"
          value={draft.description ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Additional gallery images (optional)</p>
          <GalleryUploader
            bucket="portfolio"
            images={draft.gallery}
            onAdd={(url) => setDraft((d) => ({ ...d, gallery: [...d.gallery, url] }))}
            onRemove={(url) => setDraft((d) => ({ ...d, gallery: d.gallery.filter((g) => g !== url) }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sort order"
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))}
          />
          <div className="flex items-end gap-2 pb-2.5">
            <Toggle checked={draft.is_published} onChange={(v) => setDraft((d) => ({ ...d, is_published: v }))} />
            <span className="text-sm text-ink">Published</span>
          </div>
        </div>

        {formError && <p className="text-sm text-red-700">{formError}</p>}

        <div className="flex items-center justify-between border-t border-line pt-5">
          {!isNew && (
            <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-700">
              Delete item
            </button>
          )}
          <Button onClick={save} disabled={isSaving} className="ml-auto">
            {isSaving ? "Saving…" : isNew ? "Create Item" : "Save Changes"}
          </Button>
        </div>
      </div>
      {dialog}
    </div>
  );
}
