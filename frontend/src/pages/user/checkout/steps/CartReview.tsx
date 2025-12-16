// src/pages/user/checkout/steps/CartReview.tsx
import { useEffect, useState } from "react";
import type { CartItem } from "../../../../lib/cartStore";
import { eur } from "../../../../utils/format";
import PaymentPaypal from "./PaymentPaypal";
import {
  fetchLatestPolicy,
  acceptPolicyApi,
} from "../../../../lib/policyApi";

interface Props {
  cart: CartItem[];
  userId: string;
  email: string;
  submitOrder: () => Promise<string>;
}

export default function CartReview({
  cart,
  userId,
  email,
  submitOrder,
}: Props) {
  const total = cart.reduce((s, i) => s + i.total, 0);

  const [policyVersion, setPolicyVersion] = useState<string>();
  const [accepted, setAccepted] = useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchLatestPolicy()
      .then((p) => setPolicyVersion(p.version))
      .catch(() => setError("Impossibile caricare la policy"));
  }, []);

  async function acceptAndPay() {
    if (!policyVersion) return;

    try {
      setLoading(true);
      setError(undefined);

      // 1️⃣ accettazione policy (KV)
      await acceptPolicyApi({
        userId,
        email,
        policyVersion,
      });

      // 2️⃣ creazione ordine (KV)
      const oid = await submitOrder();

      // 3️⃣ mostra PayPal
      setOrderId(oid);
      setAccepted(true);
    } catch (e: any) {
      setError(e.message ?? "Errore checkout");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return <p>Il carrello è vuoto</p>;
  }

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h2>Checkout</h2>

      {/* ===== RIEPILOGO ===== */}
      <ul>
        {cart.map((item, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>{item.title}</span>
            <strong>{eur.format(item.total)}</strong>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 16, fontSize: 18 }}>
        <strong>Totale: {eur.format(total)}</strong>
      </div>

      {/* ===== BADGE FIDUCIA ===== */}
      <div
        style={{
          marginTop: 20,
          padding: 12,
          borderRadius: 8,
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-around",
          fontSize: 13,
        }}
      >
        <span>🔒 Pagamento sicuro</span>
        <span>🛡️ Protezione PayPal</span>
        <span>⚡ Attivazione rapida</span>
      </div>

      {/* ===== POLICY + CTA ===== */}
      {!accepted && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 13, opacity: 0.7 }}>
            Procedendo accetti i Termini e la Privacy Policy (v.
            {policyVersion ?? "…"}).
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={acceptAndPay}
            disabled={loading || !policyVersion}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 8,
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {loading ? "Preparazione pagamento…" : "Paga con PayPal"}
          </button>
        </div>
      )}

      {/* ===== PAYPAL INLINE ===== */}
      {accepted && orderId && (
        <div style={{ marginTop: 24 }}>
          <PaymentPaypal state={{ orderId }} />
        </div>
      )}
    </section>
  );
}
