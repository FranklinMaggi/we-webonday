// ======================================================
// FE || PRESET || PresetSelector
// ======================================================
//
// RUOLO:
// - Carica i preset di una Solution
// - Gestisce selezione
// - Emana SOLO intenti (no side-effects)
//
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "@shared/lib/api";
import { t } from "@shared/aiTranslateGenerator";

import type { SitePresetPublicDTO } from "../api/DataTransferObject/types/preset.types";
import { PresetCard } from "./presetCard";
import { presetClasses as cls } from "./preset.classes";

type PresetListResponse =
  | { ok: true; presets: SitePresetPublicDTO[] }
  | { ok: false; error: string };

type Props = {
  solutionId: string;

  onPresetSelected: (presetId: string) => void;

  /** PREVIEW-FIRST (INTENT ONLY) */
  onPresetPreview?: (preset: SitePresetPublicDTO | null) => void;

  /** default: hover */
  previewMode?: "hover" | "click";
};

export function PresetSelector({
  solutionId,
  onPresetSelected,
  onPresetPreview,
  previewMode = "hover",
}: Props) {
  const [presets, setPresets] = useState<SitePresetPublicDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePreviewId, setActivePreviewId] =
    useState<string | null>(null);

  /* =========================
     LOAD PRESETS
  ========================= */
  useEffect(() => {
    setLoading(true);

    apiFetch<PresetListResponse>(
      `/api/preset/list?solutionId=${solutionId}`
    )
      .then((res) => {
        if (!res || typeof res !== "object") return;
        if (!("ok" in res) || !res.ok) return;

        setPresets(res.presets);
      })
      .finally(() => setLoading(false));
  }, [solutionId]);

  if (loading) {
    return (
      <p className={cls.loading}>
        {t("preset.loading")}
      </p>
    );
  }

  /* =========================
     HANDLERS
  ========================= */
  function handlePreview(preset: SitePresetPublicDTO) {
    setActivePreviewId(preset.id);
    onPresetPreview?.(preset);
  }

  function clearPreview() {
    setActivePreviewId(null);
    onPresetPreview?.(null);
  }
  if (loading) {
    return (
      <p className={cls.selector}>
        {t("preset.loading")}
      </p>
    );
  }
  
  return (
    <section className={cls.selector}>
      <header className={cls.header}>
        <h2 className={cls.title}>
          {t("preset.selector.title")}
        </h2>
        <p className={cls.subtitle}>
          {t("preset.selector.subtitle")}
        </p>
      </header>

      <div className={cls.grid}>
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            active={preset.id === activePreviewId}
            onHover={
              previewMode === "hover"
                ? () => handlePreview(preset)
                : undefined
            }
            onLeave={
              previewMode === "hover"
                ? clearPreview
                : undefined
            }
            onClick={
              previewMode === "click"
                ? () => handlePreview(preset)
                : undefined
            }
            onSelect={() => onPresetSelected(preset.id)}
          />
        ))}
      </div>
    </section>
  );
}
