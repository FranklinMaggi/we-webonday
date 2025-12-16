
import { useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import { getOrCreateVisitorId } from "../../../utils/visitor";
import { API_BASE } from "../../../lib/config";


async function syncCart(visitorId: string, cart: any[]) {
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      items: cart,
    }),
  });

  if (!res.ok) {
    throw new Error("Errore sincronizzazione carrello");
  }
}

export function useCheckout(email: string) {
  const cart = cartStore((s) => s.items);

  const [orderId, setOrderId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  
  async function submitOrder(policyVersion: string): Promise<string> {
    if (!email || cart.length === 0) {
      throw new Error("Checkout non valido");
    }
  
    setLoading(true);
    setError(undefined);
  
    try {
      const visitorId = getOrCreateVisitorId();

      // 1️⃣ SYNC CART → KV
      await syncCart(visitorId, cart);
  
      // 2️⃣ CREATE ORDER
      const res = await createOrder({
        visitorId,
        email,
        policyVersion,
      });
  
      setOrderId(res.orderId);
      return res.orderId;
    } catch (e: any) {
      setError(e.message ?? "Errore creazione ordine");
      throw e;
    } finally {
      setLoading(false);
    }
  }
  return {
    cart,
    orderId,
    loading,
    error,
    submitOrder,
  };
}
