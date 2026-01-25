// ======================================================
// FE || USER DASHBOARD || SHELL
// ======================================================
//
// RUOLO:
// - Layout strutturale dashboard
// - Sidebar a sinistra
// - Contenuto a destra
//
// INVARIANTE:
// - Layout orizzontale (flex)
// ======================================================

import { Outlet } from "react-router-dom";
import SidebarContainer from "../../sidebar/Sidebar.container";

export default function UserDashboardShell() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar-wrap">
        <SidebarContainer />
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
