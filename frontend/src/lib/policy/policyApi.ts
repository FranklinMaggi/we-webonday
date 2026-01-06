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

import { API_BASE } from "../config";

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

export async function fetchLatestPolicy(
  scope: PolicyScope
): Promise<PolicyDTO> {
  const res = await fetch(
    `${API_BASE}/api/policy/version/latest?scope=${scope}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch latest policy");
  }

  return res.json();
}
