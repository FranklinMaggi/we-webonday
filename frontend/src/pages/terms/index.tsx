// ======================================================
// FE || pages/terms/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina informativa "Termini & Condizioni"
// - Renderizza POLICY scope=general
//
// INVARIANTI:
// - NON blocca flussi
// - NON richiede accettazione
// - Read-only
//
// ======================================================

import { useEffect, useState } from "react";

type PolicyGeneral = {
  title: string;
  version: string;
  updatedAt?: string;
  content: string;
};

export default function TermsPage() {
  const [policy, setPolicy] = useState<PolicyGeneral | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/version/latest?scope=general`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.content) {
          setPolicy(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Caricamento termini…</p>;
  }

  if (!policy) {
    return <p>Policy non disponibile.</p>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1>{policy.title}</h1>
      <p>
        <strong>Versione:</strong> {policy.version}
      </p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          marginTop: 24,
          lineHeight: 1.6,
        }}
      >
        {policy.content}
      </pre>
    </main>
  );
}
