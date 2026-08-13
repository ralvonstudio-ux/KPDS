import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  neutral: "bg-black/[0.06] text-ink",
  gold: "bg-gold-soft/40 text-espresso",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
};

const BOOKING_TONE: Record<string, keyof typeof TONES> = {
  new: "neutral",
  advance_paid: "gold",
  under_review: "blue",
  contacted: "blue",
  quoted: "gold",
  confirmed: "green",
  shoot_completed: "green",
  delivered: "green",
  closed: "neutral",
  rejected: "red",
};

const ORDER_TONE: Record<string, keyof typeof TONES> = {
  new: "neutral",
  processing: "blue",
  ready: "gold",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

export function StatusBadge({ status, kind = "booking", label }: { status: string; kind?: "booking" | "order"; label: string }) {
  const tone = (kind === "booking" ? BOOKING_TONE : ORDER_TONE)[status] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", TONES[tone])}>
      {label}
    </span>
  );
}
