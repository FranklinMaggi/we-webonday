import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./Style/css/index.css";

import { useAuthStore } from "./store/auth.store";

/**
 * Bootstrap auth
 * - legge la sessione dal cookie HttpOnly
 * - inizializza lo store
 */
async function bootstrapAuth() {
  const store = useAuthStore.getState();

  try {
    await store.fetchUser();
  } finally {
    store.setReady(true);
  }
}

// ⚠️ React 19: render immediato, auth async
bootstrapAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
