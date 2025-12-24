/**
 * ======================================================
 * POLICY — CORE
 * ======================================================
 *
 * RESPONSABILITÀ:
 * - Definizione degli schema Zod
 * - Convenzioni delle chiavi KV
 * - Helper condivisi tra admin e user
 *
 * NON CONTIENE:
 * - accesso alla sessione
 * - logica HTTP
 * - logica di permessi
 *
 * È il cuore riutilizzabile del dominio POLICY.
 */

import { z } from "zod";
import type { Env } from "../../types/env";

/* =========================
   SCHEMAS
========================= */

/**
 * Schema per registrare una nuova policy.
 * Usato SOLO lato admin / seed.
 */
export const RegisterPolicySchema = z.object({
  version: z.string().min(1),
  content: z.string().min(1),
});

/**
 * Schema accettazione policy lato utente.
 * NON contiene userId (deriva sempre dalla sessione).
 */
export const AcceptPolicySchema = z.object({
  policyVersion: z.string().min(1),
});

/* =========================
   KV KEYS (SINGLE SOURCE)
========================= */

/**
 * Chiave che punta SEMPRE alla policy attiva.
 */
export const POLICY_LATEST_KEY = "POLICY_LATEST";

/**
 * Chiave versione policy.
 */
export function policyVersionKey(version: string) {
  return `POLICY_VERSION:${version}`;
}

/**
 * Chiave accettazione user-bound.
 * Ogni accettazione è legata a:
 * - userId
 * - versione policy
 */
export function policyAcceptanceKey(userId: string, version: string) {
  return `POLICY_ACCEPTANCE:${userId}:${version}`;
}

/* =========================
   HELPERS
========================= */

/**
 * Ritorna la versione latest della policy.
 * Usata sia da admin che da user.
 */
export async function getLatestPolicyVersion(env: Env) {
  return env.POLICY_KV.get(POLICY_LATEST_KEY);
}
