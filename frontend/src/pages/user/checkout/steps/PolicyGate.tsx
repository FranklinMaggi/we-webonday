// ======================================================
// FE || pages/user/checkout/steps/PolicyGate.tsx
// ======================================================
// CHECKOUT — POLICY GATE
//
// RUOLO:
// - Blocco legale prima del pagamento
//
// RESPONSABILITÀ:
// - Fetch policy
// - Accettazione policy
//
// NON FA:
// - NON gestisce ordine
// - NON avvia pagamenti
//
// NOTE:
// - Policy legata alla sessione
// ======================================================

import { useEffect, useState } from "react";
import { fetchLatestPolicy, acceptPolicy } from "../../../../lib/policyApi";

interface Props {
  onAccepted: () => Promise<void>;
}

export default function PolicyGate({ onAccepted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [policyVersion, setPolicyVersion] = useState<string>();

  // 🔹 carica policy dal BE
  useEffect(() => {
    fetchLatestPolicy()
      .then((p) => setPolicyVersion(p.version))
      .catch(() => setError("Impossibile caricare la policy"));
  }, []);

  async function accept() {
    if (!policyVersion) return;

    try {
      setLoading(true);
      setError(undefined);

      await acceptPolicy(policyVersion);

      await onAccepted();
    } catch (e: any) {
      setError(e.message ?? "Errore accettazione policy");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Privacy & Termini</h2>

      <p>
        Per continuare devi accettare la privacy policy (versione:{" "}
        <strong>{policyVersion ?? "…"}</strong>)
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={loading || !policyVersion} onClick={accept}>
        Accetta e continua
      </button>
    </section>
  );
}
