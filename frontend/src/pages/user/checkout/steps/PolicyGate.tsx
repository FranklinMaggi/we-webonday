import { useEffect, useState } from "react";
import {
  fetchLatestPolicy,
  acceptPolicyApi,
} from "../../../../lib/policyApi";

interface Props {
  userId: string;
  email: string;
  onAccepted: () => Promise<void>;
}

export default function PolicyGate({ userId, email, onAccepted }: Props) {
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

      await acceptPolicyApi({
        userId,
        email,
        policyVersion,
      });

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
        Per continuare devi accettare la privacy policy
        (versione: <strong>{policyVersion ?? "…"}</strong>)
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={loading || !policyVersion} onClick={accept}>
        Accetta e continua
      </button>
    </section>
  );
}
