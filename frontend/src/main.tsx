import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./Style/css/index.css";

import { useAuthStore } from "./store/auth.store";

/**
 * Bootstrap auth
 * - legge la sessione dal cookie HttpOnly
 * - inizializza lo store PRIMA del render
 * - evita redirect prematuri
 */
async function bootstrapAuth() {
  const store = useAuthStore.getState();

  try {
    await store.fetchUser();
  } finally {
    store.setReady(true);
  }
}

// ⛔️ NON renderizzare l’app prima del bootstrap
bootstrapAuth().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
