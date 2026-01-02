// ======================================================
// FE || pages/admin/orders/index.tsx
// ======================================================
// ADMIN — ORDERS LIST
//
// RUOLO:
// - Visualizzare elenco ordini
//
// RESPONSABILITÀ:
// - Fetch lista ordini
// - Mostrare stato, totale, email
// - Navigazione verso dettaglio ordine
//
// NON FA:
// - NON modifica ordini
// - NON applica transizioni di stato
//
// NOTE:
// - Ogni azione è delegata alla pagina dettaglio
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============================
   ADMIN API
============================ */
import {
  getAdminOrders,
  ORDER_STATUS_LABEL,
  ORDER_CANCEL_REASON_LABEL,
} from "../../../lib/adminApi";

/* ============================
   TYPES
============================ */
import type { AdminOrder } from "../../../lib/adminApi";



export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Totale</th>
          <th>Stato</th>
          <th>Azioni</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            {/* EMAIL */}
            <td>{o.email}</td>

            {/* TOTALE */}
            <td>€ {o.total.toFixed(2)}</td>

            {/* STATO */}
            <td>
              <span className={`status status-${o.status}`}>
                {ORDER_STATUS_LABEL[o.status]}
              </span>

              {o.status === "deleted" && o.cancelReason && (
                <div className="cancel-reason">
                  {ORDER_CANCEL_REASON_LABEL[o.cancelReason]}
                </div>
              )}
            </td>

            {/* AZIONI */}
            <td>
              <button
                onClick={() => navigate(`/admin/orders/${o.id}`)}
              >
                Dettagli
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
