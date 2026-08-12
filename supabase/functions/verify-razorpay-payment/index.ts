// Verifies a Razorpay checkout payment signature server-side and, only if
// valid, marks the matching public.payments row "paid" and advances the
// booking/order it belongs to. This is the primary path for marking a
// payment successful, called by the client right after Razorpay Checkout
// closes. razorpay-webhook is the server-side backstop for the case where
// the browser closes before this call fires — see that function's comment.
//
// Deploy: supabase functions deploy verify-razorpay-payment
// Secrets required: RAZORPAY_KEY_SECRET
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, handleCorsPreflight, jsonResponse } from "../_shared/cors.ts";
import { applyPaymentSuccess } from "../_shared/applyPaymentSuccess.ts";

interface RequestBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

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
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Missing Authorization header." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) return jsonResponse({ error: "Razorpay is not configured on the server yet." }, 500);

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser();
    if (userError || !user) return jsonResponse({ error: "Not authenticated." }, 401);

    const body: RequestBody = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return jsonResponse({ error: "Missing payment fields." }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();
    if (paymentError || !payment) return jsonResponse({ error: "Payment record not found." }, 404);
    if (payment.customer_id !== user.id) return jsonResponse({ error: "Forbidden." }, 403);
    if (payment.status === "paid") return jsonResponse({ success: true, alreadyProcessed: true });

    const expectedSignature = await hmacSha256Hex(
      razorpayKeySecret,
      `${razorpay_order_id}|${razorpay_payment_id}`,
    );

    if (expectedSignature !== razorpay_signature) {
      await admin
        .from("payments")
        .update({ status: "failed", failure_reason: "Signature verification failed." })
        .eq("id", payment.id);
      return jsonResponse({ error: "Payment verification failed." }, 400);
    }

    await applyPaymentSuccess(admin, { ...payment, razorpay_payment_id, razorpay_signature });

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("[verify-razorpay-payment] unexpected error:", err);
    return jsonResponse({ error: "Unexpected server error." }, 500);
  }
});
