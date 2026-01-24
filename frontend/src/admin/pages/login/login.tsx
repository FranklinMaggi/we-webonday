// ======================================================
// FE || pages/admin/login/login.tsx
// ======================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "@src/admin/adminApi";
import { adminLoginClasses as cls } from "./login.classes";

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
    <main className={cls.page}>
      <form onSubmit={onSubmit} className={cls.card}>
        <h1 className={cls.title}>Admin Login</h1>

        <label className={cls.field}>
          <span className={cls.label}>Admin token</span>

          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Inserisci token"
            className={cls.input}
          />
        </label>

        {error && <p className={cls.error}>{error}</p>}

        <button type="submit" className={cls.submit}>
          Entra
        </button>
      </form>
    </main>
  );
}
