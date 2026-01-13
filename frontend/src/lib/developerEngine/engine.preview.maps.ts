// ======================================================
// FE || ENGINE — PREVIEW MAP
// ======================================================

import type { CanvasSection } from "./engine.schema.fe";

export function filterPreviewSections(
  sections: CanvasSection[]
): CanvasSection[] {
  return sections.filter(
    (s) => s.type !== "location" // esempio blur
  );
}
