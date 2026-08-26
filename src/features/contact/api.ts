import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type ContactMessage = Tables<"contact_messages">;

/** Submits a general enquiry from the public Contact page. Anyone may call
 * this, logged in or not — see the `contact_messages_public_insert` RLS
 * policy in supabase/migrations/20260826000001_contact_messages.sql. */
export async function submitContactMessage(input: { name: string; email: string; phone?: string; message: string }) {
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message,
  });
  if (error) throw new Error(error.message);
}

/** Admin-only list of submitted enquiries, newest first. */
export function useAdminContactMessages() {
  const [data, setData] = useState<ContactMessage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export async function markContactMessageRead(id: string, isRead: boolean) {
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
}
