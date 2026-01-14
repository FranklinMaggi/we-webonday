// ======================================================
// FE || pages/user/dashboard/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — LEGACY CATCH-ALL (ISOLATED)
//
// ⚠️ ATTENZIONE — FILE NON CANONICO ⚠️
//
// QUESTO FILE:
// - ❌ NON è il configurator canonico
// - ❌ NON è il workspace canonico post-wizard
// - ❌ NON rappresenta un dominio funzionale chiaro
////Il configurator è l’unica interfaccia
//che modifica una Configuration.

//La modalità (wizard / workspace)
//dipende esclusivamente dallo status backend.
// RUOLO ATTUALE:
// - Catch-all legacy per route ambigue di dashboard
// - Placeholder storico NON più in uso attivo
//
// PROBLEMA STRUTTURALE:
// - Path dinamico generico ":id"
// - Può intercettare route future per errore
// - Crea collisioni semantiche con:
//   • /user/dashboard/configuration/:id
//   • /user/dashboard/business/:id
//
// SOURCE OF TRUTH:
// - ❌ Nessuna (NON definita)
// - NON allineato a BE
//
// INVARIANTI BLOCCANTI (NON NEGOZIABILI):
// 1. ❌ NON estendere questo file
// 2. ❌ NON aggiungere logica
// 3. ❌ NON aggiungere fetch
// 4. ❌ NON usarlo come entry point
// 5. ❌ NON referenziarlo da nuovi flussi
//
// STATO:
// - ISOLATO
// - CONGELATO
// - CANDIDATO A DEPRECATION FUTURA
//
// NOTE PER REFACOTR FUTURO:
// - Da rimuovere SOLO dopo:
//   ✔️ audit routing completo
//   ✔️ rimozione definitiva delle collisioni path
//
// ======================================================

import UserOrders from "./sections/UserOrders";
import UserProjects from "./sections/UserProjects";
import ExploreSolutionsCTA from "./sections/ExploreSolutionsCTA";

export default function UserDashboardHome() {


  return (
    <section className="user-dashboard-home">
        
      {/* ===========================
         HEADER CONTESTUALE
      =========================== */}
      <header className="dashboard-header">
        <h1>Area Cliente</h1>
        <p className="dashboard-subtitle">
          Gestisci le tue attività, i progetti e gli ordini
        </p>
      </header>

      {/* ===========================
         AZIONE PRINCIPALE
         (in futuro: “Riprendi configurazione”)
      =========================== */}
      <section className="dashboard-primary-action">
        <ExploreSolutionsCTA />
      </section>

      {/* ===========================
         PROGETTI / ATTIVITÀ
      =========================== */}
      <section className="dashboard-section">
        <UserProjects />
      </section>

      {/* ===========================
         ORDINI
      =========================== */}
      <section className="dashboard-section">
        <UserOrders />
      </section>


    </section>
  );
}
