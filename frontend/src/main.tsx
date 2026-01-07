// ======================================================
// FE || main.tsx
// ======================================================
//
// APP BOOTSTRAP
//
// RESPONSABILITÀ:
// - Avviare l’app
// - Inizializzare auth (session cookie)
// - Montare RouterProvider
// ======================================================

import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { useAuthStore } from "./store/auth.store";
import "./Style/css/index.css";

function Bootstrap() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser(); // 🔑 carica sessione utente (cookie-based)
  }, [fetchUser]);

  return <RouterProvider router={router} />;
}

// DEBUG ENV — CORRETTO
console.log("API_BASE (URL) =", import.meta.env.VITE_API_URL);

// DEBUG ENV — QUESTO È QUELLO USATO DAL CODICE
console.log("API_BASE (BASE) =", import.meta.env.VITE_API_BASE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);
