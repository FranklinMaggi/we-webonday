import { z } from "zod";

/**
 * ======================================================
 * DOMAIN || PRESET || SITE PRESET SCHEMA
 * ======================================================
 * RUOLO:
 * - Definisce un preset di sito selezionabile dall’utente
 * - Applicabile a una Solution
 * - Override controllato del preset base
 * ======================================================
 */

export const SitePresetSchema = z.object({
  /* ================= IDENTITY ================= */

  id: z.string(),                // es: "cozy"
  solutionId: z.string(),        // es: "bnb"
  version: z.string(),           // es: "1.0"

  /* ================= META ================= */

  name: z.string(),              // "Cozy Stay"
  description: z.string(),       // breve copy UX
  status: z.enum(["ACTIVE", "ARCHIVED"]),

  /* ================= PREVIEW ================= */

  preview: z.object({
    heroImageKey: z.string(),    // R2 key
    galleryKeys: z.array(z.string()).optional()
  }),

  /* ================= OVERRIDES ================= */

  overrides: z.object({
    layoutId: z.string().optional(),
    styleId: z.string().optional(),
    paletteId: z.string().optional()
  }),

  /* ================= FEATURES ================= */

  features: z.record(z.boolean()).optional(),

  /* ================= AUDIT ================= */

  createdAt: z.string(),
  updatedAt: z.string()
});

export type SitePreset = z.infer<typeof SitePresetSchema>;
