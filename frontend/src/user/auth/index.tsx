// ======================================================
// FE || pages/user/auth/index.tsx
// ======================================================

import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../shared/lib/store/auth.store";
import { apiFetch } from "../../shared/lib/api";
import { userAuthClasses as cls } from "./auth.classes";

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
      await apiFetch("/api/user/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      await fetchUser();
      navigate(redirect, { replace: true });
    } catch {
      setErrorMsg("Email o password non validi");
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await apiFetch("/api/user/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      await fetchUser();
      navigate(redirect, { replace: true });
    } catch {
      setErrorMsg("Registrazione fallita. Email già in uso?");
    } finally {
      setLoading(false);
    }
  }

  function googleLogin() {
    const url = new URL("/api/user/google/auth", window.location.origin);
    url.searchParams.set("redirect", redirect);
    window.location.href = url.toString();
  }

  return (
    <main className={cls.page}>
      <div className={cls.card}>
        <h1 className={cls.title}>Area Cliente</h1>
        <p className={cls.subtitle}>
          Accedi o crea il tuo account WebOnDay
        </p>

        <button
          className={cls.googleBtn}
          onClick={googleLogin}
          disabled={loading}
        >
          Accedi con Google
        </button>

        <div className={cls.divider}>oppure</div>

        <div className={cls.form}>
          <input
            className={cls.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={cls.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className={cls.error}>{errorMsg}</p>
          )}

          <button
            className={cls.primaryBtn}
            onClick={login}
            disabled={loading}
          >
            Accedi
          </button>

          <button
            className={cls.secondaryBtn}
            onClick={register}
            disabled={loading}
          >
            Registrati
          </button>
        </div>

        <p className={cls.hint}>
          L’accesso crea automaticamente una sessione sicura
        </p>
      </div>
    </main>
  );
}
