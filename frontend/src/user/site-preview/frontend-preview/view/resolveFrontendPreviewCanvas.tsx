import type { FrontendPreviewPayload } from "../../api/types/preview.payload";
import { buildCanvas } from "../../tools/webyDevEngine/developerEngine/buildCanvas.container";

export function resolveFrontendPreviewCanvas(
  payload: FrontendPreviewPayload
) {
  if (payload.source === "backend") {
    return payload.canvas;
  }

  return buildCanvas(payload.engineInput);
}
