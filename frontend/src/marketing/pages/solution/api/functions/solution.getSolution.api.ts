/**
 * ======================================================
 * FE || PUBLIC API — SOLUTIONS
 * ======================================================
 *
 * RUOLO:
 * - Accesso pubblico READ-ONLY alle Solutions
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
 * ======================================================
 */

import { apiFetch } from "../../../../../shared/lib/api";
import { type PublicSolutionDetailDTO } from "../DataTransferObject/types/types.dto";
import { type PublicSolutionDetailResponse} from "../DataTransferObject/types/types.dto";
/* ======================================================
   FETCH — SOLUTION DETAIL (CANONICAL)
====================================================== */

/**
 * 🔒 CANONICAL PUBLIC READER
 * - Usato dal Configurator (StepBusinessInfo)
 * - Usato da pagine Solution
 */
export async function getSolutionById(
  solutionId: string
): Promise<PublicSolutionDetailDTO> {
  const res = await apiFetch<PublicSolutionDetailResponse>(
    `/api/solution?id=${encodeURIComponent(solutionId)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res || !res.ok || !res.solution) {
    throw new Error("INVALID_PUBLIC_SOLUTION_RESPONSE");
  }

  return res.solution;
}
