// @/domains/configuration/schema/configuration.schema.ts
// ======================================================
// DOMAIN || CONFIGURATION || SCHEMA
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Validazione strutturale della Configuration
// - NON definisce lo stato
//
// REGOLA:
// - Lo stato è importato dal pack configuration.status
// ======================================================

import { z } from "zod";
import {
  CONFIGURATION_STATUS,
} from "../mappers/configuration.status";

/* ======================================================
   PREFILL
====================================================== */

export const ConfigurationPrefillSchema = z.object({
  businessName: z.string().min(2).max(80),
});

/* ======================================================
   WORKSPACE DATA
====================================================== */

export const ConfigurationWorkspaceSchema = z.object({
  layoutId: z.string().optional(),
  themeId: z.string().optional(),
  lastPreviewAt: z.string().optional(),
});

/* ======================================================
   MAIN SCHEMA
====================================================== */

export const ConfigurationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(),

  solutionId: z.string().min(1),
  productId: z.string().min(1),

  prefill: ConfigurationPrefillSchema.optional(),
  options: z.array(z.string()).default([]),
  data: ConfigurationWorkspaceSchema.default({}),

  status: z.enum(CONFIGURATION_STATUS),
  dataComplete:z.boolean().default(false),  
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export type ConfigurationDTO =
  z.infer<typeof ConfigurationSchema>;