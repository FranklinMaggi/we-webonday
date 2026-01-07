// ======================================================
// FE || pages/user/checkout/useCheckout.ts
// ======================================================
//
// CHECKOUT HOOK — CONFIGURATION-FIRST
//
// RUOLO:
// - Avvia il checkout partendo da una Configuration
//
// RESPONSABILITÀ:
// - Creare un ordine dal backend
// - Gestire loading / error
//
// INVARIANTI:
// - User autenticato (cookie session)
// - ConfigurationId = source of truth
// - Il backend calcola tutto
//
// NON FA:
// - NON usa cartStore
// - NON usa visitorId
// - NON sincronizza KV manualmente
// ======================================================

import { useState } from "react";
import { apiFetch } from "../../../lib/api";

/* =========================
   TYPES
========================= */
type CreateOrderResponse =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

/* =========================
   HOOK
========================= */
export function useCheckout(configurationId: string) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     SUBMIT CHECKOUT
  ========================= */
  async function submitCheckout(policyVersion: string): Promise<string> {
    if (!configurationId) {
      throw new Error("ConfigurationId mancante");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch<CreateOrderResponse>(
        "/api/order/from-configuration",
        {
          method: "POST",
          body: JSON.stringify({
            configurationId,
            policyVersion,
          }),
        }
      );

      if (!res || !res.ok) {
        throw new Error(res?.error ?? "Errore creazione ordine");
      }

      setOrderId(res.orderId);
      return res.orderId;
    } catch (err: any) {
      const msg = err?.message ?? "Errore checkout";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    orderId,
    loading,
    error,
    submitCheckout,
  };
}
