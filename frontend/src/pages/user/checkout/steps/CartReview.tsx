// FE || pages/user/checkout/steps/CartReview.tsx
// ======================================================
// CHECKOUT — CART REVIEW (TRASPARENTE)
// ======================================================
//
// RESPONSABILITÀ:
// - Mostrare riepilogo ordine
// - Accettare policy
// - Avviare pagamento PayPal (SOLO AVVIO)
//
// NON FA:
// - calcoli di business
// - gestione canoni
//
// ======================================================

import { useEffect, useState, useMemo } from "react";
import type { CartItem } from "../../../../lib/cartStore";
import { eur } from "../../../../utils/format";
import PaymentPaypal from "./PaymentPaypal";
import {
  fetchLatestPolicy,
  acceptPolicy,
} from "../../../../lib/policyApi";

interface Props {
  cart: CartItem[];
  submitOrder: (policyVersion: string) => Promise<string>;
}

export default function CartReview({ cart, submitOrder }: Props) {
  // =========================
  // TOTALI (ESPLICITI)
  // =========================
  const startupTotal = useMemo(
    () => cart.reduce((s, i) => s + (i.startupFee ?? 0), 0),
    [cart]
  );

  const yearlyTotal = useMemo(
    () => cart.reduce((s, i) => s + (i.yearlyFee ?? 0), 0),
    [cart]
  );

  const monthlyTotal = useMemo(
    () => cart.reduce((s, i) => s + (i.monthlyFee ?? 0), 0),
    [cart]
  );

  // =========================
  // POLICY & PAY
  // =========================
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
      await acceptPolicy(policyVersion);

      // 2️⃣ crea ordine (KV)
      const oid = await submitOrder(policyVersion);

      // 3️⃣ abilita PayPal
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

  // =========================
  // RENDER
  // =========================
  return (
    <div className="checkout-page">
      <section className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>

        <ul className="checkout-list">
          {cart.map((item, idx) => (
            <li key={idx} className="checkout-item">
              <span className="checkout-item-title">{item.title}</span>

              {item.startupFee > 0 && (
                <span>{eur.format(item.startupFee)} avvio</span>
              )}

              {item.yearlyFee > 0 && (
                <span>{eur.format(item.yearlyFee)} / anno</span>
              )}

              {item.monthlyFee > 0 && (
                <span>{eur.format(item.monthlyFee)} / mese</span>
              )}
            </li>
          ))}
        </ul>

        {/* PAGAMENTO IMMEDIATO */}
        <div className="checkout-total">
          Da pagare ora{" "}
          <strong>{eur.format(startupTotal)}</strong>
        </div>

        {/* NOTE CANONI */}
        {(yearlyTotal > 0 || monthlyTotal > 0) && (
          <p className="checkout-note">
            I canoni ricorrenti non vengono addebitati ora.
            <br />
            Annuale: {eur.format(yearlyTotal)} / anno — Mensile:{" "}
            {eur.format(monthlyTotal)} / mese
          </p>
        )}

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
