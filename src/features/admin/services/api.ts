import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Faq, Tables } from "@/types/database";

export type Service = Tables<"services">;
export type ServiceGalleryImage = Tables<"service_gallery">;

export interface ServiceDraft {
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image_url: string | null;
  deliverables: string[];
  starting_price_paise: number | null;
  is_custom_quote: boolean;
  faqs: Faq[];
  is_published: boolean;
  sort_order: number;
}

export function useAdminServices() {
  const [data, setData] = useState<Service[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useAdminService(id: string | undefined) {
  const [service, setService] = useState<Service | null>(null);
  const [gallery, setGallery] = useState<ServiceGalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const [serviceRes, galleryRes] = await Promise.all([
      supabase.from("services").select("*").eq("id", id).single(),
      supabase.from("service_gallery").select("*").eq("service_id", id).order("sort_order", { ascending: true }),
    ]);
    if (serviceRes.error) setError(serviceRes.error.message);
    else setService(serviceRes.data);
    setGallery(galleryRes.data ?? []);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { service, gallery, isLoading, error, refetch };
}

export async function createService(draft: ServiceDraft): Promise<Service> {
  const { data, error } = await supabase.from("services").insert(draft).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateService(id: string, draft: Partial<ServiceDraft>): Promise<Service> {
  const { data, error } = await supabase.from("services").update(draft).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addServiceGalleryImage(
  serviceId: string,
  imageUrl: string,
  sortOrder: number,
): Promise<ServiceGalleryImage> {
  const { data, error } = await supabase
    .from("service_gallery")
    .insert({ service_id: serviceId, image_url: imageUrl, sort_order: sortOrder })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeServiceGalleryImage(imageId: string): Promise<void> {
  const { error } = await supabase.from("service_gallery").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
}
