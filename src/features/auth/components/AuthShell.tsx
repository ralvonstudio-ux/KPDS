import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="page-space content-wrap flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-md rounded-card-lg border border-line bg-surface p-8 shadow-clay md:p-10"
      >
        <Link to="/" className="text-sm font-semibold tracking-tight text-ink">
          Khatu Pixel Digital Studio
        </Link>
        <p className="mt-6 text-eyebrow uppercase tracking-[0.14em] text-gold-deep">{eyebrow}</p>
        <h1 className="mt-2 text-display-sm text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </motion.div>
    </div>
  );
}
