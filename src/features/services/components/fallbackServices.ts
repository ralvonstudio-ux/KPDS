import type { Service } from "@/features/services/api";

/**
 * Shown wherever the real catalogue hasn't loaded yet (offline, slow
 * connection, Supabase project unreachable, or nothing published yet) — no
 * services surface should ever render completely empty. Shaped as full
 * `Service` rows (fake id/timestamps) purely so they pass through
 * ServiceCard/StudioSection unchanged; real services always take priority
 * the instant they're available.
 */
export const FALLBACK_SERVICES: Service[] = [
  {
    id: "fallback-wedding-stories",
    slug: "",
    title: "Wedding Stories",
    summary: "Full-day documentary and portrait coverage for your wedding.",
    description: null,
    cover_image_url: "/images/seed/kpds-studio-wedding.jpg",
    deliverables: [],
    starting_price_paise: 2500000,
    is_custom_quote: false,
    faqs: [],
    is_published: true,
    sort_order: 0,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-prewedding-stories",
    slug: "",
    title: "Pre-Wedding Stories",
    summary: "A relaxed, cinematic shoot before the big day.",
    description: null,
    cover_image_url: "/images/seed/kpds-studio-prewedding.jpg",
    deliverables: [],
    starting_price_paise: 1500000,
    is_custom_quote: false,
    faqs: [],
    is_published: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-cinematic-films",
    slug: "",
    title: "Cinematic Films",
    summary: "Your day, told as a short film worth rewatching.",
    description: null,
    cover_image_url: "/images/seed/kpds-studio-films.jpg",
    deliverables: [],
    starting_price_paise: 2000000,
    is_custom_quote: false,
    faqs: [],
    is_published: true,
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-haldi-celebration",
    slug: "",
    title: "Haldi Celebration",
    summary: "Full coverage of the Haldi ceremony, from prep to finish.",
    description: null,
    cover_image_url: "/images/seed/kpds-studio-haldi.jpg",
    deliverables: [],
    starting_price_paise: 1200000,
    is_custom_quote: false,
    faqs: [],
    is_published: true,
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
];
