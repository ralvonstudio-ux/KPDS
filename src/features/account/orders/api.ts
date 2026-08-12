import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderStatusHistoryEntry = Tables<"order_status_history">;

export function useCustomerOrders() {
  const [data, setData] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useCustomerOrderDetail(id: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [history, setHistory] = useState<OrderStatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const [orderRes, itemsRes, historyRes] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
      supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: true }),
    ]);
    if (orderRes.error) setError(orderRes.error.message);
    else setOrder(orderRes.data);
    setItems(itemsRes.data ?? []);
    setHistory(historyRes.data ?? []);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { order, items, history, isLoading, error, refetch };
}
