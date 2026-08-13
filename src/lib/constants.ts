/**
 * Studio-wide booking advance. Flat for every event today — if the studio
 * later wants this to vary by service or event size, add an
 * advance_amount_paise column to services and read from there instead.
 */
export const DEFAULT_ADVANCE_PAISE = 500_000; // ₹5,000

export const BOOKING_STATUSES = [
  "new",
  "advance_paid",
  "under_review",
  "contacted",
  "quoted",
  "confirmed",
  "shoot_completed",
  "delivered",
  "closed",
  "rejected",
] as const;

export const BOOKING_STATUS_LABELS: Record<(typeof BOOKING_STATUSES)[number], string> = {
  new: "New",
  advance_paid: "Advance Paid",
  under_review: "Under Review",
  contacted: "Contacted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  shoot_completed: "Shoot Completed",
  delivered: "Delivered",
  closed: "Closed",
  rejected: "Rejected",
};

export const ORDER_STATUSES = ["new", "processing", "ready", "shipped", "delivered", "cancelled"] as const;

export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> = {
  new: "New",
  processing: "Processing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const EVENT_TYPES = [
  "Wedding",
  "Pre-Wedding Shoot",
  "Engagement",
  "Birthday",
  "Anniversary",
  "Corporate Event",
  "Portrait / Personal Shoot",
  "Other",
] as const;
