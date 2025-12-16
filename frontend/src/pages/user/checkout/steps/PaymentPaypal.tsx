import { useEffect, useRef } from "react";
import { loadPaypalSdk, mountPaypalButtons } from "../../../../lib/payments/paypal";
import { API_BASE } from "../../../../lib/config";

interface Props {
  state: {
    orderId?: string;
  };
}

export default function PaymentPaypal({ state }: Props) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!state.orderId) return;
    if (mounted.current) return;
    mounted.current = true;

    async function initPaypal() {
      try {
        // 🔹 carica SDK PayPal
        await loadPaypalSdk(import.meta.env.VITE_PAYPAL_CLIENT_ID);

        // 🔹 monta bottoni
        mountPaypalButtons("#paypal-buttons", {
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },

          // 🔹 crea ordine PayPal
          createOrder: async () => {
            const res = await fetch(
              `${API_BASE}/api/paypal/create-order`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  internalOrderId: state.orderId,
                }),
              }
            );

            if (!res.ok) {
              throw new Error("Errore creazione ordine PayPal");
            }

            const data = await res.json();
            return data.paypalOrderId;
          },

          // 🔹 conferma pagamento
          onApprove: async (data: any) => {
            const res = await fetch(
              `${API_BASE}/api/paypal/capture-order`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                  internalOrderId: state.orderId,
                }),
              }
            );

            if (!res.ok) {
              throw new Error("Errore conferma pagamento");
            }

            alert("Pagamento completato con successo");
            window.location.href = "/"; // oppure /user/dashboard
          },

          onError: (err: any) => {
            console.error("PayPal error:", err);
            alert("Errore PayPal, riprova.");
          },
        });
      } catch (e) {
        console.error(e);
      }
    }

    initPaypal();
  }, [state.orderId]);

  if (!state.orderId) {
    return <p>Ordine non pronto</p>;
  }

  return (
    <section style={{ maxWidth: 420 }}>
      <h2>Pagamento</h2>
      <p>Ordine #{state.orderId}</p>

      <div id="paypal-buttons" />
    </section>
  );
}
