// FE || pages/user/login/index.tsx
// ======================================================
// FE || pages/user/auth/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER AUTH ENTRY
//
// RUOLO:
// - Login e registrazione utente
// - Creazione sessione sicura (cookie httpOnly)
//
// SOURCE OF TRUTH:
// - Backend auth (session-based)
//
// COSA FA:
// - Login email/password
// - Login Google OAuth
// - Redirect post-auth
//
// COSA NON FA:
// - NON gestisce profilo
// - NON carica dati dashboard
//
// INVARIANTI:
// - credentials: "include" SEMPRE
// - redirect controllato via query
//
// ======================================================

import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../lib/store/auth.store";
import { API_BASE } from "../../../lib/config";

export default function UserLoginPage() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/user/dashboard";
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function login() {
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const out = await res.json();
      if (!out?.ok) {
        setErrorMsg("Email o password non validi");
        return;
      }

      // 🔑 backend ha creato la sessione
      await fetchUser();

      navigate(redirect, { replace: true });
    } catch {
      setErrorMsg("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const out = await res.json();
      if (!out?.ok) {
        setErrorMsg("Registrazione fallita. Email già in uso?");
        return;
      }

      await fetchUser();
      navigate(redirect, { replace: true });
    } catch {
      setErrorMsg("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  function googleLogin() {
    const url = new URL(`${API_BASE}/api/user/google/auth`);
    url.searchParams.set("redirect", redirect);
    window.location.href = url.toString();
  }
  return (
    <div className="login-page">
      <div className="login-card">
  
        <h1 className="login-title">Area Cliente</h1>
        <p className="login-subtitle">
          Accedi o crea il tuo account WebOnDay
        </p>
  
        <button
          className="login-google-btn"
          onClick={googleLogin}
          disabled={loading}
        >
          Accedi con Google
        </button>
  
        <div className="login-divider">oppure</div>
  
        <div className="login-form">
          <input
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          {errorMsg && (
            <p className="login-error">{errorMsg}</p>
          )}
  
          <button
            className="login-primary-btn"
            onClick={login}
            disabled={loading}
          >
            Accedi
          </button>
  
          <button
            className="login-secondary-btn"
            onClick={register}
            disabled={loading}
          >
            Registrati
          </button>
        </div>
  
        <p className="login-hint">
          L’accesso crea automaticamente una sessione sicura
        </p>
  
      </div>
    </div>
  );
  
}
