import { useEffect, useState } from "react";
import {
  fetchLatestPolicy,
  acceptPolicyApi,
  type PolicyVersion,
} from "../../../../lib/policyApi";

interface Props {
  userId: string;
  email: string;
  onAccepted: () => Promise<void>;
}

export default function PolicyGate({ userId, email, onAccepted }: Props) {
  const [policy, setPolicy] = useState<PolicyVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    fetchLatestPolicy()
      .then(setPolicy)
      .catch(() =>
        setError("Impossibile caricare la privacy policy")
      )
      .finally(() => setLoading(false));
  }, []);

  async function accept() {
    if (!policy) return;

    try {
      setLoading(true);
      setError(undefined);

      await acceptPolicyApi({
        userId,
        email,
        policyVersion: policy.version,
      });

      await onAccepted();
    } catch (e: any) {
      setError(e.message ?? "Errore accettazione policy");
      setLoading(false);
    }
  }

  if (loading) return <p>Caricamento policy…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!policy) return null;

  return (
    <section>
      <h2>Privacy & Termini</h2>

      <small>
        Versione policy: <strong>{policy.version}</strong>
      </small>

      <article
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          maxHeight: 300,
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />

      <button
        disabled={loading}
        onClick={accept}
        style={{ marginTop: 16 }}
      >
        Accetta e continua
      </button>
    </section>
  );
}
