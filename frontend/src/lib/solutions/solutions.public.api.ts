/**
 * ======================================================
 * FE || src/lib/solutions/solutionsApi.ts
 * ======================================================
 *
 * VERSIONE:
 * - v1.1 (2026-01)
 *
 * RUOLO:
 * - API FE per il fetch PUBBLICO delle Solutions
 *
 * USATA DA:
 * - Landing page
 * - Catalogo soluzioni
 * - Configuratore (step iniziale)
 *
 * INVARIANTI:
 * - Backend = source of truth
 * - Nessuna auth
 * - Nessuna normalizzazione
 *
 * ======================================================
 */

import { API_BASE } from "../config";

/* ======================================================
   DTO — PUBLIC SOLUTION (LIST)
====================================================== */
export type PublicSolutionDTO = {
  id: string;
  name: string;
  description?: string;

  icon?: string;

  image?: string; // card / fallback

  descriptionTags: string[];
  serviceTags: string[];
};

/* ======================================================
   DTO — PUBLIC SOLUTION (DETAIL)
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
  const res = await fetch(`${API_BASE}/api/solutions`);

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_SOLUTIONS");
  }

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

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_SOLUTION");
  }

  const data: PublicSolutionDetailResponse = await res.json();

  if (!data?.ok || !data.solution) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return data.solution;
}
