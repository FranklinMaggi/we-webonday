// frontend/src/pages/admin/utils/login.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAdminToken } from "./adminToken";

/**
 * /admin/login
 * - Inserisci token admin
 * - Salva in sessionStorage
 * - Redirect a next (se presente) oppure /admin/dashboard
 */
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const next = useMemo(() => {
    const raw = params.get("next");
    return raw ? decodeURIComponent(raw) : "/admin/dashboard";
  }, [params]);

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = token.trim();
    if (t.length < 10) {
      // soglia minima solo per evitare invii vuoti/banali
      setError("Token non valido.");
      return;
    }

    setAdminToken(t);
    navigate(next, { replace: true });
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Admin Login</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Inserisci il token admin. Verrà salvato in sessionStorage (solo questa scheda/browser session).
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Admin token</span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="x-admin-token…"
            autoFocus
            style={{ padding: 10, fontSize: 14 }}
          />
        </label>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

        <button type="submit" style={{ padding: 10, fontWeight: 600 }}>
          Entra
        </button>
      </form>
    </div>
  );
}
