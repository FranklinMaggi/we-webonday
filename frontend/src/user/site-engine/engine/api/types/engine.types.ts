// ======================================================
// FE || DEVELOPER ENGINE — TYPES
// ======================================================
//
// RUOLO:
// - Tipi canonici dell’Engine
// - Contratto tra Adapter → Builder → Renderer
//
// INVARIANTI:
// - Dati business REALI
// - Nessuna logica
// ======================================================

import type { LayoutKVDTO } from "./layout.dto";
import type { LayoutStyle } from "./style.dto";
import type { ColorPaletteId } from "./palette.dto";
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";

export type EngineInput = {
  configurationId: string;

  business: {
    name: string;
    slug: string;

    // 🔹 semantica
    sector: string;
    address: string;
    descriptionText?: string; // ⬅️ GENERATED
    // 🔹 dati strutturati (usati dai renderer)
    openingHours?: OpeningHoursFE;
  };

  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};

export type EngineVariantId = string;