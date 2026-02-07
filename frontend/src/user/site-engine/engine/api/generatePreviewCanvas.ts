// ======================================================
// FE || DEVELOPER ENGINE — ORCHESTRATOR
// ======================================================

import type { LayoutKVDTO } from "./types/layout.dto";
import type { LayoutStyle } from "./types/style.dto";
import type { ColorPaletteId } from "./types/palette.dto";

import { buildCanvas } from "../builder/buildCanvas";
import type { EngineCanvas } from "../../preview/api/types/engine.canvas";

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
