import { z } from "zod";
import { EVENT_TYPES } from "@/lib/constants";

const todayIso = () => new Date().toISOString().slice(0, 10);

export const bookingSchema = z.object({
  serviceId: z.string().uuid().optional().or(z.literal("")),
  fullName: z.string().min(2, "Enter your full name"),
  mobile: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  eventType: z.enum(EVENT_TYPES, { errorMap: () => ({ message: "Select an event type" }) }),
  preferredEventDate: z
    .string()
    .min(1, "Select a preferred date")
    .refine((val) => val >= todayIso(), "Preferred date must be today or later"),
  eventLocation: z.string().min(2, "Enter the venue or location"),
  city: z.string().min(2, "Enter the city"),
  notes: z.string().max(1000, "Keep notes under 1000 characters").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
