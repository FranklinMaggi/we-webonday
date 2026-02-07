import type { FrontendPreviewPayload } from "../../engine/api/types/preview.payload";
import { buildCanvas } from "../../engine/builder/buildCanvas";

export function resolveFrontendPreviewCanvas(
  payload: FrontendPreviewPayload
) {
  if (payload.source === "backend") {
    return payload.canvas;
  }

  return buildCanvas(payload.engineInput);
}
