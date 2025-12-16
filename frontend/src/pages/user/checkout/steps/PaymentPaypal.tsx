import { useEffect, useRef } from "react";
import { API_BASE } from "../../../../lib/config";
import {
  loadPaypalSdk,
  mountPaypalButtons,
} from "../../../../lib/payments/paypal";

interface Props {
  state: {
    orderId?: string;
  };
}

export default function PaymentPaypal({ state }: Props) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!state.orderId) return;
    if (mountedRef.current) return; // evita doppio mount (StrictMode)

    mountedRef.current = true;
    let cancelled = false;

    async function init() {
      try {
        // 1️⃣ carica SDK PayPal
        await loadPaypalSdk(import.meta.env.VITE_PAYPAL_CLIENT_ID);
        if (cancelled) return;

        // 2️⃣ monta i bottoni
        mountPaypalButtons("#paypal-buttons", {
          createOrder: async () => {
            const res = await fetch(
              `${API_BASE}/api/payment/paypal/create-order`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: state.orderId,
                }),
              }
            );

            if (!res.ok) {
              throw new Error("PayPal create-order HTTP error");
            }

            const out = await res.json();
            if (!out.ok || !out.paypalOrderId) {
              throw new Error("Create PayPal order failed");
            }

            return out.paypalOrderId;
          },

          onApprove: async () => {
            const res = await fetch(
              `${API_BASE}/api/payment/paypal/capture-order`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: state.orderId,
                }),
              }
            );

            if (!res.ok) {
              throw new Error("PayPal capture HTTP error");
            }

            const out = await res.json();
            if (!out.ok) {
              throw new Error("Capture failed");
            }

            // ✅ pagamento completato
            window.location.href = "/user/dashboard";
          },

          onError: (err: any) => {
            console.error("PayPal error:", err);
            alert("Errore durante il pagamento. Riprova.");
          },
        });
      } catch (err) {
        console.error("PayPal init error:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [state.orderId]);

  if (!state.orderId) {
    return <p>Ordine non pronto…</p>;
  }

  return (
    <section>
      <h2>Pagamento</h2>
      <div id="paypal-buttons" />
    </section>
  );
}
