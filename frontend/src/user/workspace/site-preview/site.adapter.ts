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

import type { EngineInput } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.types";
import type { LayoutKVDTO } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";
import type { LayoutStyle } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";
import type { ColorPaletteId } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";

import { slugify } from "@shared/utils/slugify";
import type { OpeningHoursFE } from
  "@shared/domain/business/openingHours.types";

/* =====================
   INPUT TYPES
===================== */
type BusinessDraftPreview = {
  name: string;
  sector?: string;
  address?: string;
  openingHours?: OpeningHoursFE;
};

type AdapterInput = {
  configurationId: string;
  business: BusinessDraftPreview;

  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};

/* =====================
   ADAPTER
===================== */
export function adaptBusinessDraftToEngineInput(
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