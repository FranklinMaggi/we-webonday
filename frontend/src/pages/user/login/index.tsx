// ======================================================
// FE || pages/user/login/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER LOGIN PAGE
//
// RUOLO:
// - Punto UNICO di ingresso per l’autenticazione utente
//
// PRINCIPI NON NEGOZIABILI:
// - Nessun login automatico
// - Nessun fetch user al mount
// - Login valido SOLO se:
//   1) azione volontaria dell’utente
//   2) FE marca esplicitamente il login
//
// FLUSSO CORRETTO:
// - User arriva qui (?redirect=...)
// - Sceglie metodo di login
// - Backend crea sessione HttpOnly
// - FE marca login intenzionale
// - FE carica user (/api/user/me)
// - Redirect finale
//
// ======================================================

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { API_BASE } from "../../../lib/config";

export default function UserLoginPage() {
  // ===========================
  // AUTH STORE (INTENZIONALE)
  // ===========================
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const markExplicitLogin = useAuthStore((s) => s.markExplicitLogin);

  const navigate = useNavigate();
  const location = useLocation();

  // ===========================
  // REDIRECT TARGET
  // ===========================
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/user";

  // ===========================
  // FORM STATE
  // ===========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===========================
  // POST-LOGIN SUCCESS (UNICO)
  // ===========================
  async function onLoginSuccess() {
    // 1️⃣ marca login come intenzionale
    markExplicitLogin();

    // 2️⃣ carica user dalla sessione HttpOnly
    await fetchUser();

    // 3️⃣ redirect finale
    navigate(redirect, { replace: true });
  }

  // ===========================
  // LOGIN EMAIL / PASSWORD
  // ===========================
  async function login() {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const out = await res.json();

      if (!out.ok) {
        setErrorMsg("Email o password non validi");
        return;
      }

      await onLoginSuccess();
    } catch {
      setErrorMsg("Errore di rete, riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  // ===========================
  // REGISTRAZIONE
  // ===========================
  async function register() {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const out = await res.json();

      if (!out.ok) {
        setErrorMsg("Registrazione fallita. Email già in uso?");
        return;
      }

      await onLoginSuccess();
    } catch {
      setErrorMsg("Errore di rete, riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  // ===========================
  // LOGIN GOOGLE OAUTH
  // ===========================
  function googleLogin() {
    const url = new URL(`${API_BASE}/api/user/google/auth`);
    url.searchParams.set("redirect", redirect);

    // Redirect esterno → rientro su /login
    window.location.href = url.toString();
  }

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Area Cliente</h1>
        <p className="login-subtitle">
          Accedi o registrati per continuare
        </p>

        <button onClick={googleLogin} className="login-google-btn">
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
