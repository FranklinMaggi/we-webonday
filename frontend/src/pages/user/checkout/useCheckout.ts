import { useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import { getOrCreateVisitorId } from "../../../utils/visitor";
import { API_BASE } from "../../../lib/config";
import type { CartItem } from "../../../lib/cartStore";

/* ======================================================
   SYNC CART → BACKEND (KV = source of truth)
====================================================== */


async function syncCart(visitorId: string, cart: CartItem[]) {
  
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
   
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      items: cart,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Errore sincronizzazione carrello: " + text);
  }
}

/* ======================================================
   CHECKOUT HOOK
====================================================== */
export function useCheckout(email: string) {
  // 🔹 cart dallo store (source FE)
  const cart = cartStore((s) => s.items);

  const [orderId, setOrderId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  /* ============================
     SUBMIT ORDER (ONE WAY)
  ============================ */
  async function submitOrder(policyVersion: string): Promise<string> {
    if (!email) {
      throw new Error("Email mancante");
    }

    if (cart.length === 0) {
      throw new Error("Carrello vuoto");
    }

    setLoading(true);
    setError(undefined);

    try {
      // 1️⃣ visitorId stabile
      const visitorId = getOrCreateVisitorId();

      // 2️⃣ SYNC CART → CART_KV
      await syncCart(visitorId, cart);

      // 3️⃣ CREATE ORDER → ORDER_KV
      const res = await createOrder({
        visitorId,
        email,
        policyVersion,
      });

      if (!res?.orderId) {
        throw new Error("OrderId non restituito");
      }

      setOrderId(res.orderId);
      return res.orderId;
    } catch (err: any) {
      const msg = err?.message ?? "Errore creazione ordine";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /* ============================
     API DEL HOOK
  ============================ */
  return {
    cart,
    orderId,
    loading,
    error,
    submitOrder,
  };
}
