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

import type { SitePresetPublicDTO } from "../api/DataTransferObject/types/preset.types";
import { presetClasses as cls } from "./preset.classes";

type Props = {
  preset: SitePresetPublicDTO;

  /** UI STATE */
  active?: boolean;

  /** INTENTS (NO SIDE EFFECTS) */
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;

  onSelect: () => void;
};


export function PresetCard({
  preset,
  active,
  onHover,
  onLeave,
  onClick,
  onSelect,
}: Props) {
  return (
    <article
  className={cls.card}
  data-active={active ? "true" : "false"}
  role="button"
  tabIndex={0}
  onMouseEnter={onHover}
  onMouseLeave={onLeave}
  onClick={onClick ?? onSelect}
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
