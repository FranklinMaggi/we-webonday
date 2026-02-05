// ======================================================
// FE || USER DASHBOARD || SHELL
// ======================================================
//
// COSA FA:
// - mantiene sidebar a sinistra
// - cambia solo il contenuto a destra
//
// PERCHÉ ESISTE:
// - la sidebar non deve mai sparire
//
// COSA NON FA:
// - non carica dati
// ======================================================
import { Outlet } from "react-router-dom";
import SidebarContainer from "./sidebar/components/Sidebar.container";

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
