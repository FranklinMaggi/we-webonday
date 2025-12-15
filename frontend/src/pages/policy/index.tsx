import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/config";


export default function PolicyPage() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect") ?? "/user/checkout";

  const [policyText, setPolicyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [policyVersion, setPolicyVersion] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPolicy() {
      try {
        const res = await fetch(
         `${API_BASE}/api/policy/version/latest`
        );
        const out = await res.json();

        setPolicyVersion(out.version ?? "v1");

        const contentRes = await fetch(
         `${API_BASE}/api/policy/content?version=${out.version}`

        );
        const content = await contentRes.text();
        setPolicyText(content);
      } catch (err) {
        setError("Errore nel caricamento della policy.");
      } finally {
        setLoading(false);
      }
    }

    loadPolicy();
  }, []);

  const handleAccept = async () => {
    const userId = localStorage.getItem("webonday_user_v1");
    const email = localStorage.getItem("webonday_user_email") ?? "unknown@webonday.it";

    if (!userId) {
      alert("Devi effettuare l'accesso prima di accettare la policy.");
      window.location.href =
        "/user/login?redirect=" + encodeURIComponent(redirect);
      return;
    }

    const res = await fetch(`${API_BASE}/api/policy/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email,
        policyVersion,
      }),
    });

    if (res.ok) {
      window.location.href = redirect;
    } else {
      const txt = await res.text();
      alert("Errore durante l'accettazione: " + txt);
    }
  };

  if (loading) {
    return <p>Caricamento policy...</p>;
  }

  return (
    <div className="policy-page" style={{ padding: "40px" }}>
      <h1>Termini e Condizioni</h1>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{policyText}</pre>
      )}

      <button onClick={handleAccept}>Accetto e continuo</button>
    </div>
  );
}
