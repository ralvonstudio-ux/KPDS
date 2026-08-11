import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-display-md text-ink">{title}</h1>
      {description && <p className="mt-4 text-base text-muted">{description}</p>}
    </motion.header>
  );
}
