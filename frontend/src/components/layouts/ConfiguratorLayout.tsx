// ======================================================
// FE || components/layouts/ConfiguratorLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR LAYOUT
//
// RUOLO:
// - Layout condiviso per il configuratore
// - Guard auth
// - Header e struttura comune
//
// USATO DA:
// - /user/configurator
// - /user/configurator/:id
//
// ======================================================

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../lib/store/auth.store";

export default function ConfiguratorLayout() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/configurator";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;

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
