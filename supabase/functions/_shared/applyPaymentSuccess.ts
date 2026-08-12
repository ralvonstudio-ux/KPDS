// Shared by verify-razorpay-payment (client-triggered) and razorpay-webhook
// (Razorpay-triggered backstop) so a payment is applied to its booking/order
// exactly the same way regardless of which path caught it first. Idempotent:
// safe to call twice for the same payment.
// deno-lint-ignore-file no-explicit-any
export async function applyPaymentSuccess(admin: any, payment: any) {
  if (payment.status === "paid") return; // already applied by the other path

  await admin
    .from("payments")
    .update({ status: "paid", razorpay_payment_id: payment.razorpay_payment_id, razorpay_signature: payment.razorpay_signature ?? null })
    .eq("id", payment.id);

  if ((payment.purpose === "booking_advance" || payment.purpose === "booking_balance") && payment.booking_id) {
    const { data: booking } = await admin
      .from("bookings")
      .select("advance_paid_paise")
      .eq("id", payment.booking_id)
      .single();
    const update: Record<string, unknown> = {
      advance_paid_paise: (booking?.advance_paid_paise ?? 0) + payment.amount_paise,
    };
    if (payment.purpose === "booking_advance") update.status = "advance_paid";
    await admin.from("bookings").update(update).eq("id", payment.booking_id);
  } else if (payment.purpose === "shop_order" && payment.order_id) {
    await admin.from("orders").update({ status: "processing" }).eq("id", payment.order_id);
  }
}
