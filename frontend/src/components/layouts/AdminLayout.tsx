import { Outlet } from "react-router-dom";
import "./adminLayout.css";
import { requireAdminToken } from "../../utils/admin";

export default function AdminLayout() {
  // protezione globale layout
  requireAdminToken();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">WebOnDay EP</h2>

        <nav>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/orders">Ordini</a>
          <a href="/admin/activity">Attività</a>
          <a href="/admin/users">Utenti</a>
          <a href="/admin/products">Prodotti</a>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.removeItem("ADMIN_TOKEN");
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
