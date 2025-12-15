import { useEffect, useState } from "react";
import './admin.css';
import { API_BASE } from "../../../lib/config";


interface Order {
  id: string;
  userId: string | null;
  email: string;
  businessName?: string | null;
  piva?: string | null;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const token = sessionStorage.getItem("ADMIN_TOKEN");

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    fetch(`${API_BASE}/api/admin/orders/list`, {
      headers: {
        "x-admin-token": token
      }
    })
      .then((res) => res.json())
      .then((out) => {
        if (out.ok) setOrders(out.orders);
        if (!out.ok) window.location.href = "/admin/login";
      });
  }, [token]);

  // Applichiamo il filtro
  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  // KPI
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Amministratore WebOnDay</h1>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Ordini Totali</h3>
          <p>{orders.length}</p>
        </div>

        <div className="kpi-card">
          <h3>Revenue Totale</h3>
          <p>€ {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="kpi-card">
          <h3>In Attesa</h3>
          <p>{pending}</p>
        </div>

        <div className="kpi-card">
          <h3>Confermati</h3>
          <p>{confirmed}</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>Tutti</button>
        <button onClick={() => setFilter("pending")}>In attesa</button>
        <button onClick={() => setFilter("confirmed")}>Confermati</button>
        <button onClick={() => setFilter("cancelled")}>Cancellati</button>
      </div>

      {/* Tabella */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Totale</th>
            <th>Stato</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((ord) => (
            <tr key={ord.id}>
              <td>{ord.id}</td>
              <td>{ord.email}</td>
              <td>€ {ord.total.toFixed(2)}</td>
              <td>{ord.status}</td>
              <td>{new Date(ord.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => (window.location.href = `/admin/orders/${ord.id}`)}
                >
                  Dettagli
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
