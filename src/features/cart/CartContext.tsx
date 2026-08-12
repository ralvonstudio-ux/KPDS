import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Tables } from "@/types/database";

type CartItemRow = Tables<"cart_items">;
export type CartItem = CartItemRow & {
  products: { name: string; slug: string; product_images: { image_url: string }[] } | null;
  product_variants: { name: string } | null;
};

interface CartContextValue {
  cartId: string | null;
  items: CartItem[];
  itemCount: number;
  subtotalPaise: number;
  isLoading: boolean;
  addItem: (input: {
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPricePaise: number;
    customisation?: Record<string, string>;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_ITEM_SELECT = "*, products(name, slug, product_images(image_url)), product_variants(name)";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ensureCart = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    const { data: existing } = await supabase.from("carts").select("id").eq("customer_id", user.id).maybeSingle();
    if (existing) return existing.id;
    const { data: created, error } = await supabase.from("carts").insert({ customer_id: user.id }).select("id").single();
    if (error) {
      console.error("[cart] Failed to create cart:", error.message);
      return null;
    }
    return created.id;
  }, [user]);

  const refetch = useCallback(async () => {
    if (!user) {
      setCartId(null);
      setItems([]);
      return;
    }
    setIsLoading(true);
    const id = await ensureCart();
    setCartId(id);
    if (id) {
      const { data, error } = await supabase.from("cart_items").select(CART_ITEM_SELECT).eq("cart_id", id);
      if (error) console.error("[cart] Failed to load items:", error.message);
      else setItems((data as CartItem[]) ?? []);
    }
    setIsLoading(false);
  }, [user, ensureCart]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addItem: CartContextValue["addItem"] = useCallback(
    async ({ productId, variantId, quantity, unitPricePaise, customisation = {} }) => {
      if (!user) throw new Error("You need to be signed in to add items to your cart.");
      const id = cartId ?? (await ensureCart());
      if (!id) throw new Error("Could not open your cart. Please try again.");
      setCartId(id);

      const existing = items.find((i) => i.product_id === productId && i.variant_id === variantId);
      if (existing && Object.keys(customisation).length === 0) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("cart_items").insert({
          cart_id: id,
          product_id: productId,
          variant_id: variantId,
          quantity,
          unit_price_paise: unitPricePaise,
          customisation,
        });
        if (error) throw new Error(error.message);
      }
      await refetch();
    },
    [user, cartId, items, ensureCart, refetch],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
        if (error) throw new Error(error.message);
      }
      await refetch();
    },
    [refetch],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch],
  );

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotalPaise = items.reduce((sum, i) => sum + i.quantity * i.unit_price_paise, 0);
    return { cartId, items, itemCount, subtotalPaise, isLoading, addItem, updateQuantity, removeItem, refetch };
  }, [cartId, items, isLoading, addItem, updateQuantity, removeItem, refetch]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
