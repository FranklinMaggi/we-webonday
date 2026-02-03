// ======================================================
// FE || Checkout — CartReview (FINAL, CLEAN)
// ======================================================
//
// RUOLO:
// - Riepilogo finale ordine
// - Accettazione policy
// - Avvio pagamento PayPal
//
// SOURCE OF TRUTH:
// - configuration + pricing (BE)
//
// ======================================================

import { useEffect, useState } from "react";
import { eur } from "../../../../../shared/utils/format";
import PaymentPaypal from "./PaymentPaypal";
import { fetchLatestPolicy } from "../../../../../marketing/components/policy/api/policy.user.api";

interface PricingLine {
  label: string;
  amount: number;
  type: "startup" | "monthly" | "yearly";
}

interface Pricing {
  startupTotal: number;
  yearlyTotal: number;
  monthlyTotal: number;
  lines: PricingLine[];
}

interface Configuration {
  solutionName: string;
  productName: string;
}

interface Props {
  submitOrder: (policyVersion: string) => Promise<string>;
  configuration: Configuration;
  pricing: Pricing;
  loading?: boolean;
}

export default function CartReview({
  submitOrder,
  configuration,
  pricing,
  loading = false,
}: Props) {
  const [policyVersion, setPolicyVersion] = useState<string>();
  const [accepted, setAccepted] = useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [error, setError] = useState<string>();
  const [paying, setPaying] = useState(false);

  /* =========================
     LOAD POLICY
  ========================= */
  useEffect(() => {
    fetchLatestPolicy("checkout")
      .then((p) => setPolicyVersion(p.version))
      .catch(() =>
        setError("Impossibile caricare la policy")
      );
  }, []);

  /* =========================
     CREATE ORDER
  ========================= */
  async function acceptAndPay() {
    if (!policyVersion) return;

    try {
      setPaying(true);
      setError(undefined);

      const oid = await submitOrder(policyVersion);

      setOrderId(oid);
      setAccepted(true);
    } catch (e: any) {
      setError(e.message ?? "Errore checkout");
    } finally {
      setPaying(false);
    }
  }

  if (loading) return <p>Preparazione checkout…</p>;
  if (!configuration || !pricing)
    return <p>Dati checkout non disponibili</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="checkout-page">
      <section className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>

        {/* CONFIGURATION */}
        <ul className="checkout-list">
          <li className="checkout-item">
            <strong>{configuration.solutionName}</strong>
            <span>{configuration.productName}</span>
          </li>

          {pricing.lines.map((l, i) => (
            <li key={i} className="checkout-item">
              <span>{l.label}</span>
              <span>
                {eur.format(l.amount)}
                {l.type === "monthly" && " / mese"}
                {l.type === "yearly" && " / anno"}
              </span>
            </li>
          ))}
        </ul>

        {/* PAY NOW */}
        <div className="checkout-total">
          Da pagare ora{" "}
          <strong>
            {eur.format(pricing.startupTotal)}
          </strong>
        </div>

        {/* RECURRING NOTE */}
        {(pricing.yearlyTotal > 0 ||
          pricing.monthlyTotal > 0) && (
          <p className="checkout-note">
            I canoni ricorrenti non vengono addebitati ora.
            <br />
            Annuale:{" "}
            {eur.format(pricing.yearlyTotal)} / anno
            — Mensile:{" "}
            {eur.format(pricing.monthlyTotal)} / mese
          </p>
        )}

        {!accepted && (
          <div className="checkout-action">
            <p className="checkout-policy">
              Procedendo accetti i{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Termini e la Privacy Policy
              </a>{" "}
              (versione {policyVersion ?? "…"}).
            </p>

            {error && (
              <p className="checkout-error">{error}</p>
            )}

            <button
              onClick={acceptAndPay}
              disabled={paying || !policyVersion}
              className="checkout-pay-btn"
            >
              {paying
                ? "Preparazione pagamento…"
                : "Paga con PayPal"}
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
