import { supabase } from "@/lib/supabase";
import { generateReference } from "@/lib/utils";
import type { CartItem } from "@/features/cart/CartContext";
import type { ShippingAddressInput } from "@/features/checkout/schemas";
import type { Tables } from "@/types/database";

export type Order = Tables<"orders">;

export const SHIPPING_PAISE = 0; // Free shipping for now — flat rate, easy to change later.

/**
 * Snapshots the customer's cart into a real order (order + order_items),
 * then empties the cart. Product/variant names and prices are copied onto
 * order_items so later catalogue edits never change what a past order says
 * the customer bought.
 */
export async function createOrderFromCart(
  customerId: string,
  cartId: string,
  items: CartItem[],
  shippingAddress: ShippingAddressInput,
  notes?: string,
): Promise<Order> {
  const subtotalPaise = items.reduce((sum, i) => sum + i.quantity * i.unit_price_paise, 0);
  const totalPaise = subtotalPaise + SHIPPING_PAISE;

  let order: Order | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_reference: generateReference("KPO"),
        customer_id: customerId,
        subtotal_paise: subtotalPaise,
        shipping_paise: SHIPPING_PAISE,
        total_paise: totalPaise,
        shipping_address: { ...shippingAddress, line2: shippingAddress.line2 || null },
        notes: notes || null,
      })
      .select("*")
      .single();
    if (!error) {
      order = data;
      break;
    }
    if (error.code !== "23505") throw new Error(error.message);
  }
  if (!order) throw new Error("Could not generate a unique order reference. Please try again.");

  const orderItems = items.map((item) => ({
    order_id: order!.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.products?.name ?? "Product",
    variant_name: item.product_variants?.name ?? null,
    quantity: item.quantity,
    unit_price_paise: item.unit_price_paise,
    amount_paise: item.unit_price_paise * item.quantity,
    customisation: item.customisation,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  // Best-effort cart clear — if this fails the order still succeeded, so we
  // don't roll back or block the customer over a leftover cart row.
  const { error: clearError } = await supabase.from("cart_items").delete().eq("cart_id", cartId);
  if (clearError) console.error("[checkout] Failed to clear cart after order:", clearError.message);

  return order;
}
