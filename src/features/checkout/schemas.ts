import { z } from "zod";

export const shippingAddressSchema = z.object({
  full_name: z.string().min(2, "Enter the recipient's name"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number"),
  line1: z.string().min(3, "Enter the address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter the city"),
  state: z.string().min(2, "Enter the state"),
  pincode: z
    .string()
    .min(4, "Enter a valid PIN code")
    .regex(/^[0-9]+$/, "PIN code must be numeric"),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
