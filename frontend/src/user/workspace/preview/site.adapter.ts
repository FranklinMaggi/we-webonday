// ======================================================
// FE || WORKSPACE PREVIEW — SITE ADAPTER
// ======================================================
//
// RUOLO:
// - Adattare BusinessDraft → EngineInput
//
// INVARIANTI:
// - NO fetch
// - NO store
// - NO side effects
// - Funzione pura
// ======================================================

import type { EngineInput } from "@app/webyDevEngine/developerEngine/engine.types";
import type { LayoutKVDTO } from "@app/webyDevEngine/configurationLayout/layout.dto";
import type { LayoutStyle } from "@app/webyDevEngine/configurationLayout/style.dto";
import type { ColorPaletteId } from "@app/webyDevEngine/configurationLayout/palette.dto";

import { slugify } from "@shared/utils/slugify";
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";

type BusinessDraftPreview = {
  name: string;
  sector: string;
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

export function adaptBusinessDraftToEngineInput(
  input: AdapterInput
): EngineInput {
  const { configurationId, business, layout, style, palette } = input;

  return {
    configurationId,

    business: {
      name: business.name,
      sector: business.sector,
      address: business.address ?? "",
      slug: slugify(business.name),
    },

    layout,
    style,
    palette,
  };
}
