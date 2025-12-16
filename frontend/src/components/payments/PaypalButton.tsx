import { useEffect, useRef } from "react";

type Props = {
  orderId: string; // ID ordine interno (KV)
};

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PaypalButton({ orderId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal || !ref.current) return;

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "pill",
        label: "paypal",
      },

      // 1️⃣ crea ordine PayPal
      createOrder: async () => {
        const res = await fetch("/api/payment/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        if (!data.paypalOrderId) {
          throw new Error("Errore creazione ordine PayPal");
        }

        return data.paypalOrderId;
      },

      // 2️⃣ capture = SOLDI
      onApprove: async () => {
        const res = await fetch("/api/payment/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (data.paymentStatus === "paid") {
          alert("Pagamento completato ✅");
          // qui puoi redirect / thank you page
        } else {
          alert("Pagamento non completato");
        }
      },

      onError: (err: any) => {
        console.error("PayPal error:", err);
        alert("Errore PayPal");
      },
    }).render(ref.current);
  }, [orderId]);

  return <div ref={ref} />;
}
