// ======================================================
// FE || components/policy/PolicyViewer.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Viewer UNICO delle policy
// - Riutilizzato da:
//   - pagine legali
//   - checkout
//
// INVARIANTI:
// - Read-only
// - Nessuna accettazione
// - Usa SOLO policyApi
//
// ======================================================

// Viewer unico policy (general / checkout)

import { useEffect, useState } from "react";
import { fetchLatestPolicy, type PolicyDTO, type PolicyScope } from "../../lib/userApi/policy.user.api";

export function PolicyViewer({ scope }: { scope: PolicyScope }) {
  const [policy, setPolicy] = useState<PolicyDTO | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestPolicy(scope)
      .then(setPolicy)
      .catch(() => setError("Impossibile caricare la policy."));
  }, [scope]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!policy) return <p>Caricamento policy…</p>;

  return (
    <section style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>{policy.content.title}</h1>

      <p style={{ opacity: 0.6 }}>
        Versione {policy.version} · Aggiornata il{" "}
        {new Date(policy.content.updatedAt).toLocaleDateString()}
      </p>

      <article style={{ whiteSpace: "pre-wrap", marginTop: 24 }}>
        {policy.content.body}
      </article>
    </section>
  );
}
