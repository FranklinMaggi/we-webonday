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

import { API_BASE } from "../../config";
import {type  PublicSolutionDTO } from "../../dto/solution.public.dto";
/* ======================================================
   DTO — SOLUTION (LIST)
   → usato per catalogo / cards
====================================================== */

/* ======================================================
   DTO — SOLUTION (DETAIL)
   → usato da configuratore / pagina solution
====================================================== */
export type PublicSolutionDetailDTO = {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;

  icon?: string;

  image?: {
    hero: string;
    card: string;
    fallback?: string;
  };

  industries?: string[];

  descriptionTags: string[];
  serviceTags: string[];

  openingHoursDefault?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
};

/* ======================================================
   RESPONSE TYPES
====================================================== */
type PublicSolutionsResponse = {
  ok: true;
  solutions: PublicSolutionDTO[];
};

type PublicSolutionDetailResponse = {
  ok: true;
  solution: PublicSolutionDetailDTO;
  products: unknown[];
};

/* ======================================================
   FETCH — SOLUTIONS LIST
====================================================== */
export async function fetchPublicSolutions(): Promise<
  PublicSolutionDTO[]
> {
  const res = await fetch(`${API_BASE}/api/solution/list`);
  if (!res.ok) throw new Error("FAILED_TO_FETCH_SOLUTIONS");

  const data: PublicSolutionsResponse = await res.json();
  return data.solutions ?? [];
}

/* ======================================================
   FETCH — SOLUTION DETAIL
====================================================== */
export async function fetchPublicSolutionById(
  id: string
): Promise<PublicSolutionDetailDTO> {
  const res = await fetch(
    `${API_BASE}/api/solution?id=${encodeURIComponent(id)}`
  );
  if (!res.ok) throw new Error("FAILED_TO_FETCH_SOLUTION");

  const data: PublicSolutionDetailResponse = await res.json();
  if (!data?.ok || !data.solution) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return data.solution;
}
