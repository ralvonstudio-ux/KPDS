/**
 * Studio-wide booking advance. Flat for every event today — if the studio
 * later wants this to vary by service or event size, add an
 * advance_amount_paise column to services and read from there instead.
 */
export const DEFAULT_ADVANCE_PAISE = 500_000; // ₹5,000

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
