import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Booking = Tables<"bookings">;
export type BookingWithService = Booking & { services: { title: string } | null };
export type Quotation = Tables<"quotations">;
export type QuotationItem = Tables<"quotation_items">;
export type StatusHistoryEntry = Tables<"booking_status_history">;
export type Payment = Tables<"payments">;
export type TeamMember = Tables<"team_members">;
export type BookingAssignment = Tables<"booking_assignments"> & { team_members: TeamMember | null };

export function useCustomerBookings() {
  const [data, setData] = useState<BookingWithService[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setData((data as BookingWithService[]) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useCustomerBookingDetail(id: string | undefined) {
  const [booking, setBooking] = useState<BookingWithService | null>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [assignments, setAssignments] = useState<BookingAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const [bookingRes, quotationRes, historyRes, paymentsRes, assignmentsRes] = await Promise.all([
      supabase.from("bookings").select("*, services(title)").eq("id", id).single(),
      // RLS only exposes published/accepted quotations to the customer — a draft stays admin-only.
      supabase.from("quotations").select("*").eq("booking_id", id).maybeSingle(),
      supabase.from("booking_status_history").select("*").eq("booking_id", id).order("created_at", { ascending: true }),
      supabase.from("payments").select("*").eq("booking_id", id).order("created_at", { ascending: true }),
      supabase.from("booking_assignments").select("*, team_members(*)").eq("booking_id", id),
    ]);

    if (bookingRes.error) setError(bookingRes.error.message);
    else setBooking(bookingRes.data as BookingWithService);

    setQuotation(quotationRes.data ?? null);
    setHistory(historyRes.data ?? []);
    setPayments(paymentsRes.data ?? []);
    setAssignments((assignmentsRes.data as BookingAssignment[]) ?? []);

    if (quotationRes.data) {
      const { data: itemsData } = await supabase
        .from("quotation_items")
        .select("*")
        .eq("quotation_id", quotationRes.data.id)
        .order("sort_order", { ascending: true });
      setItems(itemsData ?? []);
    } else {
      setItems([]);
    }

    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { booking, quotation, items, history, payments, assignments, isLoading, error, refetch };
}

/** Calls the accept_quotation() Postgres function — the only way a
 * quotation can move to "accepted" (see supabase/migrations for the
 * ownership + status checks it enforces server-side). */
export async function acceptQuotation(quotationId: string) {
  const { error } = await supabase.rpc("accept_quotation", { p_quotation_id: quotationId });
  if (error) throw new Error(error.message);
}
