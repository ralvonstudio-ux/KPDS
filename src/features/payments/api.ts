import { supabase } from "@/lib/supabase";

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
}

export async function createRazorpayOrder(params: {
  purpose: "booking_advance" | "booking_balance" | "shop_order";
  bookingId?: string;
  orderId?: string;
}): Promise<CreateOrderResponse> {
  const { data, error } = await supabase.functions.invoke<CreateOrderResponse>("create-razorpay-order", {
    body: params,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No response from payment service.");
  return data;
}

export async function verifyRazorpayPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke<{ success: boolean }>("verify-razorpay-payment", {
    body: params,
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error("Payment could not be verified.");
  return data;
}
