// ======================================================
// FE || pages/user/dashboard/workspace/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WORKSPACE
//
// RUOLO:
// - Editor persistente di una Configuration
// - Modifica continua post-wizard
//
// SOURCE OF TRUTH:
// - Backend (ConfigurationDTO)
//
// COSA FA:
// - Load configurazione
// - Monta ConfigurationLayout
//
// COSA NON FA:
// - NON è un wizard
// - NON usa Zustand
// - NON crea Business
//
// INVARIANTI:
// - Ogni modifica → persistita backend
//
// ======================================================

import { useParams } from "react-router-dom";

export default function UserDashboardDetail() {
  const { id } = useParams();

  return (
    <>
      <h1>Dettaglio</h1>
      <p>ID: {id}</p>

      {/* qui decidi cosa caricare */}
    </>
  );
}
