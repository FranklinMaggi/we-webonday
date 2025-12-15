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

const initialState: CheckoutState = {
  step: "cart",
  email: "",
  loading: false,
};

/* =========================
   HOOK
========================= */

export function useCheckout() {
  useEffect(() => {
    const userId = localStorage.getItem("webonday_user_v1");
    const email = localStorage.getItem("webonday_user_email");
  
    if (!userId || !email) {
      window.location.href = "/user/login?redirect=/user/checkout";
      return;
    }
  
    setState((s) => ({ ...s, email }));
  }, []);
  
  const cart = cartStore((s) => s.items);
  const [state, setState] = useState<CheckoutState>(initialState);



  /* =========================
     PREFILL EMAIL
  ========================= */

  useEffect(() => {
    const savedEmail = localStorage.getItem("webonday_user_email");
    if (savedEmail) {
      setState((s) => ({ ...s, email: savedEmail }));
    }
  }, []);

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
    const userId = localStorage.getItem("webonday_user_v1");

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
        userId,
        email: state.email,
        policyVersion: state.policyVersion,
      });

      await submitOrder();   // ordine creato DOPO policy
      next("payment");       // vai al pagamento

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
