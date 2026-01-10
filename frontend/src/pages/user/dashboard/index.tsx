// ======================================================
// FE || pages/user/dashboard/index.tsx
// ======================================================
//
// USER DASHBOARD — HOME
//
// RUOLO:
// - Home area cliente post-login
// - Console personale dell’utente
//
// NON È:
// - una landing marketing
// - un wizard
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
