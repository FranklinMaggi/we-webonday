// ======================================================
// BE || domains/configuration/configuration.schema.ts
// ======================================================
//
// CONFIGURATION — CORE DOMAIN (PRE-ORDER WORKSPACE)
//
// RUOLO:
// - Single Source of Truth della Configuration
// - È un workspace mutabile pre-ordine
//
// INVARIANTI:
// - Configuration ≠ Order
// - user derivato da sessione
// - KV keys deterministiche
//
// NOTE:
// - Manteniamo compatibilità con flussi esistenti:
//   • createConfigurationFromCart (che oggi non setta sempre id/userId)
//   • createConfiguration (che aggiunge createdAt/updatedAt manualmente)
// ======================================================

import { z } from "zod";
import type { Env } from "../../types/env";
import { OpeningHoursSchema } from "./schema/business.schema";


const BusinessTagSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: "businessTag must be kebab-case lowercase",
  });
/* =========================
   STATUS (compat + step)
========================= */
export const CONFIGURATION_STATUS = [
  "draft",
  "BUSINESS_READY", // stepbusiness commit
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
  /* ---------- Identity (BE) ---------- */
  id: z.string().optional(),
  userId: z.string().optional(),
  businessId: z.string().optional(),
  
  /* ---------- Commercial origin ---------- */
  solutionId: z.string().min(1),
  productId: z.string().optional(),
  projectId: z.string().optional(),

  /**
   * TAG BUSINESS (SCELTA UTENTE)
   * - derivano da Solution.tags + input user
   * - persistenti in KV
   * - SEO / AI / Preview
   */
  businessTags: z.array(BusinessTagSchema).default([]),

  /* ---------- Options ---------- */
  options: z.array(z.string()).default([]),

  /* ---------- Workspace FE ---------- */
  data: z.any(),

  /* ---------- Status ---------- */
  status: z.enum(CONFIGURATION_STATUS).default("draft"),

  /* ---------- Timestamps ---------- */
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ConfigurationDTO = z.infer<typeof ConfigurationSchema>;

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
export async function getConfiguration(env: Env, id: string) {
  const raw = await env.CONFIGURATION_KV.get(configurationKey(id));
  return raw ? (JSON.parse(raw) as ConfigurationDTO) : null;
}

/* =========================
   ID HELPERS (DETERMINISTICO)
========================= */
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
 * pattern: {businessSlug}:{solutionId}
 * es: pizzeria-da-mario:website-basic
 */
export function buildConfigurationId(businessName: string, solutionId: string) {
  return `${slugify(businessName)}:${slugify(solutionId)}`;
}
