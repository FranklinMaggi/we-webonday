// ============================================================
// FE || ADMIN API — SOLUTIONS (LIST)
// File: frontend/src/lib/adminApi/admin.solutions.api.ts
// ============================================================
//
// RUOLO:
// - Espone le API ADMIN per la lista delle Solutions
//
// RESPONSABILITÀ:
// - Recupero lista completa (DRAFT / ACTIVE / ARCHIVED)
// - Nessuna logica di business
// - Nessuna gestione auth manuale
//
// NOTE ARCHITETTURALI:
// - Usa adminFetch (SINGLE SOURCE OF TRUTH)
// - Il token admin è letto da sessionStorage
// - In caso di 401 → redirect automatico a /admin/login
//
// ENDPOINT:
// - GET /api/admin/solutions/list
// ============================================================

import { adminFetch } from "./client";
import type { AdminSolutionsResponse } from "../apiModels/admin/Solution.api-model";
/* =========================
   LIST SOLUTIONS (ADMIN)
========================= */
export function fetchAdminSolutions(): Promise<AdminSolutionsResponse> {
  return adminFetch<AdminSolutionsResponse>(
    "/api/admin/solutions/list"
  );
}
