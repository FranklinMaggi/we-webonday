
import { useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import { getOrCreateVisitorId } from "../../../utils/visitor";

export function useCheckout(email: string, userId?: string) {
  const cart = cartStore((s) => s.items);

  const [orderId, setOrderId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function submitOrder(policyVersion: string): Promise<string> {
    if (!email || cart.length === 0) {
      throw new Error("Checkout non valido");
    }

    const visitorId = getOrCreateVisitorId();

    setLoading(true);
    setError(undefined);

    try {
      const res = await createOrder({
        visitorId,
        email,
        policyVersion,
        userId: userId ?? null,
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
