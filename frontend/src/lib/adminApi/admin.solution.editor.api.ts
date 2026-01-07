// ============================================================
// FE || ADMIN API — SOLUTION DETAIL / EDITOR
// File: frontend/src/lib/adminApi/admin.solution.editor.api.ts
// ============================================================
//
// RUOLO:
// - API ADMIN per il dettaglio e salvataggio Solution
//
// RESPONSABILITÀ:
// - GET: caricare una Solution completa per editor
// - PUT: salvare modifiche (UPSERT)
//
// NON FA:
// - NON gestisce token manualmente
// - NON usa env
// - NON usa fetch diretto
//
// ENDPOINT:
// - GET /api/admin/solution?id=XXX
// - PUT /api/admin/solutions/register
//
// NOTE:
// - adminFetch gestisce:
//   • x-admin-token
//   • errori
//   • redirect login
// ============================================================

import { adminFetch } from "./client";
import type {
  AdminSolutionDetailResponse,
  SolutionEditorDTO,
} from "../../dto/solution";

/* =========================
   GET SOLUTION DETAIL
========================= */
export function fetchAdminSolution(
  id: string
): Promise<AdminSolutionDetailResponse> {
  return adminFetch<AdminSolutionDetailResponse>(
    `/api/admin/solution?id=${id}`
  );
}

/* =========================
   UPSERT SOLUTION
========================= */
export function saveAdminSolution(
  solution: SolutionEditorDTO
): Promise<{ ok: boolean }> {
  return adminFetch<{ ok: boolean }>(
    "/api/admin/solutions/register",
    {
      method: "PUT",
      body: JSON.stringify(solution),
    }
  );
}
