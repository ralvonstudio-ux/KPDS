import { supabase } from "@/lib/supabase";

/** Buckets created in supabase/migrations/20260811000013_storage.sql and
 * supabase/migrations/20260826000002_hero_images.sql (hero). */
export type PublicBucket = "services" | "portfolio" | "products" | "hero";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB — comfortably under Storage's 10MB limit.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function assertValidImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or AVIF image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large — please keep it under 8MB.");
  }
}

const MAX_UPLOAD_DIMENSION = 1920; // px, longest side — plenty for a full-bleed hero image
const SKIP_COMPRESSION_UNDER_BYTES = 400 * 1024; // already small enough, not worth the CPU

/**
 * Downscales/re-encodes an image client-side before it ever reaches
 * storage, so a phone photo someone uploads from /admin (often 4000px+ and
 * several MB) doesn't ship that full size to every visitor's browser. Runs
 * entirely in the browser via Canvas — no new dependency. Falls back to the
 * original file on any failure (unsupported format, canvas error) or if
 * compression didn't actually save anything, so a compression bug can
 * never block an upload the old code path would have accepted.
 */
async function compressImage(file: File, maxDimension = MAX_UPLOAD_DIMENSION, quality = 0.82): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < SKIP_COMPRESSION_UNDER_BYTES) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob || blob.size >= file.size) return file; // never ship something bigger than the original

    const newName = `${file.name.replace(/\.[^./]+$/, "")}.webp`;
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    return file;
  }
}

/** Uploads an image to a public bucket and returns its public URL.
 * Compresses client-side first — see compressImage above. */
export async function uploadPublicImage(bucket: PublicBucket, file: File, folder = ""): Promise<string> {
  assertValidImage(file);
  const upload = await compressImage(file);
  const ext = upload.name.split(".").pop() || "jpg";
  const path = `${folder ? `${folder}/` : ""}${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, upload, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Uploads a customer's personalisation photo to the private customer-uploads
 * bucket, under a folder named after their own user id (the storage policy
 * in supabase/migrations/20260811000013_storage.sql only lets a user read/
 * write inside their own folder). Returns the storage PATH, not a public
 * URL — this bucket is private, so viewing it later needs a signed URL.
 */
export async function uploadCustomerFile(userId: string, file: File): Promise<string> {
  assertValidImage(file);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("customer-uploads").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

/** Short-lived signed URL for a private customer upload — safe to render inline. */
export async function getSignedCustomerFileUrl(path: string, expiresInSeconds = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage.from("customer-uploads").createSignedUrl(path, expiresInSeconds);
  if (error) {
    console.error("[storage] Failed to sign customer upload URL:", error.message);
    return null;
  }
  return data.signedUrl;
}

/** Best-effort delete — failures are logged, not thrown, so a broken image
 * reference never blocks the row edit/delete the user actually asked for. */
export async function deletePublicImage(bucket: PublicBucket, publicUrl: string): Promise<void> {
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error(`[storage] Failed to delete ${bucket}/${path}:`, error.message);
}
