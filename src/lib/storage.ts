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

/** Uploads an image to a public bucket and returns its public URL. */
export async function uploadPublicImage(bucket: PublicBucket, file: File, folder = ""): Promise<string> {
  assertValidImage(file);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder ? `${folder}/` : ""}${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
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
