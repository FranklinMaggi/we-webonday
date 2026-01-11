/**
 * ======================================================
 * FE || Cart API (POINTER-ONLY)
 * ======================================================
 *
 * SOURCE OF TRUTH:
 * - BE: /api/cart
 *
 * NOTE:
 * - Cart = pointer ONLY (configurationId)
 * - Nessun item, nessun pricing
 * ======================================================
 */

export type CartPointer = {
    configurationId: string;
  };
  
  /* =========================
     GET CART
  ========================= */
  export async function fetchCart(): Promise<CartPointer | null> {
    const res = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
    });
  
    if (!res.ok) return null;
  
    const json = await res.json();
    return json.cart ?? null;
  }
  
  /* =========================
     PUT CART (SET POINTER)
  ========================= */
  export async function putCart(
    payload: CartPointer
  ): Promise<void> {
    const res = await fetch("/api/cart", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({payload,}),
    });
  
    if (!res.ok) {
      console.error("[CART] PUT failed", res.status);
    }
  }
  
  /* =========================
     DELETE CART
  ========================= */
  export async function clearCart(): Promise<void> {
    await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
    });
  }
  