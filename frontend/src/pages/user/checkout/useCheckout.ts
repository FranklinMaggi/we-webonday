import { useEffect, useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import { getOrCreateVisitorId } from "../../../utils/visitor";
import { API_BASE } from "../../../lib/config";
import type { CartItem } from "../../../lib/cartStore";

/* ======================================================
   FETCH CART FROM BACKEND (KV → FE rehydration)
====================================================== */
async function fetchCart(visitorId: string): Promise<{
  visitorId: string;
  items: CartItem[];
  total: number;
}> {
  const res = await fetch(
    `${API_BASE}/api/cart?visitorId=${visitorId}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Errore recupero carrello");
  }

  const data = await res.json();
  return data.cart ?? data;
}

/* ======================================================
   SYNC CART → BACKEND (FE → KV)
====================================================== */
async function syncCart(visitorId: string, cart: CartItem[]) {
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
    const text = await res.text();
    throw new Error("Errore sincronizzazione carrello: " + text);
  }
}

/* ======================================================
   CHECKOUT HOOK
====================================================== */
export function useCheckout(email: string) {
  // 🔹 cart dallo store (cache FE)
  const cart = cartStore((s) => s.items);

  const [orderId, setOrderId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  /* ====================================================
     REHYDRATE CART ON MOUNT (KV → Zustand)
  ==================================================== */
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    if (cart.length === 0) {
      fetchCart(visitorId)
        .then((remoteCart) => {
          if (remoteCart.items.length > 0) {
            cartStore.getState().setItems(remoteCart.items);
          }
        })
        .catch(() => {
          // silenzioso: carrello può essere vuoto davvero
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ====================================================
     SUBMIT ORDER (ONE-WAY FLOW)
  ==================================================== */
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
      const visitorId = getOrCreateVisitorId();

      // 1️⃣ Sync cart → KV
      await syncCart(visitorId, cart);

      // 2️⃣ Create order → ORDER_KV
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

  /* ====================================================
     PUBLIC API
  ==================================================== */
  return {
    cart,
    orderId,
    loading,
    error,
    submitOrder,
  };
}
