// ======================================================
// FE || WORKSPACE PREVIEW — SITE ADAPTER
// ======================================================
//
// RUOLO:
// - Adattare BusinessDraftPreview → EngineInput
//
// INVARIANTI:
// - Funzione pura
// - Nessun fetch / store
// - Nessun side effect
// - Nessuna normalizzazione (già fatta a monte)
// ======================================================

import type { EngineInput } from"@src/user/site-engine/engine/api/types/engine.types";
import { slugify } from "@shared/utils/slugify";
import { type AdapterInput } from "./types/input.adapter.type ";


export function adaptFrontendPreviewInput(
  input: AdapterInput
): EngineInput {
  const { configurationId, business, layout, style, palette } = input;

  return {
    configurationId,

    business: {
      name: business.name,
      slug: slugify(business.name),

      // 🔹 semantica business
      sector: business.sector ?? "generic",
      address: business.address ?? "",

      // 🔹 dati strutturati (usati dai renderer)
      openingHours: business.openingHours,
    },

    layout,
    style,
    palette,
  };
}