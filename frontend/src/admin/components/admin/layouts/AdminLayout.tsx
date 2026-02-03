import { Outlet, NavLink } from "react-router-dom";
import { adminLogout } from "@admin/adminApi";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">WebOnDay EP</h2>

        <nav className="admin-nav">
          {/* ================= OPERATIONS ================= */}
          <div className="nav-section">
            <span className="nav-title">Operations</span>

            <NavLink to="/admin/dashboard">
              Dashboard
            </NavLink>

            <NavLink to="/admin/orders">
              Ordini <span className="nav-badge">•</span>
            </NavLink>

            {/* ✅ CONFIGURATIONS */}
            <NavLink to="/admin/configurations">
              Configurazioni
            </NavLink>
          </div>

          {/* ================= MANAGEMENT ================= */}
          <div className="nav-section">
            <span className="nav-title">Management</span>

            <NavLink to="/admin/users">
              Utenti
            </NavLink>

            <NavLink to="/admin/products">
              Prodotti
            </NavLink>

            <NavLink to="/admin/solutions">
              Solutions
            </NavLink>
          </div>

          {/* ================= SYSTEM ================= */}
          <div className="nav-section">
            <span className="nav-title">System</span>

            <NavLink to="/admin/activity">
              Attività
            </NavLink>
          </div>
        </nav>

        <button className="logout-btn" onClick={adminLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
