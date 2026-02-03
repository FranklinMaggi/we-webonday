// ======================================================
// FE || lib/userApi/policy.user.api.ts
// ======================================================
//
// RUOLO:
// - API FE per dominio Policy (read-only)
//
// INVARIANTI:
// - Backend = source of truth
// - type + scope obbligatori
// - Nessuna accettazione policy qui
// ======================================================

import { apiFetch } from "../../../../shared/lib/api";
import type { PolicyType } from "./policy.types";

/* ================= TYPES ================= */

export type PolicyScope = "general" | "configurator" | "checkout";

export type PolicyDTO = {
  scope: PolicyScope;
  version: string;
  content: {
    title: string;
    body: string;
    updatedAt: string;
  };
};

/* ================= API ================= */

/**
 * GET /api/policy/version/latest?type=...&scope=...
 */
export async function fetchLatestPolicy(
  type: PolicyType,
  scope: PolicyScope
): Promise<PolicyDTO> {
  const res = await apiFetch<PolicyDTO>(
    `/api/policy/version/latest?type=${type}&scope=${scope}`
  );

  if (!res) {
    throw new Error("Invalid policy response");
  }

  return res;
}