// ======================================================
// FE || pages/user/dashboard/DashboardLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD LAYOUT
//
// RUOLO:
// - Layout persistente area utente
// - Sidebar sempre visibile
//
// INVARIANTI:
// - Nessuna logica business
// - Nessun fetch
//
// ======================================================
// FE || pages/user/dashboard/layout/DashboardLayout.tsx

import { Outlet } from "react-router-dom";
import SidebarContainer from "./layout/Sidebar.container";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <SidebarContainer />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
