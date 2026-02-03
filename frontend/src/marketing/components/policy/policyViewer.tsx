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
import { t } from "@src/shared/aiTranslateGenerator";
import { useEffect, useState } from "react";
import { fetchLatestPolicy, type PolicyDTO, type PolicyScope } from "@src/marketing/components/policy/api/policy.user.api";
import { type PolicyType } from "./api/policy.types";
import ReactMarkdown from "react-markdown";


export function PolicyViewer({
  type,
  scope,
}: {
  type: PolicyType;
  scope: PolicyScope;
}) 
{

  const [policy, setPolicy] = useState<PolicyDTO | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchLatestPolicy(type, scope)
      .then(setPolicy)
      .catch(() => setError(t("policy.load_error")));
  }, [type, scope]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!policy) return <p>{t("policy.loading")}</p>;
  if (!policy.content) {
    return <p>{t("policy.invalid")}</p>;
  }
  return (
    <section style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>{policy.content.title}</h1>

      <p style={{ opacity: 0.6 }}>
  {t("policy.version_label", {
    version: policy.version,
    date: new Date(policy.content.updatedAt).toLocaleDateString(),
  })}
</p>

<article className="policy-body">
  <ReactMarkdown>
    {policy.content.body}
  </ReactMarkdown>
</article>
    </section>
  );
}
