// ======================================================
// FE || DEVELOPER ENGINE — TYPES
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";
import type { LayoutStyle } from "../configurationLayout/style.dto";
import type { ColorPaletteId } from "../configurationLayout/palette.dto";

export type EngineInput = {
  configurationId: string;

  business: {
    name: string;
    sector: string;
    address: string;
    slug: string;
  };

  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};

export type EngineVariantId = string;
