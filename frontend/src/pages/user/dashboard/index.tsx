// ======================================================
// FE || pages/user/dashboard/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD (HOME)
//
// RUOLO:
// - Landing page post-login per l’utente (buyer)
//
// OBIETTIVO:
// - Far percepire il cambio di stato (visitor → user)
// - Offrire continuità con ordini e progetti
//
// INVARIANTI:
// - Nessun redirect automatico
// - Nessuna logica business
// - Solo composizione di sezioni
//
// ======================================================

import UserOrders from "./sections/UserOrders";
import UserProjects from "./sections/UserProjects";
import ExploreSolutionsCTA from "./sections/ExploreSolutionsCTA";

export default function UserDashboardHome() {
  return (
    <section className="user-dashboard-home">
      <h1>La tua area cliente</h1>

      {/* ===========================
         ORDINI
      =========================== */}
      <UserOrders />

      {/* ===========================
         PROGETTI
      =========================== */}
      <UserProjects />

      {/* ===========================
         CTA CONTINUITÀ ACQUISTO
      =========================== */}
      <ExploreSolutionsCTA />
    </section>
  );
}
