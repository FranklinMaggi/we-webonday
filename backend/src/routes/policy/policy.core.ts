// ======================================================
// POLICY — CORE
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Single Source of Truth del dominio POLICY
// - Definisce:
//   - scopes supportati
//   - schema di input
//   - convenzioni KV
//   - helper condivisi
//
// INVARIANTI:
// - Backend = source of truth
// - FE NON costruisce chiavi
// - Scope obbligatorio (general | checkout)
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../types/env";

/* =========================
   SCOPES SUPPORTATI
========================= */

export const POLICY_SCOPES = ["general", "checkout"] as const;
export type PolicyScope = (typeof POLICY_SCOPES)[number];

/* =========================
   SCHEMAS
========================= */

export const RegisterPolicySchema = z.object({
  scope: z.enum(POLICY_SCOPES),
  version: z.string().min(1),
  content: z.any(), // string | structured object
});

export const AcceptPolicySchema = z.object({
  scope: z.enum(POLICY_SCOPES),
  policyVersion: z.string().min(1),
});

/* =========================
   KV KEYS — SINGLE SOURCE
========================= */

export function policyLatestKey(scope: PolicyScope) {
  return `POLICY_LATEST:${scope}`;
}

export function policyVersionKey(
  scope: PolicyScope,
  version: string
) {
  return `POLICY_VERSION:${scope}:${version}`;
}

export function policyAcceptanceKey(
  userId: string,
  scope: PolicyScope,
  version: string
) {
  return `POLICY_ACCEPTANCE:${userId}:${scope}:${version}`;
}

/* =========================
   HELPERS
========================= */

export async function getLatestPolicyVersion(
  env: Env,
  scope: PolicyScope
) {
  return env.POLICY_KV.get(policyLatestKey(scope));
}
