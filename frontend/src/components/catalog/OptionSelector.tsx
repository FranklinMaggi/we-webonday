import type { ProductOptionDTO } from "../../lib/types";

interface Props {
  options: ProductOptionDTO[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OptionSelector({ options, selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="option-selector">
      <h4>Opzioni disponibili</h4>

      <div className="option-list">
        {options.map((opt) => (
          <label key={opt.id} className="option-item">
            <input
              type="checkbox"
              checked={selected.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />

            <span className="option-label">{opt.label}</span>
            <span className="option-price">+ € {opt.price.toFixed(2)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
