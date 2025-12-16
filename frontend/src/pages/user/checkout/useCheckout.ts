// src/pages/user/checkout/useCheckout.ts
import { useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";

export function useCheckout(email: string) {
  const cart = cartStore((s) => s.items);

  const [orderId, setOrderId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function submitOrder(): Promise<string> {
    if (!email || cart.length === 0) {
      throw new Error("Checkout non valido");
    }

    const total = cart.reduce((sum, i) => sum + i.total, 0);

    setLoading(true);
    setError(undefined);

    try {
      const res = await createOrder({
        email,
        items: cart,
        total,
        // 🔒 policyVersion viene già validata prima
        policyVersion: "latest",
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
