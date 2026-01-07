// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER CONFIGURATOR ENTRY
//
// RUOLO:
// - Entry point configuratore progetto
// - Usato quando NON esiste ancora una configuration
//
// RESPONSABILITÀ:
// - Guard auth
// - Monta wizard di configurazione (FE-only)
//
// NON FA:
// - NON crea configuration lato backend
// - NON crea ordini
// - NON usa carrello
//
// NOTE ARCHITETTURALI:
// - Questo file esiste SOLO per la route:
//   /user/configurator
// - La versione con ID è gestita da:
//   /user/configurator/[id]
//
// ======================================================

import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth.store";
import ConfigurationSetupPage from "./setup/ConfigurationSetupPage";

export default function UserConfiguratorIndex() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  /* ======================================================
     AUTH GUARD
     PERCHE:
     - Il configuratore è solo per utenti loggati
  ====================================================== */
  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/configurator";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;

  /* ======================================================
     RENDER
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
        <ConfigurationSetupPage />
      </div>
    </section>
  );
}
