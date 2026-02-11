/**
 * ======================================================
 * FE || PUBLIC API — SOLUTIONS
 * File: src/lib/publicApi/solutions/solutions.public.api.ts
 * ======================================================
 *
 * RUOLO:
 * - Accesso pubblico alle Solutions
 *
 * USATO DA:
 * - Landing
 * - Catalogo
 * - Configuratore
 *
 * INVARIANTI:
 * - READ ONLY
 * - Nessuna auth
 * - Backend = source of truth
 *
 * NOTA:
 * - NON usare per admin
 * ======================================================
 */

import { API_BASE } from "../../../../../shared/lib/config";
import { type PublicSolutionDTO } from "../DataTransferObject/types/types.dto";
import type { PublicSolutionsResponse } from "../DataTransferObject/types/types.dto";


/* ======================================================
   FETCH — SOLUTIONS LIST
====================================================== */
export async function listPublicSolutions(): Promise<
  PublicSolutionDTO[]
> {
  const res = await fetch(`${API_BASE}/api/solution/list`);
  if (!res.ok) throw new Error("FAILED_TO_FETCH_SOLUTIONS");

  const data: PublicSolutionsResponse = await res.json();
  return data.solutions ?? [];
}

