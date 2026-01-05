// ======================================================
// FE || pages/user/login/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER LOGIN PAGE (STABLE)
//
// RUOLO:
// - Punto UNICO di ingresso per login / registrazione
//
// GARANZIE:
// - Nessun auto-login
// - Nessun fetch user implicito
// - Redirect SEMPRE esplicito
//
// ======================================================

import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { API_BASE } from "../../../lib/config";

export default function UserLoginPage() {
  /* ===========================
     STORE AUTH (INTENZIONALE)
  =========================== */
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const markExplicitLogin = useAuthStore((s) => s.markExplicitLogin);

  const navigate = useNavigate();
  const location = useLocation();

  /* ===========================
     REDIRECT TARGET (SAFE)
  =========================== */
  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/user/dashboard";
  }, [location.search]);

  /* ===========================
     FORM STATE
  =========================== */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ===========================
     POST-LOGIN PIPELINE (UNICO)
  =========================== */
  async function completeLogin() {
    // 1️⃣ login volontario
    markExplicitLogin();

    // 2️⃣ carica utente dalla sessione HttpOnly
    await fetchUser();

    // 3️⃣ redirect finale
    navigate(redirect, { replace: true });
  }

  /* ===========================
     LOGIN EMAIL / PASSWORD
  =========================== */
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

      await completeLogin();
    } catch {
      setErrorMsg("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  /* ===========================
     REGISTRAZIONE
  =========================== */
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

      await completeLogin();
    } catch {
      setErrorMsg("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  /* ===========================
     GOOGLE OAUTH
  =========================== */
  function googleLogin() {
    const url = new URL(`${API_BASE}/api/user/google/auth`);
    url.searchParams.set("redirect", redirect);
    window.location.href = url.toString();
  }

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Area Cliente</h1>
        <p className="login-subtitle">
          Accedi o registrati per continuare
        </p>

        <button
          onClick={googleLogin}
          className="login-google-btn"
          disabled={loading}
        >
          <span className="google-icon">G</span>
          Accedi con Google
        </button>

        <div className="login-divider">
          <span>oppure</span>
        </div>

        <div className="login-form">
          <input
            className="login-input"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <p className="login-error">{errorMsg}</p>}

          <button
            disabled={loading}
            onClick={login}
            className="login-primary-btn"
          >
            {loading ? "Accesso…" : "Accedi"}
          </button>

          <button
            disabled={loading}
            onClick={register}
            className="login-secondary-btn"
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  );
}
