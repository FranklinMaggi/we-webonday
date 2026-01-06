// ======================================================
// FE || pages/admin/orders/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — ADMIN ORDERS LIST
//
// SCOPO PRIMARIO:
// - Fornire al SuperAdmin una vista rapida e affidabile
//   degli ordini reali effettuati dai clienti.
//
// MODELLO MENTALE:
// - Ogni riga = evento economico reale
// - Nessuna azione distruttiva avviene qui
//
// RESPONSABILITÀ:
// - Fetch lista ordini (read-only)
// - Visualizzare email, totale, stato
// - Navigazione verso dettaglio ordine
//
// INVARIANTI:
// - Nessuna mutazione di stato
// - Nessuna business logic
// - Stato ordine = read-only snapshot
//
// DELEGA:
// - Qualsiasi azione → pagina dettaglio
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============================
   ADMIN API (SOURCE OF TRUTH)
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
  /* =========================
     STATE
  ========================= */
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     EFFECT — FETCH ORDERS
     (one-shot, on mount)
  ========================= */
  useEffect(() => {
    let alive = true;

    getAdminOrders()
      .then((data) => {
        if (alive) setOrders(data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  /* =========================
     EARLY RETURNS
  ========================= */
  if (loading) {
    return <p>Caricamento ordini…</p>;
  }

  if (!orders.length) {
    return <p>Nessun ordine presente.</p>;
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Email cliente</th>
          <th>Totale</th>
          <th>Stato</th>
          <th>Azioni</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            {/* =====================
               EMAIL CLIENTE
            ====================== */}
            <td>{o.email}</td>

            {/* =====================
               TOTALE ORDINE
            ====================== */}
            <td>€ {o.total.toFixed(2)}</td>

            {/* =====================
               STATO ORDINE
            ====================== */}
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

            {/* =====================
               NAVIGAZIONE
            ====================== */}
            <td>
              <button
                className="wd-btn wd-btn--ghost"
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
