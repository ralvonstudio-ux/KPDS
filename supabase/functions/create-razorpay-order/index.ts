// Creates a Razorpay order for a booking advance, booking balance, or shop
// order — and a matching "created" row in public.payments.
//
// The amount is NEVER taken from the client. It is always re-derived from
// the relevant row in the database, so a tampered request body can only ever
// under- or over-shoot what the studio actually configured, never pay less
// than what's owed.
//
// Deploy: supabase functions deploy create-razorpay-order
// Secrets required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, handleCorsPreflight, jsonResponse } from "../_shared/cors.ts";

interface RequestBody {
  purpose: "booking_advance" | "booking_balance" | "shop_order";
  bookingId?: string;
  orderId?: string;
}

Deno.serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Missing Authorization header." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return jsonResponse({ error: "Razorpay is not configured on the server yet." }, 500);
    }

    // Caller identity — validated against the user's own JWT, RLS still applies.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser();
    if (userError || !user) return jsonResponse({ error: "Not authenticated." }, 401);

    // Privileged client for the amount lookup + payments insert (payments
    // has no client-writable policy at all, by design — see supabase/migrations).
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const body: RequestBody = await req.json();
    let amountPaise = 0;
    let receipt = "";
    let notes: Record<string, string> = {};

    if (body.purpose === "booking_advance") {
      if (!body.bookingId) return jsonResponse({ error: "bookingId is required." }, 400);
      const { data: booking, error } = await admin
        .from("bookings")
        .select("id, booking_reference, customer_id, advance_amount_paise, advance_paid_paise")
        .eq("id", body.bookingId)
        .single();
      if (error || !booking) return jsonResponse({ error: "Booking not found." }, 404);
      if (booking.customer_id !== user.id) return jsonResponse({ error: "Forbidden." }, 403);

      amountPaise = booking.advance_amount_paise - booking.advance_paid_paise;
      receipt = booking.booking_reference;
      notes = { bookingId: booking.id, purpose: "booking_advance" };
    } else if (body.purpose === "booking_balance") {
      if (!body.bookingId) return jsonResponse({ error: "bookingId is required." }, 400);
      const { data: booking, error } = await admin
        .from("bookings")
        .select("id, booking_reference, customer_id, advance_paid_paise, quotations(total_paise, status)")
        .eq("id", body.bookingId)
        .single();
      if (error || !booking) return jsonResponse({ error: "Booking not found." }, 404);
      if (booking.customer_id !== user.id) return jsonResponse({ error: "Forbidden." }, 403);

      const quotation = Array.isArray(booking.quotations) ? booking.quotations[0] : booking.quotations;
      if (!quotation || quotation.status !== "accepted") {
        return jsonResponse({ error: "No accepted quotation for this booking yet." }, 400);
      }
      amountPaise = quotation.total_paise - booking.advance_paid_paise;
      receipt = `${booking.booking_reference}-BAL`;
      notes = { bookingId: booking.id, purpose: "booking_balance" };
    } else if (body.purpose === "shop_order") {
      if (!body.orderId) return jsonResponse({ error: "orderId is required." }, 400);
      const { data: order, error } = await admin
        .from("orders")
        .select("id, order_reference, customer_id, total_paise")
        .eq("id", body.orderId)
        .single();
      if (error || !order) return jsonResponse({ error: "Order not found." }, 404);
      if (order.customer_id !== user.id) return jsonResponse({ error: "Forbidden." }, 403);

      amountPaise = order.total_paise;
      receipt = order.order_reference;
      notes = { orderId: order.id, purpose: "shop_order" };
    } else {
      return jsonResponse({ error: "Unknown payment purpose." }, 400);
    }

    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      return jsonResponse({ error: "Nothing due for this payment." }, 400);
    }

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt,
        notes,
      }),
    });

    if (!razorpayResponse.ok) {
      const errText = await razorpayResponse.text();
      console.error("[razorpay] order creation failed:", errText);
      return jsonResponse({ error: "Failed to create payment order." }, 502);
    }

    const razorpayOrder = await razorpayResponse.json();

    const { error: insertError } = await admin.from("payments").insert({
      purpose: body.purpose,
      status: "created",
      booking_id: body.bookingId ?? null,
      order_id: body.orderId ?? null,
      customer_id: user.id,
      amount_paise: amountPaise,
      currency: "INR",
      razorpay_order_id: razorpayOrder.id,
    });
    if (insertError) {
      console.error("[payments] insert failed:", insertError.message);
      return jsonResponse({ error: "Failed to record payment." }, 500);
    }

    return jsonResponse({
      razorpayOrderId: razorpayOrder.id,
      amountPaise,
      currency: "INR",
      keyId: razorpayKeyId,
    });
  } catch (err) {
    console.error("[create-razorpay-order] unexpected error:", err);
    return jsonResponse({ error: "Unexpected server error." }, 500, );
  }
});
