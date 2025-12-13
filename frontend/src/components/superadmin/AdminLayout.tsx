import { Outlet, Link } from "react-router-dom";

export default function SuperAdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          padding: 16,
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>SuperAdmin</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/superadmin/dashboard">Dashboard</Link>
          <Link to="/superadmin/users">Users</Link>
          <Link to="/superadmin/orders">Orders</Link>
          <Link to="/superadmin/logs">Logs</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
