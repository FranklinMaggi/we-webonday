// ======================================================
// FE || pages/user/checkout/index.tsx
// ======================================================
// CHECKOUT — PAGE CONTROLLER
//
// RUOLO:
// - Entry point checkout autenticato
//
// RESPONSABILITÀ:
// - Guard auth
// - Guard policy
// - Orchestrazione hook checkout
//
// NON FA:
// - NON calcola prezzi
// - NON crea ordini direttamente
//
// NOTE:
// - Tutta la logica è delegata a hook e step
// ======================================================

import { useEffect, useState } from "react";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../store/auth.store";
import {
  fetchLatestPolicy,
  getPolicyStatus,
  acceptPolicy,
} from "../../../lib/policyApi";

export default function CheckoutPage() {
  /* ===========================
     AUTH STATE
  =========================== */
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const checkout = useCheckout(user?.email ?? "");

  /* ===========================
     POLICY STATE
  =========================== */
  const [policyAccepted, setPolicyAccepted] = useState<boolean | null>(null);
  const [policyVersion, setPolicyVersion] = useState<string | null>(null);
  const [policyLoading, setPolicyLoading] = useState(true);

  /* ===========================
     REDIRECT SE NON LOGGATO
  =========================== */
  useEffect(() => {
    if (ready && !user) {
      window.location.href = "/user/login?redirect=/user/checkout";
    }
  }, [ready, user]);

  /* ===========================
     LOAD POLICY STATUS (SESSION)
  =========================== */
  useEffect(() => {
    if (!ready || !user) return;

    async function loadPolicy() {
      try {
        // 1️⃣ policy latest
        const latest = await fetchLatestPolicy();
        setPolicyVersion(latest.version);

        // 2️⃣ stato accettazione (via sessione)
        const status = await getPolicyStatus();
        setPolicyAccepted(status.accepted);
      } catch {
        setPolicyAccepted(false);
      } finally {
        setPolicyLoading(false);
      }
    }

    loadPolicy();
  }, [ready, user]);

  /* ===========================
     ACCEPT POLICY
  =========================== */
  async function handleAcceptPolicy() {
    if (!policyVersion) return;

    await acceptPolicy(policyVersion);
    setPolicyAccepted(true);
  }

  /* ===========================
     RENDER GUARDS
  =========================== */
  if (!ready || policyLoading) {
    return <p>Caricamento…</p>;
  }

  if (!user) {
    return null;
  }

  /* ===========================
     🚫 POLICY GATE
  =========================== */
  if (policyAccepted === false) {
    return (
      <div className="checkout-policy-gate">
        <h2>Prima di continuare</h2>
        <p>
          Devi accettare i Termini e Condizioni per procedere al pagamento.
        </p>

        {policyVersion && (
          <iframe
            src={`/policy/${policyVersion}`}
            style={{
              width: "100%",
              height: 300,
              border: "1px solid #333",
            }}
          />
        )}

        <button
          type="button"
          onClick={handleAcceptPolicy}
          className="checkout-accept-policy-btn"
        >
          Accetto e continuo
        </button>
      </div>
    );
  }

  /* ===========================
     ✅ CHECKOUT NORMALE
  =========================== */
  return (
    <CartReview
      cart={checkout.cart}
    
      submitOrder={checkout.submitOrder}
    />
  );
}
