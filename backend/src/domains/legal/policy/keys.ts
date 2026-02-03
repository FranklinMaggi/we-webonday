// ======================================================
// POLICY — KV HELPERS (CANONICAL)
// ======================================================
//
// RUOLO:
// - Centralizzare tutte le chiavi KV
// - Garantire portabilità del dominio
//
// INVARIANTE:
// - type + scope + version identificano una policy
// ======================================================

import type { PolicyType, PolicyScope } from "./policy.types";

export function POLICY_LATEST_KEY(type: PolicyType, scope: PolicyScope) {
  return `POLICY:${type}:${scope}:LATEST`;
}

export function POLICY_VERSION_KEY(
  type: PolicyType,
  scope: PolicyScope,
  version: string
) {
  return `POLICY:${type}:${scope}:${version}`;
}

export function POLICY_ACCEPTANCE_KEY(
  subjectId: string, // visitorId | userId
  type: PolicyType,
  scope: PolicyScope,
  version: string
) {
  return `POLICY_ACCEPTANCE:${subjectId}:${type}:${scope}:${version}`;
}