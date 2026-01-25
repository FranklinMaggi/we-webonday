// ======================================================
// FE || src/lib/userApi/layout.user.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — USER LAYOUT API
//
// RUOLO:
// - Recuperare dal backend i layout disponibili (KV)
// - Usato da StepReview per mostrare preview e selezione
//
// INVARIANTI:
// - Backend = source of truth
// - NO logica layout qui (solo fetch + typing)
// - Usa apiFetch come unico client HTTP
//
// ENDPOINT ATTESO (BE):
// - GET /api/layouts/available?solutionId=...&productId=...
//   (se il tuo BE usa un path diverso, cambiamo SOLO la stringa qui)
// ======================================================

import { apiFetch } from "../api/client";
import type { LayoutKVDTO } from "../../../app/webyDevEngine/configurationLayout/layout.dto";

export type FetchAvailableLayoutsParams = {
  solutionId: string;
  productId: string;
};

export type FetchAvailableLayoutsResponse = {
  ok: true;
  layouts: LayoutKVDTO[];
};

export async function fetchAvailableLayouts(
  params: FetchAvailableLayoutsParams
): Promise<FetchAvailableLayoutsResponse> {
  const { solutionId, productId } = params;

  const qs = new URLSearchParams({
    solutionId,
    productId,
  });

  const res = await apiFetch<FetchAvailableLayoutsResponse>(
    `/api/layouts/available?${qs.toString()}`
  );

  if (!res || !res.ok || !Array.isArray(res.layouts)) {
    throw new Error("Invalid layouts response");
  }

  return res;
}
