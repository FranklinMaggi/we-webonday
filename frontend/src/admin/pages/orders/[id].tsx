// ======================================================
// FE || pages/admin/orders/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — ADMIN ORDER DETAILS
//
// SCOPO PRIMARIO:
// - Gestire un singolo ordine come entità centrale
// - Consentire al SuperAdmin di eseguire azioni valide
//
// MODELLO MENTALE:
// - L’ordine è un evento economico
// - Il backend è l’unica autorità sulle transizioni
//
// RESPONSABILITÀ:
// - Fetch ordine
// - Mostrare stato, totale, motivazioni
// - Inviare comandi amministrativi
// - Fornire feedback UX chiaro
//
// INVARIANTI:
// - FE NON calcola totali
// - FE NON valida regole business
// - Ogni errore di stato è gestito come feedback
// ======================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWdStatusClass } from "@shared/utils/statusUi";
/* ============================
   ADMIN API
============================ */
import {
  getAdminOrder,
  transitionAdminOrder,
  deleteAdminOrder,
  cloneAdminOrder,
  ORDER_STATUS_LABEL,
  ORDER_CANCEL_REASON_LABEL,
} from "@src/admin/adminApi";

/* ============================
   TYPES
============================ */
import type { AdminOrder } from "@src/admin/adminApi";

export default function AdminOrderDetails() {
  /* =========================
     ROUTING
  ========================= */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // UI-only feedback state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  /* =========================
     EFFECT — FETCH ORDER
  ========================= */
  useEffect(() => {
    if (!id) return;

    let alive = true;

    getAdminOrder(id)
      .then((data) => {
        if (alive) setOrder(data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  /* =========================
     EARLY RETURNS
  ========================= */
  if (loading) {
    return <p>Caricamento ordine…</p>;
  }

  if (!order) {
    return <p>Ordine non trovato.</p>;
  }

  /* =========================
     ACTION RUNNER (GENERIC)
     - Centralizza loading / error / success
     - Garantisce UX consistente
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

      // Delay UX per lettura feedback
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
     HANDLERS (INTENT-DRIVEN)
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
      <h1>Ordine #{order.id}</h1>

      {/* =====================
         STATUS
      ====================== */}
      <div className="order-status">
      <span className={getWdStatusClass(order.status)}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>

        {order.status === "deleted" && order.cancelReason && (
          <span className="cancel-reason">
            {ORDER_CANCEL_REASON_LABEL[order.cancelReason]}
          </span>
        )}
      </div>

      {/* =====================
         FEEDBACK
      ====================== */}
      {actionError && (
        <div className="alert alert-error">{actionError}</div>
      )}

      {actionSuccess && (
        <div className="alert alert-success">{actionSuccess}</div>
      )}

      {/* =====================
         AZIONI ADMIN
      ====================== */}
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

      {/* =====================
         TOTAL
      ====================== */}
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
