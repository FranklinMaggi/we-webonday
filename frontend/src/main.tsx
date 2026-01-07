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


console.log("[BOOT] API_BASE =", import.meta.env.API_BASE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);
