import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Order } from "@/features/checkout/api";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { formatINR } from "@/lib/utils";
import { usePageMeta } from "@/lib/usePageMeta";

export default function CheckoutSuccessPage() {
  usePageMeta("Order Placed");
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  return (
    <div className="page-space content-wrap flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-lg rounded-card-lg border border-line bg-surface p-10 text-center shadow-clay"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft/40 text-gold-deep">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-display-sm text-ink">Order placed</h1>
        {order ? (
          <>
            <p className="mt-2 text-sm text-muted">
              Order reference <strong className="text-ink">{order.order_reference}</strong>
            </p>
            <p className="mt-4 text-sm text-muted">
              We've received your payment of {formatINR(order.total_paise)}. We'll get your order ready and keep you
              posted.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">Thank you — your order has been placed.</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink to="/gift-center" variant="gold">
            Continue shopping
          </ButtonLink>
          <ButtonLink to="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
