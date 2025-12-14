// OptionSelector.tsx
import type { ProductOptionDTO } from "../../lib/types";
import { eur } from "../../utils/format";

interface Props {
  options: ProductOptionDTO[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OptionSelector({ options, selected, onChange }: Props) {
  const toggle = (id: string) =>
    selected.includes(id) ? onChange(selected.filter((x) => x !== id)) : onChange([...selected, id]);

  return (
    <div className="option-selector card">
      <div className="card__header">
        <h4 className="card__title">Opzioni disponibili</h4>
      </div>

      <div className="option-list">
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <label key={opt.id} className={`option-item ${checked ? "is-checked" : ""}`}>
              <input
                type="checkbox"
                className="option-item__checkbox"
                checked={checked}
                onChange={() => toggle(opt.id)}
                aria-label={`${opt.label} ${eur.format(opt.price)}`}
              />
              <span className="option-item__box" aria-hidden="true" />
              <span className="option-item__content">
                <span className="option-label">{opt.label}</span>
                <span className="option-price">+ {eur.format(opt.price)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
