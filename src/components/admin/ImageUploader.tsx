import { useRef, useState } from "react";
import { uploadPublicImage, type PublicBucket } from "@/lib/storage";
import { Spinner } from "@/components/ui/States";

/** Single-image upload field: shows the current image, lets you replace or remove it. */
export function ImageUploader({
  bucket,
  folder,
  value,
  onChange,
  label,
  aspect = "aspect-video",
}: {
  bucket: PublicBucket;
  folder?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadPublicImage(bucket, file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>}
      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-dashed border-line-strong bg-black/[0.02]`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">No image</div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Spinner />
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-ink hover:border-espresso disabled:opacity-50"
        >
          {value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

/** Multi-image gallery: add several images, each removable independently. */
export function GalleryUploader({
  bucket,
  folder,
  images,
  onAdd,
  onRemove,
}: {
  bucket: PublicBucket;
  folder?: string;
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadPublicImage(bucket, file, folder);
        onAdd(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-black/5">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute right-1 top-1 rounded-full bg-espresso/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-line-strong text-xs text-muted hover:border-espresso disabled:opacity-50"
        >
          {isUploading ? <Spinner className="h-4 w-4" /> : "+ Add"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
        }}
      />
    </div>
  );
}
