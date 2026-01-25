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
import router from "./app/router/router";
import { useAuthStore } from "./shared/lib/store/auth.store";
import "@shared/Style/css/index.css";

function Bootstrap() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser(); // 🔑 carica sessione utente (cookie-based)
  }, [fetchUser]);

  return <RouterProvider router={router} />;
}


console.log("[BOOT] API_BASE =", import.meta.env.VITE_API_BASE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);
