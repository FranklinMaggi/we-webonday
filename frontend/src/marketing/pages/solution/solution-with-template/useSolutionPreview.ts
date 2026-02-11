// ======================================================
// FE || HOOK || useSolutionPreview
// ======================================================
//
// RUOLO:
// - Gestisce preview finta della Solution
// - Combina Solution + TemplatePreset
// - NON usa Engine
// - NON crea Configuration
//
// USO:
// - solution/[id]
//
// ======================================================

import { useMemo, useState } from "react";
import { type PublicSolutionDetailDTO } from "../api/DataTransferObject/types/types.dto";
import type { OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";

/* =========================
   OUTPUT TYPE
========================= */
export type SolutionPreviewVM = {
  businessName: string;
  heroImage?: string;
  gallery: string[];
  openingHours?: OpeningHoursFE
  style?: string; 
  palette?: string ; 
};

/* =========================
   HOOK
========================= */
export function useSolutionPreview(
  solution: PublicSolutionDetailDTO,
  businessName = "Il tuo business"
) {
  const presets = solution.templatePresets ?? [];

  const [activePresetId, setActivePresetId] = useState<string | null>(
    presets[0]?.id ?? null
  );

  const activePreset = useMemo(
    () => presets.find(p => p.id === activePresetId) ?? null,
    [presets, activePresetId]
  );

  const preview: SolutionPreviewVM = useMemo(() => {
    return {
      businessName,
      heroImage: activePreset?.gallery?.[0],
      gallery: activePreset?.gallery ?? [],
      openingHours: solution.openingHours,
      style: activePreset?.style,
      palette: activePreset?.palette,
    };
  }, [solution, activePreset, businessName]);

  return {
    preview,
    presets,
    activePresetId,
    setActivePresetId,
  };
}
