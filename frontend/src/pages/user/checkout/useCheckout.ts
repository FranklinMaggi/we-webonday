import { useEffect, useState } from "react";

import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import {
  fetchLatestPolicy,
  acceptPolicyApi,
} from "../../../lib/policyApi";

import type { CheckoutState, CheckoutStep } from "./types";

/* =========================
   INITIAL STATE
========================= */


/* =========================
   HOOK
========================= */

export function useCheckout(userId: string, email: string) {
 
  const cart = cartStore((s) => s.items);
 
  const initialState: CheckoutState = {
    step: "cart",
    email,
    loading: false,
  };
  const [state, setState] = useState<CheckoutState>(initialState);
  /* =========================
     LOAD POLICY ON STEP
  ========================= */

  useEffect(() => {
    if (state.step !== "policy") return;

    fetchLatestPolicy()
      .then((policy) => {
        setState((s) => ({
          ...s,
          policyVersion: policy.version,
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          error: "Impossibile caricare la policy",
        }));
      });
  }, [state.step]);

  /* =========================
     NAVIGATION GUARDS
  ========================= */

  function canGoTo(step: CheckoutStep): boolean {
    if (step === "user" && cart.length === 0) return false;
    if (step === "policy" && !state.email) return false;
    if (step === "payment" && !state.orderId) return false;
    return true;
  }

  function next(step: CheckoutStep) {
    if (!canGoTo(step)) return;

    setState((s) => ({
      ...s,
      step,
      error: undefined,
    }));
  }

  /* =========================
     CREATE ORDER (LOCKED)
  ========================= */

  async function submitOrder() {
    if (!state.email || cart.length === 0 || !state.policyVersion) {
      setState((s) => ({
        ...s,
        error: "Checkout non valido",
      }));
      return;
    }

    const total = cart.reduce(
      (sum, i) => sum + (Number(i.total) || 0),
      0
    );

    setState((s) => ({ ...s, loading: true }));

    try {
      const res = await createOrder({
        email: state.email,
        items: cart,
        total,
        policyVersion: state.policyVersion, // 🔒 vincolo legale
      });

      setState((s) => ({
        ...s,
        orderId: res.orderId,
        loading: false,
      }));
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e.message ?? "Errore creazione ordine",
      }));
    }
  }

  /* =========================
     POLICY ACCEPTANCE
  ========================= */

  async function acceptPolicy() {
    if (!userId || !state.policyVersion) {
      setState((s) => ({
        ...s,
        error: "Utente o policy non valida",
      }));
      return;
    }
  
    try {
      setState((s) => ({ ...s, loading: true, error: undefined }));
  
      await acceptPolicyApi({
        userId,              // ✅ user reale
        email: state.email,
        policyVersion: state.policyVersion,
      });
  
      await submitOrder();
      next("payment");
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e.message ?? "Errore accettazione policy",
      }));
    }
  }
  
  /* =========================
     API
  ========================= */

  return {
    state,
    setState,
    cart,
    next,
    submitOrder,
    acceptPolicy,
  };
}
