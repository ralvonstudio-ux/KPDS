// Server-side backstop for payment confirmation. verify-razorpay-payment
// (called by the browser right after Checkout closes) is the primary path;
// this webhook exists for the case where the customer's browser closes,
// loses connection, or the app crashes between a successful charge and that
// client-side call — without this, a real Razorpay charge could exist with
// no matching "paid" row here, and the customer would look unpaid despite
// having been charged.
//
// Configure in the Razorpay dashboard: Settings -> Webhooks -> Add New
// Webhook, URL = https://<project-ref>.functions.supabase.co/razorpay-webhook,
// active events at minimum: payment.captured. Copy the "Webhook Secret" it
// generates into RAZORPAY_WEBHOOK_SECRET below — it is DIFFERENT from the
// API key secret used elsewhere.
//
// Deploy: supabase functions deploy razorpay-webhook --no-verify-jwt
// (--no-verify-jwt because Razorpay calls this directly, with no Supabase
// session — the webhook signature is what proves authenticity here instead.)
// Secrets required: RAZORPAY_WEBHOOK_SECRET
import { createClient } from "jsr:@supabase/supabase-js@2";
import { jsonResponse } from "../_shared/cors.ts";
import { applyPaymentSuccess } from "../_shared/applyPaymentSuccess.ts";

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!webhookSecret) return jsonResponse({ error: "Webhook secret not configured." }, 500);

    // Signature covers the exact raw bytes Razorpay sent — must verify
    // before any JSON.parse, not after.
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) return jsonResponse({ error: "Missing signature." }, 400);

    const expected = await hmacSha256Hex(webhookSecret, rawBody);
    if (expected !== signature) return jsonResponse({ error: "Invalid signature." }, 401);

    const event = JSON.parse(rawBody);
    const paymentEntity = event?.payload?.payment?.entity;

    // Only payment.captured moves money to "paid" here; other events
    // (authorized, failed, refunded, etc.) are acknowledged but not acted
    // on yet — extend this switch if the studio needs refund handling later.
    if (event?.event !== "payment.captured" || !paymentEntity?.order_id) {
      return jsonResponse({ received: true });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    
    const { data: payment } = await admin
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", paymentEntity.order_id)
      .maybeSingle();

    if (!payment) {
      // Nothing to reconcile against — log and acknowledge so Razorpay
      // doesn't retry a webhook we can never act on.
      console.warn("[razorpay-webhook] No payment row for order:", paymentEntity.order_id);
      return jsonResponse({ received: true });
    }

    await applyPaymentSuccess(admin, { ...payment, razorpay_payment_id: paymentEntity.id });

    return jsonResponse({ received: true });
  } catch (err) {
    console.error("[razorpay-webhook] unexpected error:", err);
    return jsonResponse({ error: "Unexpected server error." }, 500);
  }
});
