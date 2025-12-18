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
  submitOrder: (policyVersion: string) => Promise<string>;
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

      // 1️⃣ accetta policy
      await acceptPolicyApi({
        userId,
        email,
        policyVersion,
      });

      // 2️⃣ crea ordine (KV)
      const oid = await submitOrder(policyVersion);

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
    <div className="checkout-page">
      <section className="checkout-card">
  
        <h2 className="checkout-title">Checkout</h2>
  
        <ul className="checkout-list">
          {cart.map((item, idx) => (
            <li key={idx} className="checkout-item">
              <span className="checkout-item-title">{item.title}</span>
              <strong>{eur.format(item.total)}</strong>
            </li>
          ))}
        </ul>
  
        <div className="checkout-total">
          Totale <strong>{eur.format(total)}</strong>
        </div>
  
        {!accepted && (
          <div className="checkout-action">
            <p className="checkout-policy">
              Procedendo accetti i Termini e la Privacy Policy (v.
              {policyVersion ?? "…"}).
            </p>
  
            {error && <p className="checkout-error">{error}</p>}
  
            <button
              onClick={acceptAndPay}
              disabled={loading || !policyVersion}
              className="checkout-pay-btn"
            >
              {loading ? "Preparazione pagamento…" : "Paga con PayPal"}
            </button>
          </div>
        )}
  
        {accepted && orderId && (
          <div className="checkout-paypal">
            <PaymentPaypal state={{ orderId }} />
          </div>
        )}
      </section>
    </div>
  );
  
}
