//pages/policy/policy.tsx
import { useEffect, useState } from "react";
import { fetchLatestPolicy } from "../../lib/policyApi";

export default function PolicyPage() {
  const [content, setContent] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestPolicy()
      .then((p) => {
        setContent(p.content);
        setVersion(p.version);
      })
      .catch(() => {
        setError("Impossibile caricare la policy.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento policy…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>Privacy & Termini</h1>

      <p style={{ opacity: 0.6 }}>
        Versione attuale: <strong>{version}</strong>
      </p>

      <article style={{ whiteSpace: "pre-wrap", marginTop: 24 }}>
        {content}
      </article>
    </section>
  );
}
