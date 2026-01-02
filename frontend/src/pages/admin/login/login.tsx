// ======================================================
// FE || pages/admin/login/login.tsx
// ======================================================
// ADMIN — LOGIN TOKEN BASED
//
// RUOLO:
// - Autenticazione admin tramite token
//
// RESPONSABILITÀ:
// - Raccolta token
// - Salvataggio token client-side
// - Redirect alla dashboard
//
// NON FA:
// - NON valida token
// - NON gestisce ruoli
//
// NOTE:
// - Sicurezza demandata al backend
// - Token usato solo per chiamate adminApi
// ======================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../../../lib/adminApi";

export default function AdminLoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (token.trim().length < 10) {
      setError("Token non valido");
      return;
    }

    setAdminToken(token);
    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Admin Login</h1>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Admin token"
      />

      {error && <p>{error}</p>}

      <button type="submit">Entra</button>
    </form>
  );
}
