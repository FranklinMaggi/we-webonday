/**
 * ============================================================
 * AdminOrderDetails
 * File: frontend/src/pages/admin/orders/[id].tsx
 *
 * RESPONSABILITÀ:
 * - Visualizzare il dettaglio di un ordine
 * - Consentire azioni ADMIN sullo stato
 *
 * POLISH UI:
 * - Disabilita bottoni durante azione
 * - Gestisce errore 409 (transizione non valida)
 * - Feedback visivo post-azione
 *
 * PRINCIPI:
 * - Backend = source of truth
 * - Nessuna logica di business nel FE
 * - Dopo successo → redirect (no state locale)
 * ============================================================
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getAdminOrder,
  transitionAdminOrder,
  deleteAdminOrder,
  cloneAdminOrder,
  ORDER_STATUS_LABEL,
  ORDER_CANCEL_REASON_LABEL,
} from "../../../lib/adminApi";

import type { AdminOrder } from "../../../lib/adminApi";

import "./admin.css";

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // UI-only state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getAdminOrder(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Caricamento…</p>;
  if (!order) return <p>Ordine non trovato</p>;

  /* =========================
     ACTION HANDLER GENERICO
  ========================= */

  async function runAction(
    action: () => Promise<unknown>,
    successMessage: string
  ) {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await action();
      setActionSuccess(successMessage);

      // piccolo delay UX prima redirect
      setTimeout(() => {
        navigate("/admin/orders", { replace: true });
      }, 800);

    } catch (err: any) {
      if (err?.status === 409) {
        setActionError("Transizione di stato non valida.");
      } else {
        setActionError("Errore durante l’operazione.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  /* =========================
     HANDLERS
  ========================= */

  function handleTransition(next: "processed" | "completed") {
    if (!id) return;
    runAction(
      () => transitionAdminOrder(id, next),
      `Ordine aggiornato: ${ORDER_STATUS_LABEL[next]}`
    );
  }

  function handleDelete() {
    if (!id) return;

    const ok = window.confirm(
      "Eliminare l’ordine?\nL’operazione è irreversibile."
    );
    if (!ok) return;

    runAction(
      () => deleteAdminOrder(id),
      "Ordine eliminato correttamente"
    );
  }

  function handleClone() {
    if (!id) return;

    runAction(
      () => cloneAdminOrder(id),
      "Ordine reintegrato (clone creato)"
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="admin-order-details">
      <h1>Ordine {order.id}</h1>

      {/* STATUS */}
      <div className="order-status">
        <span className={`status status-${order.status}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>

        {order.status === "deleted" && order.cancelReason && (
          <span className="cancel-reason">
            {ORDER_CANCEL_REASON_LABEL[order.cancelReason]}
          </span>
        )}
      </div>

      {/* FEEDBACK */}
      {actionError && (
        <div className="alert alert-error">{actionError}</div>
      )}

      {actionSuccess && (
        <div className="alert alert-success">{actionSuccess}</div>
      )}

      {/* AZIONI */}
      <div className="order-actions">
        <button
          disabled={actionLoading}
          onClick={() => handleTransition("processed")}
        >
          In lavorazione
        </button>

        <button
          disabled={actionLoading}
          onClick={() => handleTransition("completed")}
        >
          Completato
        </button>

        <button
          className="btn-cancel"
          disabled={actionLoading}
          onClick={handleDelete}
        >
          Elimina ordine
        </button>

        {order.status === "deleted" && (
          <button
            className="btn-clone"
            disabled={actionLoading}
            onClick={handleClone}
          >
            Reintegra (clone)
          </button>
        )}
      </div>

      {/* TOTAL */}
      <section className="order-total">
        <strong>Totale ordine:</strong> € {order.total.toFixed(2)}
      </section>

      <button
        disabled={actionLoading}
        onClick={() => navigate("/admin/orders")}
      >
        ← Torna alla lista
      </button>
    </div>
  );
}
