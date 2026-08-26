import { useState } from "react";
import {
  useAdminHeroImages,
  createHeroImage,
  updateHeroImage,
  deleteHeroImage,
  type HeroImage,
} from "@/features/admin/hero/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Toggle } from "@/components/admin/Toggle";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/ui/Field";
import { LoadingState, ErrorState } from "@/components/ui/States";

/**
 * Fully self-serve homepage hero carousel — no code changes needed to
 * change what visitors see first. While this list is empty, the public
 * Hero component (src/features/home/Hero.tsx) quietly falls back to a
 * placeholder set instead of rendering blank, so there is never a broken
 * moment either way.
 */
export default function AdminHeroImagesListPage() {
  const { data: images, isLoading, error, refetch } = useAdminHeroImages();
  const { confirm, dialog } = useConfirm();
  const [addError, setAddError] = useState<string | null>(null);

  const handleAdd = async (url: string | null) => {
    if (!url) return;
    setAddError(null);
    try {
      const nextSortOrder = (images ?? []).reduce((max, i) => Math.max(max, i.sort_order), -1) + 1;
      await createHeroImage({ image_url: url, sort_order: nextSortOrder });
      refetch();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add image.");
    }
  };

  const handleDelete = async (image: HeroImage) => {
    const ok = await confirm({
      title: "Remove hero photo?",
      description: "It will stop showing on the homepage carousel.",
      confirmLabel: "Remove",
      destructive: true,
    });
    if (!ok) return;
    await deleteHeroImage(image.id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader eyebrow="Content" title="Homepage Hero" />
      <p className="-mt-6 mb-8 max-w-xl text-sm text-muted">
        The rotating photos in the homepage hero. Add a few of your best shots — they cycle automatically, no code
        changes needed. While this is empty, the homepage shows placeholder photos instead.
      </p>

      <div className="mb-8 rounded-card-lg border border-dashed border-line-strong bg-surface p-6">
        <ImageUploader label="Add a hero photo" bucket="hero" aspect="aspect-video" value={null} onChange={handleAdd} />
        {addError && <p className="mt-2 text-sm text-red-700">{addError}</p>}
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}

      {!isLoading && !error && images && images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <HeroImageCard
              key={image.id}
              image={image}
              onChange={async (patch) => {
                await updateHeroImage(image.id, patch);
                refetch();
              }}
              onDelete={() => handleDelete(image)}
            />
          ))}
        </div>
      )}

      {dialog}
    </div>
  );
}

function HeroImageCard({
  image,
  onChange,
  onDelete,
}: {
  image: HeroImage;
  onChange: (patch: { image_url?: string; alt_text?: string; sort_order?: number; is_published?: boolean }) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 shadow-clay">
      <ImageUploader
        bucket="hero"
        aspect="aspect-video"
        value={image.image_url}
        onChange={(url) => (url ? onChange({ image_url: url }) : onDelete())}
      />
      <Input
        label="Alt text (for accessibility)"
        defaultValue={image.alt_text ?? ""}
        onBlur={(e) => onChange({ alt_text: e.target.value })}
        placeholder="e.g. A KPDS wedding photography moment"
      />
      <div className="flex items-center justify-between gap-4">
        <Input
          label="Order"
          type="number"
          defaultValue={image.sort_order}
          onBlur={(e) => onChange({ sort_order: Number(e.target.value) })}
          className="w-24"
        />
        <div className="flex items-center gap-2 pb-2.5">
          <Toggle checked={image.is_published} onChange={(v) => onChange({ is_published: v })} />
          <span className="text-sm text-ink">Published</span>
        </div>
      </div>
    </div>
  );
}
