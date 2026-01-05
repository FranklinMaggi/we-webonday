// ======================================================
// FE || main.tsx
// ======================================================
//
// AI-SUPERCOMMENT — APP BOOTSTRAP
//
// RUOLO:
// - Avvia l'app
// - NON forza login
// - NON presume sessione valida
//
// PRINCIPIO:
// - fetchUser decide se esiste una sessione
// ======================================================

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./Style/css/index.css";
import { useAuthStore } from "./store/auth.store";

async function bootstrapAuth() {
  const store = useAuthStore.getState();
  await store.fetchUser(); // ✅ setta user + ready
}

bootstrapAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
