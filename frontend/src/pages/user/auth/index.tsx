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
// INVARIANTI:
// - Tutte le chiamate FE → BE passano da apiFetch
// - credentials: "include" è gestito DAL CLIENT
// - redirect controllato via query
//
// ======================================================

import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
 import { useAuthStore } from "../../../lib/store/auth.store";
import { apiFetch } from "../../../lib/api";




export default function UserLoginPage() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const navigate = useNavigate();
  const location = useLocation();

  /* ======================================================
     REDIRECT SAFE
  ====================================================== */
  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/user/dashboard";
  }, [location.search]);


  /* ======================================================
     STATE
  ====================================================== */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ======================================================
     LOGIN (PASSWORD)
  ====================================================== */
  async function login() {
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiFetch("/api/user/login", {
        method: "POST",
        credentials:"include",
        body: JSON.stringify({ email, password }),
      });

      // 🔑 session cookie creato dal backend
      await fetchUser();

      navigate(redirect, { replace:true});
    } catch (err) {
      setErrorMsg("Email o password non validi");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     REGISTER (PASSWORD)
  ====================================================== */
  async function register() {
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiFetch("/api/user/register", {
        method: "POST",
        credentials:"include",
        body: JSON.stringify({ email, password }),
      });

      // 🔑 session cookie creato dal backend
      await fetchUser();

      navigate(redirect ,{replace:true});
    } catch (err) {
      setErrorMsg("Registrazione fallita. Email già in uso?");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     GOOGLE OAUTH (REDIRECT HARD)
  ====================================================== */
  function googleLogin() {
    
    const url = new URL("/api/user/google/auth", window.location.origin);
    url.searchParams.set("redirect", redirect);

    window.location.href = url.toString();
  }

  /* ======================================================
     UI
  ====================================================== */
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

          {errorMsg && <p className="login-error">{errorMsg}</p>}

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
