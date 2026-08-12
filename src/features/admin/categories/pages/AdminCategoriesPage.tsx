import { useState } from "react";
import {
  useAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/features/admin/categories/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { slugify } from "@/lib/utils";

const emptyDraft = {
  name: "",
  slug: "",
  description: "",
  cover_image_url: null as string | null,
  is_published: true,
  sort_order: 0,
};

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error, refetch } = useAdminCategories();
  const { confirm, dialog } = useConfirm();
  const [editing, setEditing] = useState<Category | null | typeof emptyDraft>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setDraft(emptyDraft);
    setEditing(emptyDraft);
  };

  const openEdit = (category: Category) => {
    setDraft({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      cover_image_url: category.cover_image_url,
      is_published: category.is_published,
      sort_order: category.sort_order,
    });
    setEditing(category);
  };

  const close = () => setEditing(null);

  const save = async () => {
    setFormError(null);
    if (!draft.name.trim() || !draft.slug.trim()) {
      setFormError("Name and slug are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing && "id" in editing) {
        await updateCategory(editing.id, draft);
      } else {
        await createCategory(draft);
      }
      close();
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const ok = await confirm({
      title: "Delete category?",
      description: `"${category.name}" will be removed. Products in this category will keep their data but lose their category link.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteCategory(category.id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Shop"
        title="Categories"
        action={<Button onClick={openCreate}>+ New Category</Button>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && categories && categories.length === 0 && (
        <EmptyState title="No categories yet" description="Create your first product category to get started." />
      )}

      {!isLoading && !error && categories && categories.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      {c.cover_image_url && <img src={c.cover_image_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={c.is_published}
                      onChange={async (val) => {
                        await updateCategory(c.id, { is_published: val });
                        refetch();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted">{c.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="mr-3 text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c)} className="text-xs font-medium text-red-700 underline underline-offset-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={close} title={editing && "id" in editing ? "Edit Category" : "New Category"}>
        <div className="flex flex-col gap-4">
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
          <Textarea
            label="Description"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
          <ImageUploader
            label="Cover image"
            bucket="products"
            folder="categories"
            value={draft.cover_image_url}
            onChange={(url) => setDraft((d) => ({ ...d, cover_image_url: url }))}
          />
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
          <Button onClick={save} disabled={isSaving} className="mt-2 w-full">
            {isSaving ? "Saving…" : "Save Category"}
          </Button>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
