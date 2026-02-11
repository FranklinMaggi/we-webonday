// src/user/site-engine/template/resolveTemplate.ts
 import { AVAILABLE_LAYOUTS } from "@src/marketing/pages/solution/solution-with-template/layouts.mock.ts 08-22-40-633";
import { normalizeLayoutStyle, normalizePalette } from
  "../preview/site.normalizer";
import type { ResolvedTemplate } from "./types/resolveTemplate";

export function resolveTemplateFallback(): ResolvedTemplate {
  return {
    id: "fallback-template",
    layout: AVAILABLE_LAYOUTS[0],
    style: normalizeLayoutStyle(),
    palette: normalizePalette(),
  };
}
