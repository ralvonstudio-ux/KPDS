/**
 * Hand-written mirror of the Supabase schema in supabase/migrations/*.sql.
 * Once a real project exists, regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * and re-apply the JSDoc comments this file adds on top of the raw columns.
 */

export type UserRole = "customer" | "admin";

export type BookingStatus =
  | "new"
  | "advance_paid"
  | "under_review"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "shoot_completed"
  | "delivered"
  | "closed"
  | "rejected";

export type QuotationStatus = "draft" | "published" | "accepted";

export type OrderStatus = "new" | "processing" | "ready" | "shipped" | "delivered" | "cancelled";

export type PaymentPurpose = "booking_advance" | "booking_balance" | "shop_order";

export type PaymentStatus = "created" | "paid" | "failed" | "refunded";

export interface Faq {
  question: string;
  answer: string;
}

export type CustomisationFieldType = "text" | "textarea" | "photo";

export interface CustomisationField {
  key: string;
  label: string;
  type: CustomisationFieldType;
  required: boolean;
}

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          description: string | null;
          cover_image_url: string | null;
          deliverables: string[];
          starting_price_paise: number | null;
          is_custom_quote: boolean;
          faqs: Faq[];
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: [];
      };
      service_gallery: {
        Row: {
          id: string;
          service_id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_gallery"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_gallery"]["Row"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_reference: string;
          customer_id: string;
          service_id: string | null;
          full_name: string;
          mobile: string;
          email: string;
          event_type: string;
          preferred_event_date: string;
          event_location: string;
          city: string;
          notes: string | null;
          status: BookingStatus;
          advance_amount_paise: number;
          advance_paid_paise: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Relationships: [];
      };
      booking_status_history: {
        Row: {
          id: string;
          booking_id: string;
          status: BookingStatus;
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_status_history"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["booking_status_history"]["Row"]>;
        Relationships: [];
      };
      quotations: {
        Row: {
          id: string;
          booking_id: string;
          status: QuotationStatus;
          subtotal_paise: number;
          discount_paise: number;
          gst_percent: number;
          gst_paise: number;
          total_paise: number;
          notes: string | null;
          published_at: string | null;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quotations"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["quotations"]["Row"]>;
        Relationships: [];
      };
      quotation_items: {
        Row: {
          id: string;
          quotation_id: string;
          label: string;
          quantity: number;
          unit_price_paise: number;
          amount_paise: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quotation_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["quotation_items"]["Row"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          phone: string | null;
          email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
        Relationships: [];
      };
      booking_assignments: {
        Row: {
          id: string;
          booking_id: string;
          team_member_id: string;
          assigned_role: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_assignments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["booking_assignments"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          cover_image_url: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          slug: string;
          name: string;
          description: string | null;
          base_price_paise: number;
          is_customisable: boolean;
          customisation_fields: CustomisationField[];
          stock_tracked: boolean;
          stock_quantity: number;
          is_published: boolean;
          is_archived: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_paise: number | null;
          stock_quantity: number;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_variants"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Row"]>;
        Relationships: [];
      };
      carts: {
        Row: {
          id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["carts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["carts"]["Row"]>;
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          customisation: Record<string, string>;
          unit_price_paise: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["cart_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_reference: string;
          customer_id: string;
          status: OrderStatus;
          subtotal_paise: number;
          shipping_paise: number;
          total_paise: number;
          shipping_address: {
            full_name: string;
            phone: string;
            line1: string;
            line2: string | null;
            city: string;
            state: string;
            pincode: string;
          };
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          quantity: number;
          unit_price_paise: number;
          amount_paise: number;
          customisation: Record<string, string>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [];
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          changed_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_status_history"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_status_history"]["Row"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          purpose: PaymentPurpose;
          status: PaymentStatus;
          booking_id: string | null;
          order_id: string | null;
          customer_id: string;
          amount_paise: number;
          currency: string;
          razorpay_order_id: string;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          failure_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          id: string;
          title: string | null;
          category: string;
          description: string | null;
          cover_image_url: string;
          gallery: string[];
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["portfolio_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          quote: string;
          rating: number | null;
          avatar_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      accept_quotation: {
        Args: { p_quotation_id: string };
        Returns: Database["public"]["Tables"]["quotations"]["Row"];
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
