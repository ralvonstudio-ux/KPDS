import { supabase } from "@/lib/supabase";
import { generateReference } from "@/lib/utils";
import { DEFAULT_ADVANCE_PAISE } from "@/lib/constants";
import type { BookingInput } from "@/features/booking/schemas";
import type { Tables } from "@/types/database";

export type Booking = Tables<"bookings">;

/**
 * Inserts a new booking. booking_reference is generated client-side and
 * unique-constrained in the DB; on the rare collision we just retry with a
 * fresh reference rather than surface a confusing error to the customer.
 */
export async function createBooking(customerId: string, input: BookingInput): Promise<Booking> {
  const payload = {
    customer_id: customerId,
    service_id: input.serviceId || null,
    full_name: input.fullName,
    mobile: input.mobile,
    email: input.email,
    event_type: input.eventType,
    preferred_event_date: input.preferredEventDate,
    event_location: input.eventLocation,
    city: input.city,
    notes: input.notes || null,
    advance_amount_paise: DEFAULT_ADVANCE_PAISE,
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("bookings")
      .insert({ ...payload, booking_reference: generateReference("KPS") })
      .select("*")
      .single();

    if (!error) return data;
    // 23505 = unique_violation; only worth retrying on a reference collision.
    if (error.code !== "23505") throw new Error(error.message);
  }

  throw new Error("Could not generate a unique booking reference. Please try again.");
}
