import { fetchLatestPolicy, acceptPolicyApi } from "../../../lib/policyApi";

import { useEffect, useState } from "react";
import { cartStore } from "../../../lib/cartStore";
import { createOrder } from "../../../lib/ordersApi";
import type { CheckoutState, CheckoutStep } from "./types";

const initialState: CheckoutState = {
  step: "cart",
  email: "",
  loading: false,
};

export function useCheckout() {
  const cart = cartStore((s) => s.items);
  const [state, setState] = useState<CheckoutState>(initialState);

  /* =========================
     PREFILL EMAIL (LOGIN)
  ========================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("webonday_user_email");
    if (savedEmail) {
      setState((s) => ({ ...s, email: savedEmail }));
    }
  }, []);
  useEffect(() => {
    if (state.step !== "policy") return;
  
    fetchLatestPolicy()
      .then((policy) => {
        setState((s) => ({
          ...s,
          policyVersion: policy.version, // ← usa `version`
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
     GUARDIE DI NAVIGAZIONE
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
     CREATE ORDER
  ========================= */
  async function submitOrder() {
    if (!state.email || cart.length === 0) {
      setState((s) => ({ ...s, error: "Checkout non valido" }));
      return;
    }
  
    // totale deterministico lato FE (coerente con CartItem.total)
    const total = cart.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  
    setState((s) => ({ ...s, loading: true }));
  
    try {
      const res = await createOrder({
        email: state.email,
        items: cart,
        total,
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
     POLICY
  ========================= */
  async function acceptPolicy() {
    if (!state.policyVersion) {
      setState((s) => ({
        ...s,
        error: "Policy non disponibile",
      }));
      return;
    }
  
    try {
      setState((s) => ({ ...s, loading: true, error: undefined }));
  
      await acceptPolicyApi({
        userId: localStorage.getItem("webonday_user_v1") ?? "guest",
        email: state.email,
        policyVersion: state.policyVersion,
      });
  
      await submitOrder();   // crea ordine
      next("payment");       // naviga
  
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e.message ?? "Errore accettazione policy",
      }));
    }
  }
  
  
  return {
    state,
    setState,
    cart,
    next,
    submitOrder,
    acceptPolicy,
  };
}
