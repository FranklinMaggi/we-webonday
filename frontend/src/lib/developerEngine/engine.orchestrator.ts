// ======================================================
// FE || DEVELOPER ENGINE — ORCHESTRATOR
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";
import type { LayoutStyle } from "../configurationLayout/style.dto";
import type { ColorPaletteId } from "../configurationLayout/palette.dto";

import { buildCanvas } from "./engine.builder";
import type { EngineCanvas } from "./engine.schema.fe";

type OrchestratorInput = {
  configurationId: string;

  business: {
    name: string;
    sector: string;
    address: string;
    slug: string;
  };

  layouts: LayoutKVDTO[];
  styles: LayoutStyle[];
  palettes: ColorPaletteId[];
};

export function generatePreviewCanvases(
  input: OrchestratorInput
): EngineCanvas[] {
  const canvases: EngineCanvas[] = [];

  for (const layout of input.layouts) {
    for (const style of input.styles) {
      if (!layout.supportedStyles.includes(style)) continue;

      for (const palette of input.palettes) {
        if (!layout.supportedPalettes.includes(palette)) continue;

        canvases.push(
          buildCanvas({
            configurationId: input.configurationId,
            business: input.business,
            layout,
            style,
            palette,
          })
        );
      }
    }
  }

  return canvases;
}
