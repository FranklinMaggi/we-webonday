// ======================================================
// FE || PRESET || PresetCard
// ======================================================
//
// RUOLO:
// - Card visiva di un SitePreset
// - Usata in marketing (pre-login)
// - Nessuna logica di selezione interna
//
// ======================================================

import type { SitePresetPublicDTO } from "../api/DataTransferObject/preset.types";
import { presetClasses as cls } from "./preset.classes";

type Props = {
  preset: SitePresetPublicDTO;
  onSelect: (presetId: string) => void;
};

export function PresetCard({ preset, onSelect }: Props) {
  return (
    <article
      className={cls.card}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(preset.id)}
    >
      {/* PREVIEW */}
      <div className={cls.preview}>
        <img
          src={`/r2/${preset.preview.heroImageKey}`}
          alt=""
          loading="lazy"
        />
      </div>

      {/* CONTENT */}
      <div className={cls.content}>
        <h3 className={cls.title}>{preset.name}</h3>
        <p className={cls.description}>
          {preset.description}
        </p>
      </div>

      {/* ACTION */}
      <div className={cls.actions}>
        <button
          type="button"
          className={cls.selectBtn}
        >
          Usa questo stile
        </button>
      </div>
    </article>
  );
}
