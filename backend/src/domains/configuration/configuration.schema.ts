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
