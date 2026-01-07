// FE || components/catalog/OptionSelector.tsx
// ======================================================
// OPTION SELECTOR — MONTHLY ONLY (ALIGNED WITH ProductOptionDTO)
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Consentire la selezione di servizi aggiuntivi (option)
// - Comunicare in modo esplicito il costo mensile
//
// DOMINIO (CHIUSO):
// - Le option sono SEMPRE:
//   - ricorrenti
//   - mensili
// - Il campo `type` del DTO NON viene interpretato
//
// ASSUNZIONI:
// - ProductOptionDTO è già normalizzato
// - opt.label ESISTE sempre
// - opt.price ESISTE sempre
//
// NON FA:
// - calcoli
// - logica carrello
// - interpretazione dominio
//
// ======================================================

import type { ProductOptionDTO } from "../../../dto/productDTO";
import { eur } from "../../../utils/format";
import { t } from "../../../lib/translateFe/helper/i18n";

interface Props {
  options: ProductOptionDTO[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OptionSelector({
  options,
  selected,
  onChange,
}: Props) {
  /* =========================
     TOGGLE OPTION
  ========================= */
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="option-selector wd-card">
      {/* ================= HEADER ================= */}
      <div className="card__header">
        <h4 className="card__title">
          {t("option.product.title.monthly_addons")}
        </h4>
      </div>

      {/* ================= LIST ================= */}
      <div
        className="option-list"
        role="group"
        aria-label={t("option.product.aria.group")}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
        
          return (
            <label
              key={opt.id}
              className={`option-item ${checked ? "is-checked" : ""}`}
            >
              <input
                type="checkbox"
                className="option-item__checkbox"
                checked={checked}
                onChange={() => toggle(opt.id)}
                aria-label={t(
                  "option.product.aria.option_monthly",
                  {
                    label: opt.label,
                    price: eur.format(opt.price),
                  }
                )}
              />

              <span className="option-item__box" aria-hidden="true" />

              <span className="option-item__content">
                {/* LABEL SERVIZIO */}
                <span className="option-label">
                  {opt.label}
                </span>

                {/* PREZZO MENSILE */}
                <span className="option-price">
                  {t(
                    "option.product.label.price_monthly",
                    {
                      price: eur.format(opt.price),
                    }
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
