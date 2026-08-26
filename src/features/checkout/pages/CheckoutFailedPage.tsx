import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { usePageMeta } from "@/lib/usePageMeta";

export default function CheckoutFailedPage() {
  usePageMeta("Payment Failed");
  return (
    <div className="page-space content-wrap flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-lg rounded-card-lg border border-line bg-surface p-10 text-center shadow-clay"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-display-sm text-ink">Payment didn't go through</h1>
        <p className="mt-4 text-sm text-muted">
          No charge was made. If an order was already saved, you can retry the payment from your cart or account.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink to="/cart" variant="gold">
            Back to Cart
          </ButtonLink>
          <ButtonLink to="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
