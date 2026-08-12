import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { BookingStatus, Tables } from "@/types/database";

export type Booking = Tables<"bookings">;
export type BookingWithService = Booking & { services: { title: string } | null };
export type Quotation = Tables<"quotations">;
export type QuotationItem = Tables<"quotation_items">;
export type StatusHistoryEntry = Tables<"booking_status_history">;
export type TeamMember = Tables<"team_members">;
export type BookingAssignment = Tables<"booking_assignments"> & { team_members: TeamMember | null };
export type Payment = Tables<"payments">;

export function useAdminBookings(filters: { status?: BookingStatus | "all"; search?: string } = {}) {
  const [data, setData] = useState<BookingWithService[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let query = supabase
      .from("bookings")
      .select("*, services(title)")
      .order("created_at", { ascending: false });
    if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.or(`full_name.ilike.${term},booking_reference.ilike.${term},email.ilike.${term}`);
    }
    const { data, error } = await query;
    if (error) setError(error.message);
    else setData((data as BookingWithService[]) ?? []);
    setIsLoading(false);
  }, [filters.status, filters.search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useAdminBookingDetail(id: string | undefined) {
  const [booking, setBooking] = useState<BookingWithService | null>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [assignments, setAssignments] = useState<BookingAssignment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const [bookingRes, quotationRes, historyRes, assignmentsRes, paymentsRes] = await Promise.all([
      supabase.from("bookings").select("*, services(title)").eq("id", id).single(),
      supabase.from("quotations").select("*").eq("booking_id", id).maybeSingle(),
      supabase.from("booking_status_history").select("*").eq("booking_id", id).order("created_at", { ascending: true }),
      supabase.from("booking_assignments").select("*, team_members(*)").eq("booking_id", id),
      supabase.from("payments").select("*").eq("booking_id", id).order("created_at", { ascending: true }),
    ]);

    if (bookingRes.error) setError(bookingRes.error.message);
    else setBooking(bookingRes.data as BookingWithService);

    setQuotation(quotationRes.data ?? null);
    setHistory(historyRes.data ?? []);
    setAssignments((assignmentsRes.data as BookingAssignment[]) ?? []);
    setPayments(paymentsRes.data ?? []);

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

  return { booking, quotation, items, history, assignments, payments, isLoading, error, refetch };
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getOrCreateQuotation(bookingId: string): Promise<Quotation> {
  const { data: existing } = await supabase.from("quotations").select("*").eq("booking_id", bookingId).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase.from("quotations").insert({ booking_id: bookingId }).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateQuotationMeta(id: string, input: { discount_paise?: number; gst_percent?: number; notes?: string }) {
  const { error } = await supabase.from("quotations").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addQuotationItem(quotationId: string, input: { label: string; quantity: number; unit_price_paise: number; sort_order: number }) {
  const { error } = await supabase.from("quotation_items").insert({
    quotation_id: quotationId,
    label: input.label,
    quantity: input.quantity,
    unit_price_paise: input.unit_price_paise,
    amount_paise: input.quantity * input.unit_price_paise,
    sort_order: input.sort_order,
  });
  if (error) throw new Error(error.message);
}

export async function removeQuotationItem(id: string) {
  const { error } = await supabase.from("quotation_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function publishQuotation(id: string) {
  const { error } = await supabase.from("quotations").update({ status: "published", published_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function assignTeamMember(bookingId: string, teamMemberId: string, assignedRole: string | null) {
  const { error } = await supabase.from("booking_assignments").insert({ booking_id: bookingId, team_member_id: teamMemberId, assigned_role: assignedRole });
  if (error) throw new Error(error.message);
}

export async function removeAssignment(id: string) {
  const { error } = await supabase.from("booking_assignments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
