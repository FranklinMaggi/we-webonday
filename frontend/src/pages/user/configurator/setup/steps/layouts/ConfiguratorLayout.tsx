// ======================================================
// FE || components/layouts/ConfiguratorLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR LAYOUT (CANONICAL)
//
// RUOLO:
// - Layout condiviso per il configuratore
// - Guard auth HARD
// - NON crea configuration
// - NON decide flussi
//
// INVARIANTE CRITICA:
// - MAI perdere l'URL corrente (configurator/:id)
// - Il redirect al login DEVE preservare :id
//
// USATO DA:
// - /user/configurator
// - /user/configurator/:id
// ======================================================

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../../../lib/store/auth.store";

export default function ConfiguratorLayout() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const location = useLocation();

  /* ======================================================
     AUTH GUARD — HARD
     ❗ PRESERVA SEMPRE L’URL CORRENTE
  ====================================================== */
  useEffect(() => {
    if (ready && !user) {
      const redirect = encodeURIComponent(
        location.pathname + location.search
      );

      window.location.href =
        `/user/login?redirect=${redirect}`;
    }
  }, [ready, user, location]);

  /* ======================================================
     LOADING / BLOCK
  ====================================================== */
  if (!ready) {
    return <p>Caricamento…</p>;
  }

  if (!user) {
    // redirect già in corso
    return null;
  }

  /* ======================================================
     LAYOUT
  ====================================================== */
  return (
    <section className="configurator-page">
      <header className="configuration-header">
        <h1>Configura il tuo progetto</h1>
        <p style={{ opacity: 0.7 }}>
          Completa le informazioni per preparare la preview
          del tuo progetto WebOnDay.
        </p>
      </header>

      <div className="configuration-body">
        <Outlet />
      </div>
    </section>
  );
}
