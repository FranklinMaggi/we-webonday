// ======================================================
// FE || pages/user/checkout/steps/PaymentPaypal.tsx
// ======================================================
// PAYMENT — PAYPAL INTEGRATION
//
// RUOLO:
// - Avvio e gestione pagamento PayPal
//
// RESPONSABILITÀ:
// - Load SDK
// - Create order PayPal
// - Capture pagamento
//
// NON FA:
// - NON crea ordini interni
// - NON calcola importi
//
// NOTE:
// - Backend resta source of truth
// ======================================================

import { useEffect, useRef } from "react";
import {
  loadPaypalSdk,
  mountPaypalButtons,
} from "../../../../../shared/lib/payments/paypal";

interface Props {
  state: {
    orderId?: string;
  };
}

export default function PaymentPaypal({ state }: Props) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!state.orderId) return;
    if (mountedRef.current) return; // evita doppio mount (React StrictMode)

    mountedRef.current = true;
    let cancelled = false;

    async function initPaypal() {
      try {
        /* =========================
           1) Load PayPal SDK
        ========================= */
        await loadPaypalSdk(import.meta.env.VITE_PAYPAL_CLIENT_ID);

        if (cancelled) return;

        /* =========================
           2) Mount PayPal Buttons
        ========================= */
        mountPaypalButtons("#paypal-buttons", {
          style: {
            layout: "vertical",
            color: "gold",
            shape: "pill",
            label: "paypal",
          },

          /* ===== CREATE PAYPAL ORDER ===== */
          createOrder: async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/api/payment/paypal/create-order`, {
              method: "POST",
          
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: state.orderId,
              }),
            });

            if (!res.ok) {
              throw new Error("PayPal create-order HTTP error");
            }

            const out = await res.json();
            if (!out.ok || !out.paypalOrderId) {
              throw new Error("Create PayPal order failed");
            }

            return out.paypalOrderId;
          },

          /* ===== CAPTURE = SOLDI ===== */
          onApprove: async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/api/payment/paypal/capture-order`, {
              method: "POST",
             
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: state.orderId,
              }),
            });

            if (!res.ok) {
              throw new Error("PayPal capture HTTP error");
            }

            const out = await res.json();
            if (!out.ok || out.paymentStatus !== "paid") {
              throw new Error("PayPal capture failed");
            }

            /* ===== SUCCESS ===== */
            window.location.href = "/user/dashboard";
          },

          onError: (err: unknown) => {
            console.error("PayPal error:", err);
            alert("Errore durante il pagamento. Riprova.");
          },
        });
      } catch (err) {
        console.error("PayPal init error:", err);
      }
    }

    initPaypal();

    return () => {
      cancelled = true;
    };
  }, [state.orderId]);

  /* =========================
     RENDER
  ========================= */

  if (!state.orderId) {
    return <p>Ordine non pronto…</p>;
  }

  return (
    <section>
      <h2>Pagamento</h2>
      <p>Completa il pagamento con PayPal</p>

      <div id="paypal-buttons" />
    </section>
  );
}
