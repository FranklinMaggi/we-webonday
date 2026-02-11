// ======================================================
// BE || PRESET SCHEMA
// ======================================================
//
// RUOLO:
// - Definisce la struttura e i moduli di un sito
// - Specifico per solution
//
// NON FA:
// - NON contiene dati business
// - NON contiene CSS
// - NON contiene HTML
// ======================================================

import { z } from "zod";
import { CentralModuleSectionSchema } from "./central.module.section.schema";

/* =========================
   PRESET FEATURES
========================= */
export const PresetFeaturesSchema = z.object({
  navbar: z.literal(true),      // sempre true
  hero: z.literal(true),        // sempre true

  gallery: z.boolean(),
  openingHours: z.boolean(),
  map: z.boolean(),
  whatsapp: z.boolean(),

  footer: z.literal(true),      // sempre true
});

/* =========================
   PRESET SCHEMA
========================= */
export const SiteTemplateSchema = z.object({
  id: z.string(),               // es: "food"
  version: z.string(),          // es: "1.0"

  layoutId: z.string(),         // es: "layout-landing-espresso"

  centralModule: CentralModuleSectionSchema,

  features: PresetFeaturesSchema,

  defaults: z.object({
    styleId: z.string(),        // "elegant"
    paletteId: z.string(),      // "corporate"
  }),
});

export type SiteTemplateSchema = z.infer<typeof SiteTemplateSchema>;
