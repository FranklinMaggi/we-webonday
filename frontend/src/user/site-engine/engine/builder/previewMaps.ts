// ======================================================
// FE || ENGINE — PREVIEW MAP
// ======================================================

import type { CanvasSection } from "../../preview/api/types/engine.canvas";

export function filterPreviewSections(
  sections: CanvasSection[]
): CanvasSection[] {
  return sections.filter(
    (s) => s.type !== "location" // esempio blur
  );
}
