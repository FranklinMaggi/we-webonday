// ======================================================
// FE || main.tsx
// ======================================================
//
// AI-SUPERCOMMENT — APP BOOTSTRAP
//
// PRINCIPIO FONDAMENTALE:
// - L’app NON deve determinare lo stato auth
// - Nessuna chiamata a /api/user/me al bootstrap
// - L’utente resta VISITOR finché non fa login
//
// Il login è gestito SOLO dalla pagina /login
//
// ======================================================

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./Style/css/index.css";

import { useAuthStore } from "./store/auth.store";

// ===========================
// BOOTSTRAP FE PURO
// ===========================
function bootstrapApp() {
  const store = useAuthStore.getState();

  // ⚠️ NON fetchiamo l’utente qui
  // L’app parte SEMPRE come visitor
  store.setReady(true);
}

bootstrapApp();

// ===========================
// RENDER
// ===========================
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
