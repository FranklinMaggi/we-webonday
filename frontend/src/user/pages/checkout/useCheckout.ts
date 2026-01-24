// ======================================================
// FE || pages/user/checkout/useCheckout.ts
// ======================================================
//
// CHECKOUT HOOK — CONFIGURATION-FIRST
//
// RUOLO:
// - Carica dati checkout da Configuration
// - Crea ordine (post policy)
//
// SOURCE OF TRUTH:
// - Backend
//
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../shared/lib/api";

/* =========================
   TYPES
========================= */
export interface PricingLine {
  label: string;
  amount: number;
  type: "startup" | "monthly" | "yearly";
}

export interface Pricing {
  startupTotal: number;
  yearlyTotal: number;
  monthlyTotal: number;
  lines: PricingLine[];
}

export interface Configuration {
  solutionName: string;
  productName: string;
}

type CheckoutDataResponse =
  | {
      ok: true;
      configuration: Configuration;
      pricing: Pricing;
    }
  | { ok: false; error: string };

type CreateOrderResponse =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

/* =========================
   HOOK
========================= */
export function useCheckout(configurationId: string) {
  const [configuration, setConfiguration] =
    useState<Configuration | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     LOAD CHECKOUT DATA
  ========================= */
  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);

    apiFetch<CheckoutDataResponse>(
      "/api/checkout/from-configuration",
      {
        method: "POST",
        body: JSON.stringify({ configurationId }),
      }
    )
      .then((res) => {
        if (!res || !res.ok) {
          throw new Error(
            res?.error ?? "Errore caricamento checkout"
          );
        }

        setConfiguration(res.configuration);
        setPricing(res.pricing);
      })
      .catch((err: any) => {
        setError(err.message ?? "Errore checkout");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId]);

  /* =========================
     SUBMIT CHECKOUT
  ========================= */
  async function submitCheckout(
    policyVersion: string
  ): Promise<string> {
    if (!configurationId) {
      throw new Error("ConfigurationId mancante");
    }

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
      throw new Error(
        res?.error ?? "Errore creazione ordine"
      );
    }

    setOrderId(res.orderId);
    return res.orderId;
  }

  return {
    configuration,
    pricing,
    orderId,
    loading,
    error,
    submitCheckout,
  };
}
