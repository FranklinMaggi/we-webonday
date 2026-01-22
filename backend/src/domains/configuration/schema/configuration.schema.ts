// ======================================================
// BE || domains/configuration/configuration.schema.ts
// ======================================================
//
// CONFIGURATION — CORE DOMAIN (WORKSPACE PRE-ORDER)
//
// RUOLO:
// - Single Source of Truth della Configuration
// - Workspace mutabile fino all’ordine
//
// INVARIANTI:
// - Configuration ≠ Business
// - Configuration ≠ Order
// - userId derivato SOLO da sessione
// - Business nasce SOLO dopo StepBusiness + Policy
// ======================================================

import { z } from "zod";

/* ======================================================
   CONFIGURATION STATUS — CANONICAL STATE MACHINE
====================================================== */

export const CONFIGURATION_STATUS = [
  // BOOTSTRAP
  "DRAFT",

  // BUSINESS SETUP
  "BUSINESS_READY",

  // CONFIGURATION SETUP
  "CONFIGURATION_IN_PROGRESS",
  "CONFIGURATION_READY",

  // PREVIEW & VALIDATION
  "PREVIEW",
  "ACCEPTED",

  // COMMERCIALE
  "ORDERED",

  // POST-ORDER
  "IN_PRODUCTION",
  "DELIVERED",

  // TERMINALI
  "CANCELLED",
  "ARCHIVED",
] as const;

export type ConfigurationStatus =
  (typeof CONFIGURATION_STATUS)[number];

/* ======================================================
   PREFILL (VISITOR / BUYFLOW)
   ⚠️ NON È BUSINESS
====================================================== */

export const ConfigurationPrefillSchema = z.object({
  businessName: z.string().min(2).max(80),
});

/* ======================================================
   WORKSPACE DATA (UI-DRIVEN)
====================================================== */

export const ConfigurationWorkspaceSchema = z.object({
  layoutId: z.string().optional(),
  themeId: z.string().optional(),
  lastPreviewAt: z.string().optional(),
});

/* ======================================================
   MAIN CONFIGURATION SCHEMA
====================================================== */

export const ConfigurationSchema = z.object({
  /* ---------- Identity ---------- */
  id: z.string().uuid(),
  userId: z.string().optional(),

  /* ---------- Business linkage (POST-STEP) ---------- */
  businessId: z.string().optional(),
/* ---------- Business draft linkage (PRE-BUSINESS) ---------- */
businessDraftId: z.string().optional(),
  /* ---------- Commercial origin ---------- */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* ---------- Prefill (BuyFlow) ---------- */
  prefill: ConfigurationPrefillSchema.optional(),

  /* ---------- Options ---------- */
  options: z.array(z.string()).default([]),

  /* ---------- Workspace ---------- */
  data: ConfigurationWorkspaceSchema.default({}),

  /* ---------- Status ---------- */
  status: z.enum(CONFIGURATION_STATUS).default("DRAFT"),

  /* ---------- Timestamps ---------- */
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export type ConfigurationDTO = z.infer<typeof ConfigurationSchema>;
