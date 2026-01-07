/**
 * ======================================================
 * FE || src/lib/adminApi/admin.kpi.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Esporre KPI aggregati per la dashboard ADMIN
 *
 * RESPONSABILITÀ:
 * - Definire i DTO KPI allineati al backend
 * - Recuperare metriche aggregate (ordini, ricavi, utenti)
 * - Fornire un singolo punto di accesso FE ai dati KPI admin
 *
 * NON FA:
 * - NON calcola metriche
 * - NON normalizza dati
 * - NON formatta numeri o valute
 * - NON gestisce cache o refresh policy
 *
 * INVARIANTI:
 * - Il backend è source of truth per:
 *   • conteggi
 *   • aggregazioni
 *   • periodi temporali
 * - Tutte le chiamate passano da adminFetch
 * - Vietato usare fetch diretto
 *
 * RELAZIONE CON UI:
 * - La UI consuma KPI già aggregati
 * - Ogni logica di presentazione (grafici, label)
 *   è demandata ai componenti FE
 *
 * RELAZIONE CON BACKEND:
 * - Endpoint: GET /api/admin/kpi
 * - Il backend decide:
 *   • cosa è un “ordine valido”
 *   • cosa è “pagato”
 *   • cosa è “attivo”
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/adminApi/admin.kpi.api.ts (file già allineato)
 * - Evoluzione prevista:
 *   • supporto a KPI per periodo (query params)
 *   • eventuale estensione a KPI business / partner
 *
 * NOTE:
 * - File volutamente semplice
 * - Ogni aggiunta deve essere concordata col backend
 * ======================================================
 */

import { adminFetch } from "./client";

/* ============================================================
   ADMIN KPI — DTO (ALIGNED WITH BE)
============================================================ */

export interface AdminKPI {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processed: number;
    completed: number;
    deleted: number;
  };
  revenue: {
    paidOrders: number;
    totalAmount: number;
  };
  users: {
    total: number;
  };
}

export interface AdminKPIResponse {
  ok: boolean;
  kpi: AdminKPI;
}

export function getAdminKPI() {
  return adminFetch<AdminKPIResponse>("/api/admin/kpi");
}
