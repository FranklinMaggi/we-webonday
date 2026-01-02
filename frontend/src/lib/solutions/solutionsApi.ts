// ============================================================
// FE || lib/solutions/solutionsApi.ts
// ============================================================
//
// RUOLO:
// - Fetch pubblico delle Solutions
//
// ENDPOINT:
// - GET /api/solutions
//
// NOTE:
// - Nessun token
// - Solo solutions ACTIVE
// ============================================================

import { API_BASE } from "../config";
import type { AdminSolution } from "../../dto/solution";

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
