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
import type { SitePresetPublicDTO } from "../api/DataTransferObject/preset.types";
import { PresetCard } from "./presetCard";
import { presetClasses as cls } from "./preset.classes";



type PresetListResponse =
  | { ok: true; presets: SitePresetPublicDTO[] }
  | { ok: false; error: string };


  type Props = {
  solutionId: string;
  onPresetSelected: (presetId: string) => void;
};


export function PresetSelector({
  solutionId,
  onPresetSelected,
}: Props) {
  const [presets, setPresets] = useState<
    SitePresetPublicDTO[]
  >([]);
  const [loading, setLoading] = useState(true);

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
    return <p>Caricamento stili…</p>;
  }

  return (
    <section className={cls.selector}>
      <header className={cls.header}>
        <h2 className={cls.title}>
          Scegli lo stile del tuo sito
        </h2>
        <p className={cls.subtitle}>
          Ogni preset è un sito già progettato,
          personalizzato poi con i tuoi contenuti.
        </p>
      </header>

      <div className={cls.grid}>
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            onSelect={onPresetSelected}
          />
        ))}
      </div>
    </section>
  );
}
