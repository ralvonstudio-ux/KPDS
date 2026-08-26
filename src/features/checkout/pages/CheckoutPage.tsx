import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/features/cart/CartContext";
import { createOrderFromCart, type Order, SHIPPING_PAISE } from "@/features/checkout/api";
import { shippingAddressSchema, type ShippingAddressInput } from "@/features/checkout/schemas";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/features/payments/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { Input, Textarea } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { usePageMeta } from "@/lib/usePageMeta";

type FlowStatus = "form" | "submitting" | "paying" | "payment_pending";

export default function CheckoutPage() {
  usePageMeta("Checkout");
  const { user, profile } = useAuth();
  const { items, cartId, subtotalPaise, isLoading: isCartLoading } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState<FlowStatus>("form");
  const [order, setOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" },
  });

  const startPayment = async (targetOrder: Order) => {
    setStatus("paying");
    setPaymentError(null);
    try {
      const paymentOrder = await createRazorpayOrder({ purpose: "shop_order", orderId: targetOrder.id });
      await openRazorpayCheckout({
        key: paymentOrder.keyId,
        amount: paymentOrder.amountPaise,
        currency: paymentOrder.currency,
        order_id: paymentOrder.razorpayOrderId,
        name: "Khatu Pixel Digital Studio",
        description: `Order ${targetOrder.order_reference}`,
        prefill: { email: user?.email ?? undefined },
        theme: { color: "#C59D5F" },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(response);
            navigate("/checkout/success", { state: { order: targetOrder } });
          } catch (err) {
            setPaymentError(err instanceof Error ? err.message : "Payment could not be verified.");
            setStatus("payment_pending");
          }
        },
        modal: { ondismiss: () => setStatus("payment_pending") },
      });
    } catch (err) {
      setPaymentError(
        err instanceof Error ? err.message : "We couldn't start the payment. Your order was still saved.",
      );
      setStatus("payment_pending");
    }
  };

  const onSubmit = async (values: ShippingAddressInput) => {
    if (!user || !cartId) return;
    setStatus("submitting");
    setPaymentError(null);
    try {
      const created = await createOrderFromCart(user.id, cartId, items, values, notes);
      setOrder(created);
      await startPayment(created);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("form");
    }
  };

  if (isCartLoading) return <LoadingState label="Loading your cart…" />;

  if (items.length === 0 && status === "form") {
    return (
      <div className="page-space content-wrap">
        <EmptyState
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={
            <ButtonLink to="/gift-center" variant="outline" className="mt-2">
              Visit the Gift Center
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const total = subtotalPaise + SHIPPING_PAISE;

  return (
    <div className="page-space content-wrap">
      <PageHeader eyebrow="Almost there" title="Checkout" />

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-[1.4fr_1fr]">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5 rounded-card-lg border border-line bg-surface p-6 shadow-clay md:p-8"
        >
          <p className="text-sm font-medium text-ink">Shipping details</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Full name" required error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Phone" type="tel" required error={errors.phone?.message} {...register("phone")} />
          </div>
          <Input label="Address line 1" required error={errors.line1?.message} {...register("line1")} />
          <Input label="Address line 2 (optional)" error={errors.line2?.message} {...register("line2")} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Input label="City" required error={errors.city?.message} {...register("city")} />
            <Input label="State" required error={errors.state?.message} {...register("state")} />
            <Input label="PIN code" required error={errors.pincode?.message} {...register("pincode")} />
          </div>
          <Textarea label="Order notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

          {paymentError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {paymentError}
            </p>
          )}

          <Button type="submit" variant="gold" disabled={status === "submitting" || status === "paying"} className="mt-2 w-full">
            {status === "submitting"
              ? "Placing your order…"
              : status === "paying"
                ? "Opening secure payment…"
                : `Pay ${formatINR(total)}`}
          </Button>

          {status === "payment_pending" && order && (
            <div className="rounded-lg border border-gold-soft bg-gold-soft/10 px-4 py-3 text-sm text-espresso">
              <p>
                Your order <strong>{order.order_reference}</strong> was saved. Try the payment again when ready.
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => startPayment(order)}>
                Try payment again
              </Button>
            </div>
          )}
        </motion.form>

        <aside className="h-fit rounded-card-lg border border-line bg-surface p-6 shadow-clay lg:sticky lg:top-28">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Order summary</p>
          <div className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-ink/90">
                  {item.products?.name} × {item.quantity}
                  {item.product_variants && <span className="text-muted"> ({item.product_variants.name})</span>}
                </span>
                <span className="shrink-0 text-ink">{formatINR(item.unit_price_paise * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatINR(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{SHIPPING_PAISE === 0 ? "Free" : formatINR(SHIPPING_PAISE)}</span>
            </div>
            <div className="mt-1 flex justify-between text-base font-medium text-ink">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
