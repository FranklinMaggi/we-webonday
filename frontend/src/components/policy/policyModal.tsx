// src/components/policy/PolicyModal.tsx
import { useEffect, useState } from "react";
import {
  fetchLatestPolicy,
  fetchPolicyStatus,
  acceptPolicyApi,
  type PolicyVersion,
} from "../../lib/policyApi";
import { getOrCreateVisitorId } from "../../utils/visitor"; // o dal tuo file esistente

type Props = {
  // Se in futuro avrai un vero userId da auth, puoi passarlo qui
  userEmail?: string;
};

export function PolicyModal({ userEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [policy, setPolicy] = useState<PolicyVersion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const latest = await fetchLatestPolicy();
        setPolicy(latest);

        const status = await fetchPolicyStatus(visitorId);

        // Se non ha mai accettato o la versione è diversa → apri modale
        if (!status.accepted || status.policyVersion !== latest.version) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Impossibile recuperare le informazioni sulla policy.");
        // In caso di errore, per compliance è meglio mostrare comunque la policy
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, []);

  async function handleAccept() {
    if (!policy) return;
    const visitorId = getOrCreateVisitorId();

    try {
      setAccepting(true);
      await acceptPolicyApi({
        userId: visitorId,
        email: userEmail,
        policyVersion: policy.version,
      });
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      setError("Errore durante il salvataggio della tua accettazione.");
    } finally {
      setAccepting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          width: "min(800px, 90vw)",
          maxHeight: "80vh",
          background: "#050509",
          color: "#f5f5f5",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem" }}>
              Termini & Policy WebOnDay
            </h2>
            {policy && (
              <p style={{ margin: "4px 0", fontSize: "0.8rem", opacity: 0.8 }}>
                Versione: <strong>{policy.version}</strong> · Hash:{" "}
                <code style={{ fontSize: "0.7rem" }}>
                  {policy.hash.slice(0, 16)}…
                </code>
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            background: "#090912",
            borderRadius: "12px",
            border: "1px solid #222",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {loading && <p>Caricamento policy in corso…</p>}
          {!loading && policy && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {policy.content}
            </pre>
          )}
          {!loading && !policy && <p>Nessuna policy disponibile.</p>}
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>
            {error}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {/* In ottica compliance, NON mettiamo un vero "Rifiuto" qui.
              Il rifiuto deve equivalere a non usare il servizio. 
              Per ora, lasciamo solo "Accetto" e la X è opzionale o disabilita l'accesso. */}
          <button
            onClick={handleAccept}
            disabled={accepting || loading || !policy}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              background: "#00ff99",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {accepting ? "Salvataggio..." : "Accetto i termini"}
          </button>
        </div>
      </div>
    </div>
  );
}
