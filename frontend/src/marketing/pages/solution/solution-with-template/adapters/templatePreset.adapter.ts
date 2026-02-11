// ======================================================
// FE || SOLUTION || TEMPLATE PRESET ADAPTER
// ======================================================
//
// RUOLO:
// - Adattare templatePresets → EngineInput parziale
// - Usato SOLO in solution/[id]
// - NON persiste nulla
// ======================================================

import type { LayoutStyle } from
  "@src/user/site-engine/engine/api/types/style.dto";
import type { ColorPaletteId } from
  "@src/user/site-engine/engine/api/types/palette.dto";

export type TemplatePresetDTO = {
  id: string;
  label: string;
  previewImage: string;
  gallery: string[];
  style: LayoutStyle;
  palette: ColorPaletteId;
};

export type TemplatePresetEngineSeed = {
  style: LayoutStyle;
  palette: ColorPaletteId;
  galleryImages: string[];
};

export function adaptTemplatePresetToEngineSeed(
  preset: TemplatePresetDTO
): TemplatePresetEngineSeed {
  return {
    style: preset.style,
    palette: preset.palette,
    galleryImages: preset.gallery,
  };
}
