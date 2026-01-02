// FE || components/catalog/OptionSelector.tsx
// ======================================================
// OPTION SELECTOR — PRICING TRASPARENTE
// ======================================================
//
// RESPONSABILITÀ:
// - Selezione opzioni prodotto
// - Chiarezza su tipo costo (una tantum / anno / mese)
//
// NON FA:
// - calcoli
// - logica carrello
//
// ======================================================

import type { ProductOptionDTO } from "../../../dto/productDTO";
import { eur } from "../../../utils/format";

interface Props {
  options: ProductOptionDTO[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OptionSelector({ options, selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const recurringLabel = (type: ProductOptionDTO["type"]) => {
    switch (type) {
      case "monthly":
        return "/ mese";
      case "yearly":
        return "/ anno";
      case "one_time":
      default:
        return "una tantum";
    }
  };

  return (
    <div className="option-selector wd-card">
      <div className="card__header">
        <h4 className="card__title">Opzioni disponibili</h4>
      </div>

      <div
  className="option-list"
  role="group"
  aria-label="Opzioni di configurazione prodotto"
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
                aria-label={`${opt.label} ${eur.format(opt.price)} ${recurringLabel(
                  opt.type
                )}`}
              />

              <span className="option-item__box" aria-hidden="true" />

              <span className="option-item__content">
                <span className="option-label">{opt.label}</span>

                <span className="option-price">
                  + {eur.format(opt.price)}{" "}
                  <small className="option-period">
                    {recurringLabel(opt.type)}
                  </small>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
