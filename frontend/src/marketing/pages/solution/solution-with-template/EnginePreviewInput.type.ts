// ======================================================
// FE || SITE PREVIEW — INPUT
// ======================================================
//
// RUOLO:
// - Input per preview marketing / solution/[id]
// - Superset di EngineInput
// - NON persistito
// - NON validato dal backend
// ======================================================

import type { EngineInput } from
  "@src/user/site-engine/engine/api/types/engine.types";

export type EnginePreviewInput = EngineInput & {
  galleryPreset?: {
    key: string;
    images: string[];
  };

  copySeed?: {
    heroTitle?: string;
    heroSubtitle?: string;
    description?: string;
  };

  sectionOrder?: string[];
};
