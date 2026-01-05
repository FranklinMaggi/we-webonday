// ======================================================
// FE || main.tsx
// ======================================================
//
// AI-SUPERCOMMENT — APP BOOTSTRAP
//
// RUOLO:
// - Avvia l'app React
// - Inizializza lo stato auth FE
//
// INVARIANTE ASSOLUTO:
// - NON chiamare fetchUser()
// - L'utente è VISITOR finché non fa login volontario
//
// ======================================================

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./Style/css/index.css";
import { useAuthStore } from "./store/auth.store";

/**
 * Bootstrap FE
 * - segna solo lo stato come pronto
 * - nessuna lettura sessione
 */
function bootstrapAuth() {
  const store = useAuthStore.getState();
  store.clearUser(); // visitor iniziale
}

bootstrapAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
