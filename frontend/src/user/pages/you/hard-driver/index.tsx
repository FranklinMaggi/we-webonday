// ======================================================
// AI-SUPERCOMMENT — YOU PAGE INDEX
// ======================================================
//
// RUOLO:
// - Entry point della route /user/dashboard/you
// - Collega Container → View
//
// RESPONSABILITÀ:
// - Nessuna logica
// - Nessuna trasformazione dati
//
// INVARIANTI:
// - Deve rimanere un file “thin”
// - Serve solo a mantenere separazione
//   tra routing e dominio
//
// ⚠️ NON:
// - aggiungere hook
// - aggiungere logica
// - aggiungere condizioni
// ==========================================================================================================

import { useYouDashboardContainer } from "./You.container";
import { YouDashboardView } from "./You.view";

export default function YouDashboardPage() {
  const vm = useYouDashboardContainer();
  return <YouDashboardView {...vm} />;
}
