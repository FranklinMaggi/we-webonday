// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Entry point CONFIGURATORE PROGETTO (DRAFT)
// - Sostituisce il vecchio flusso checkout diretto
//
// RESPONSABILITÀ:
// - Guard auth
// - Monta wizard configurazione
//
// NON FA:
// - NON crea ordini
// - NON avvia checkout
// - NON richiede policy
//
// NOTE:
// - Draft FE only
// - Persistenza futura lato BE
// ======================================================

import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth.store";
import ConfigurationSetupPage from "./setup/ConfigurationSetupPage";

export default function UserConfiguratorPage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  // 🔐 Auth guard
  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/configurator";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;

  return (
    <section className="user-configurator">
      <h1>Configura il tuo progetto</h1>

      <p style={{ opacity: 0.7 }}>
        Completa le informazioni per preparare la preview del tuo
        progetto WebOnDay.
      </p>

      {/* Wizard esistente */}
      <ConfigurationSetupPage />
    </section>
  );
}
