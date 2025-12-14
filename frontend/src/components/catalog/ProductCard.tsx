//ProductCard
import { useState } from "react";
import "./catalog.css";
import type { ProductDTO } from "../../lib/types";
import OptionSelector from "./OptionSelector";
import CartPreview from "./CartPreview";

interface Props {
  product: ProductDTO;
  onSelect?: (product: ProductDTO) => void;
  
}

export default function ProductCard({ product }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <div className={`product-card ${expanded ? "expanded" : ""}`}>
      
      {/* HEADER CARD */}
      <div className="product-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="product-title">{product.title}</h3>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-price">
          <strong>Base: € {product.basePrice.toFixed(2)}</strong>
        </div>

        {product.flags?.length > 0 && (
          <ul className="product-flags">
            {product.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>

      {/* SEZIONE ESPANDIBILE (CONFIGURAZIONE) */}
      {expanded && (
        <div className="product-configurator">
          
          <OptionSelector
            options={product.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />

          <CartPreview
            product={product}
            selectedOptions={selectedOptions}
          />
        </div>
      )}
    </div>
  );
}
