// ======================================================
// BE || routes/configuration/configuration.core.ts
// ======================================================
//
// CONFIGURATION — CORE DOMAIN
//
// RUOLO:
// - Single Source of Truth Configuration
// - Definisce:
//   - schema
//   - stati
//   - chiavi KV
//
// INVARIANTI:
// - Configuration ≠ Order
// - Nessuna policy richiesta
// - User derivato da sessione
// ======================================================

import { z } from "zod";
import type { Env } from "../../types/env";

/* =========================
   STATUS
========================= */
export const CONFIGURATION_STATUS = [
  "draft",
  "preview",
  "accepted",
  "ordered",
] as const;

export type ConfigurationStatus =
  (typeof CONFIGURATION_STATUS)[number];

/* =========================
   SCHEMA
========================= */
export const ConfigurationSchema = z.object({
  solutionId: z.string().min(1),

  productId: z.string().optional(),
  projectId: z.string().optional(),

  options: z.array(z.string()).default([]),

  data: z.any(), // AI + business + design (FE schema)

  status: z.enum(CONFIGURATION_STATUS).default("draft"),
});

/* =========================
   KV KEYS
========================= */
export function configurationKey(id: string) {
  return `CONFIGURATION:${id}`;
}

export function userConfigurationsKey(userId: string) {
  return `USER_CONFIGURATIONS:${userId}`;
}

/* =========================
   HELPERS
========================= */
export async function getConfiguration(
  env: Env,
  id: string
) {
  const raw = await env.CONFIGURATION_KV.get(
    configurationKey(id)
  );
  return raw ? JSON.parse(raw) : null;
}
// ======================================================
// CONFIGURATION ID HELPERS
// ======================================================

export function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  
  /**
   * ConfigurationId deterministico
   * pattern:
   * {businessSlug}:{solutionId}
   *
   * Esempio:
   * pizzeria-da-mario:website-basic
   */
  export function buildConfigurationId(
    businessName: string,
    solutionId: string
  ) {
    return `${slugify(businessName)}:${slugify(solutionId)}`;
  }
  