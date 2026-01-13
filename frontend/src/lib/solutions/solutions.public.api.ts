/**
 * ======================================================
 * FE || src/lib/solutions/solutionsApi.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PUBLIC)
 *
 * RUOLO:
 * - API FE per il fetch pubblico delle Solutions
 *
 * CONTESTO:
 * - Landing page
 * - Catalogo soluzioni
 *
 * RESPONSABILITÀ:
 * - Recuperare solo Solutions ACTIVE
 *
 * NON FA:
 * - NON gestisce auth
 * - NON espone soluzioni DRAFT / ARCHIVED
 * - NON normalizza dati
 *
 * INVARIANTI:
 * - Nessun token
 * - Backend filtra le soluzioni
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/publicApi/solutions.public.api.ts
 * - Refactor:
 *   • uso apiFetch
 *
 * NOTE:
 * - File volutamente minimale
 * - Backend = source of truth
 * ======================================================
 */

import { API_BASE } from "../config";
import type { AdminSolution } from "../apiModels/admin/Solution.api-model";
export type PublicSolutionsResponse = {
  ok: true;
  solutions: AdminSolution[];
};

export async function fetchPublicSolutions(): Promise<AdminSolution[]> {
  const res = await fetch(`${API_BASE}/api/solutions`);

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_SOLUTIONS");
  }

  const data: PublicSolutionsResponse = await res.json();
  return data.solutions;
}
export async function fetchPublicSolutionById(id: string) {
  const res = await fetch(
    `${API_BASE}/api/solution?id=${encodeURIComponent(id)}`
  );

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_SOLUTION");
  }

  const data = await res.json();

  if (!data?.ok || !data.solution) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return data.solution;
}
