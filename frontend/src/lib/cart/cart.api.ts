
/**
 * ======================================================
 * FE || Cart API (POINTER-ONLY)
 * ======================================================
 */

export type CartPointer = {
    configurationId: string;
  };
  
  export async function fetchCart(): Promise<CartPointer | null> {
    const res = await fetch("/api/cart/cart", {
      method: "GET",
      credentials: "include",
    });
  
    if (!res.ok) return null;
  
    const json = await res.json();
    return json.cart ?? null;
  }
  
  export async function putCart(
    payload: CartPointer
  ): Promise<void> {
    await fetch("/api/cart/cart", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
  
  export async function clearCart(): Promise<void> {
    await fetch("/api/cart/cart", {
      method: "DELETE",
      credentials: "include",
    });
  }
  