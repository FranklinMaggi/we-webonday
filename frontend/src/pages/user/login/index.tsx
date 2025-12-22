import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { API_BASE } from "../../../lib/config";

export default function UserLoginPage() {
  // ===========================
  // AUTH + REDIRECT LOGIC
  // ===========================
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const navigate = useNavigate();
  const location = useLocation();
  // 🔁 Rileggi l'utente quando torni da Google OAuth
useEffect(() => {
  if (!ready) {
    fetchUser();
  }
}, [ready, fetchUser]);
  // 🔁 Redirect automatico DOPO login
  useEffect(() => {
    if (!ready || !user) return;

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    navigate(redirect || "/", { replace: true });
  }, [ready, user, location.search, navigate]);

  // ===========================
  // STATE FORM
  // ===========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===========================
  // LOGIN EMAIL/PASSWORD
  // ===========================
  const login = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔐 fondamentale
        body: JSON.stringify({ email, password }),
      });

      const out = await res.json();

      if (!out.ok) {
        setErrorMsg("Email o password non validi");
      }
    } catch {
      setErrorMsg("Errore di rete, riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // REGISTRAZIONE
  // ===========================
  const register = async () => {
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
      }
    } catch {
      setErrorMsg("Errore di rete, riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // LOGIN GOOGLE
  // ===========================
  const googleLogin = () => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";

    const url = new URL(`${API_BASE}/api/user/google/auth`);
    url.searchParams.set("redirect", redirect);

    window.location.href = url.toString();
  };

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
