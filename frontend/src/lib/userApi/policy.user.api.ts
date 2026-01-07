/**
 * ======================================================
 * FE || src/lib/policy/policyApi.ts-> /lib/userApi/policy.user.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - API FE per il dominio POLICY
 *
 * RESPONSABILITÀ:
 * - Recuperare l’ultima versione della policy
 * - Distinguere scope (general / checkout)
 *
 * NON FA:
 * - NON accetta policy
 * - NON persiste consenso
 * - NON interpreta il contenuto legale
 *
 * INVARIANTI:
 * - Il backend decide:
 *   • versione valida
 *   • contenuto
 *   • scope
 * - credentials: include
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/policy.user.api.ts
 * - Refactor:
 *   • uso apiFetch
 *   • allineamento error handling
 *
 * NOTE:
 * - File read-only per design
 * - Backend = source of truth legale
 * ======================================================
 */
// ======================================================
// FE || lib/policy/policyApi.ts
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - API FE per dominio Policy
//
// INVARIANTI:
// - Fetch solo per scope
// - NO accettazione
//
// ======================================================

import { apiFetch } from "../api";
export type PolicyScope = "general" | "checkout";

export type PolicyDTO = {
  scope: PolicyScope;
  version: string;
  content: {
    title: string;
    body: string;
    updatedAt: string;
  };
};

/**
 * GET /api/policy/version/latest?scope=...
 */
export async function fetchLatestPolicy(
  scope: PolicyScope
): Promise<PolicyDTO> {
  const res = await apiFetch<PolicyDTO>(
    `/api/policy/version/latest?scope=${scope}`
  );

  if (!res) {
    throw new Error("Invalid policy response");
  }

  return res;
}