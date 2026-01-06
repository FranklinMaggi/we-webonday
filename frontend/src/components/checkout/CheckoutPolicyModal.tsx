// ======================================================
// FE || components/checkout/CheckoutPolicyModal.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Mostra Policy Checkout
// - Richiede accettazione esplicita
// - BLOCCA pagamento se non accettata
//
// INVARIANTI:
// - Scope = checkout
// - Versione = latest
// - Stato persistente via BE
//
// ======================================================

import { useEffect, useState } from "react";

type CheckoutPolicy = {
  version: string;
  title: string;
  content: {
    sections: {
      id: string;
      title: string;
      text: string;
    }[];
  };
};

export function CheckoutPolicyModal({
  onAccepted,
}: {
  onAccepted: () => void;
}) {
  const [policy, setPolicy] = useState<CheckoutPolicy | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/version/latest?scope=checkout`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then(setPolicy)
      .finally(() => setLoading(false));
  }, []);

  async function acceptPolicy() {
    if (!policy) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "checkout",
          policyVersion: policy.version,
        }),
      }
    );

    onAccepted();
  }

  if (loading || !policy) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{policy.title}</h2>

        <div className="policy-content">
          {policy.content.sections.map((s) => (
            <section key={s.id}>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </section>
          ))}
        </div>

        <label style={{ marginTop: 20, display: "block" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />{" "}
          Dichiaro di aver letto e accettato i Termini di Acquisto
        </label>

        <button
          disabled={!checked}
          onClick={acceptPolicy}
          style={{ marginTop: 20 }}
        >
          Conferma e continua
        </button>
      </div>
    </div>
  );
}
