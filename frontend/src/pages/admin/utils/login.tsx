import { useState } from "react";

export default function AdminLogin() {
  const [token, setToken] = useState("");

  const login = () => {
    // salva solo in memory/sessionStorage
    sessionStorage.setItem("ADMIN_TOKEN", token);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="password"
        placeholder="Admin token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={login}>Entra</button>
    </div>
  );
}
