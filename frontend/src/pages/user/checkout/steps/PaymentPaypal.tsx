import { useEffect } from "react";
import { API_BASE } from "../../../../lib/config";
import { loadPaypalSdk, mountPaypalButtons } from "../../../../lib/payments/paypal";

interface Props {
  state: {
    orderId?: string;
  };
}

export default function PaymentPaypal({ state }: Props) {
  useEffect(() => {
    if (!state.orderId) return;

    async function init() {
      // 1️⃣ Carica SDK PayPal
      await loadPaypalSdk(import.meta.env.VITE_PAYPAL_CLIENT_ID);

      // 2️⃣ Monta bottoni
      mountPaypalButtons("#paypal-buttons", {
        createOrder: async () => {
          const res = await fetch(
            `${API_BASE}/api/payment/paypal/create-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ orderId: state.orderId }),
            }
          );

          const out = await res.json();
          if (!out.ok) throw new Error("Create PayPal order failed");
          return out.paypalOrderId;
        },

        onApprove: async () => {
          const res = await fetch(
            `${API_BASE}/api/payment/paypal/capture-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ orderId: state.orderId }),
            }
          );

          const out = await res.json();
          if (!out.ok) throw new Error("Capture failed");

          // redirect o thank-you
          window.location.href = "/user/dashboard";
        },
      });
    }

    init();
  }, [state.orderId]);

  if (!state.orderId) {
    return <p>Ordine non pronto</p>;
  }

  return (
    <section>
      <h2>Pagamento</h2>
      <div id="paypal-buttons" />
    </section>
  );
}
