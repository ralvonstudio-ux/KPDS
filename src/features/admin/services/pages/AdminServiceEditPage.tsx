import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminService,
  createService,
  updateService,
  deleteService,
  addServiceGalleryImage,
  removeServiceGalleryImage,
  type ServiceDraft,
} from "@/features/admin/services/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploader, GalleryUploader } from "@/components/admin/ImageUploader";
import { Toggle } from "@/components/admin/Toggle";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { slugify } from "@/lib/utils";

const emptyDraft: ServiceDraft = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  cover_image_url: null,
  deliverables: [],
  starting_price_paise: null,
  is_custom_quote: false,
  faqs: [],
  is_published: true,
  sort_order: 0,
};

export default function AdminServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();

  const { service, gallery, isLoading, error, refetch } = useAdminService(isNew ? undefined : id);
  const [draft, setDraft] = useState<ServiceDraft>(emptyDraft);
  const [priceInput, setPriceInput] = useState("");
  const [deliverableInput, setDeliverableInput] = useState("");
  const [faqDraft, setFaqDraft] = useState({ question: "", answer: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setDraft({
        title: service.title,
        slug: service.slug,
        summary: service.summary ?? "",
        description: service.description ?? "",
        cover_image_url: service.cover_image_url,
        deliverables: service.deliverables,
        starting_price_paise: service.starting_price_paise,
        is_custom_quote: service.is_custom_quote,
        faqs: service.faqs,
        is_published: service.is_published,
        sort_order: service.sort_order,
      });
      setPriceInput(service.starting_price_paise ? String(service.starting_price_paise / 100) : "");
    }
  }, [service]);

  if (!isNew && isLoading) return <LoadingState />;
  if (!isNew && error) return <ErrorState description={error} onRetry={refetch} />;

  const save = async () => {
    setFormError(null);
    if (!draft.title.trim() || !draft.slug.trim()) {
      setFormError("Title and slug are required.");
      return;
    }
    setIsSaving(true);
    const payload: ServiceDraft = {
      ...draft,
      starting_price_paise: priceInput ? Math.round(Number(priceInput) * 100) : null,
    };
    try {
      if (isNew) {
        const created = await createService(payload);
        navigate(`/admin/services/${created.id}`, { replace: true });
      } else if (id) {
        await updateService(id, payload);
        refetch();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    const ok = await confirm({
      title: "Delete service?",
      description: `"${service.title}" and its gallery will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteService(service.id);
    navigate("/admin/services");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Studio" title={isNew ? "New Service" : "Edit Service"} />

      <div className="flex flex-col gap-5 rounded-card-lg border border-line bg-surface p-6 md:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Title"
            required
            value={draft.title}
            onChange={(e) => {
              const title = e.target.value;
              setDraft((d) => ({ ...d, title, slug: d.slug || slugify(title) }));
            }}
          />
          <Input
            label="Slug"
            required
            value={draft.slug}
            onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))}
          />
        </div>

        <Input
          label="Summary (shown on cards)"
          value={draft.summary}
          onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
        />
        <Textarea
          label="Full description"
          className="min-h-40"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />

        <ImageUploader
          label="Cover image"
          bucket="services"
          value={draft.cover_image_url}
          onChange={(url) => setDraft((d) => ({ ...d, cover_image_url: url }))}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Deliverables</p>
          <div className="flex flex-wrap gap-2">
            {draft.deliverables.map((item, i) => (
              <span key={item + i} className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-ink">
                {item}
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, deliverables: d.deliverables.filter((_, idx) => idx !== i) }))}
                  aria-label={`Remove ${item}`}
                  className="text-muted hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="e.g. 500 edited photos"
              value={deliverableInput}
              onChange={(e) => setDeliverableInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (deliverableInput.trim()) {
                    setDraft((d) => ({ ...d, deliverables: [...d.deliverables, deliverableInput.trim()] }));
                    setDeliverableInput("");
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (deliverableInput.trim()) {
                  setDraft((d) => ({ ...d, deliverables: [...d.deliverables, deliverableInput.trim()] }));
                  setDeliverableInput("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Starting price (₹)"
            type="number"
            min={0}
            disabled={draft.is_custom_quote}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            hint="Leave blank for custom-quote-only services."
          />
          <div className="flex items-end gap-2 pb-2.5">
            <Toggle checked={draft.is_custom_quote} onChange={(v) => setDraft((d) => ({ ...d, is_custom_quote: v }))} />
            <span className="text-sm text-ink">Custom quote only</span>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">FAQs</p>
          <div className="flex flex-col gap-2">
            {draft.faqs.map((faq, i) => (
              <div key={faq.question + i} className="flex items-start justify-between gap-3 rounded-lg border border-line px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-ink">{faq.question}</p>
                  <p className="text-xs text-muted">{faq.answer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, faqs: d.faqs.filter((_, idx) => idx !== i) }))}
                  className="shrink-0 text-xs font-medium text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2 rounded-lg border border-dashed border-line-strong p-3">
            <Input
              placeholder="Question"
              value={faqDraft.question}
              onChange={(e) => setFaqDraft((f) => ({ ...f, question: e.target.value }))}
            />
            <Textarea
              placeholder="Answer"
              value={faqDraft.answer}
              onChange={(e) => setFaqDraft((f) => ({ ...f, answer: e.target.value }))}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => {
                if (faqDraft.question.trim() && faqDraft.answer.trim()) {
                  setDraft((d) => ({ ...d, faqs: [...d.faqs, faqDraft] }));
                  setFaqDraft({ question: "", answer: "" });
                }
              }}
            >
              Add FAQ
            </Button>
          </div>
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

        {!isNew && service && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Gallery</p>
            <GalleryUploader
              bucket="services"
              folder={service.id}
              images={gallery.map((g) => g.image_url)}
              onAdd={async (url) => {
                await addServiceGalleryImage(service.id, url, gallery.length);
                refetch();
              }}
              onRemove={async (url) => {
                const img = gallery.find((g) => g.image_url === url);
                if (img) {
                  await removeServiceGalleryImage(img.id);
                  refetch();
                }
              }}
            />
          </div>
        )}

        {formError && <p className="text-sm text-red-700">{formError}</p>}

        <div className="flex items-center justify-between border-t border-line pt-5">
          {!isNew && (
            <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-700">
              Delete service
            </button>
          )}
          <Button onClick={save} disabled={isSaving} className="ml-auto">
            {isSaving ? "Saving…" : isNew ? "Create Service" : "Save Changes"}
          </Button>
        </div>
      </div>
      {dialog}
    </div>
  );
}
