import { useState } from "react";
import { API_BASE } from "../../../lib/config";
export default function UserLoginPage() {
  // ===========================
  // GESTIONE REDIRECT
  // ===========================

  const DEFAULT_PATH = "/user/checkout";

  const params = new URLSearchParams(window.location.search);
  const redirectParam = params.get("redirect") ?? DEFAULT_PATH;

  // Se è già un URL assoluto (inizia con http/https), la uso così com'è.
  // Altrimenti la trasformo in un URL assoluto sull'origin corrente
  // (es. http://localhost:5173 o https://webonday.it)
  const redirect =
    redirectParam.startsWith("http://") ||
    redirectParam.startsWith("https://")
      ? redirectParam
      : window.location.origin + redirectParam;

  // ===========================
  // STATE FORM
  // ===========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===========================
  // LOGIN MANUALE (email + password)
  // ===========================
  const login = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const out = await res.json();
      setLoading(false);

      if (!out.ok) {
        setErrorMsg("Email o password non validi");
        return;
      }

      // SALVA USER ID (versione localStorage)
      localStorage.setItem("webonday_user_v1", out.user.id);
      localStorage.setItem("webonday_user_email", email);

      // REDIRECT POST LOGIN (assoluto: localhost o dominio)
      window.location.href = redirect;
    } catch (err) {
      setLoading(false);
      setErrorMsg("Errore di rete, riprova più tardi.");
    }
  };

  // ===========================
  // REGISTRAZIONE
  // ===========================
  const register = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const out = await res.json();
      setLoading(false);

      if (!out.ok) {
        setErrorMsg("Registrazione fallita. Email già in uso?");
        return;
      }

  
      window.location.href = redirect;
    } catch (err) {
      setLoading(false);
      setErrorMsg("Errore di rete, riprova più tardi.");
    }
  };

  // ===========================
  // LOGIN GOOGLE
  // ===========================
  const googleLogin = () => {
    // costruisco l'URL via URL API per avere encode automatico
    const url = new URL(
      `${API_BASE}/api/user/google/auth`
    );
    url.searchParams.set("redirect", redirect);

    window.location.href = url.toString();
  };

  return (
    <div className="user-login-page" style={{ padding: "40px" }}>
      <h1>Area Cliente</h1>

      {/* LOGIN CON GOOGLE */}
      <button onClick={googleLogin} className="google-btn">
        Accedi con Google
      </button>

      <hr />

      {/* FORM LOGIN MANUALE */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMsg && (
        <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>
      )}

      <button disabled={loading} onClick={login}>
        Accedi
      </button>

      <button disabled={loading} onClick={register}>
        Registrati
      </button>
    </div>
  );
}
