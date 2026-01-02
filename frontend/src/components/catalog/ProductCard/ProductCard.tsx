// FE || components/catalog/ProductCard.tsx
// ======================================================
// PRODUCT CARD — TOGGLE CONFIGURATION
// ======================================================
//
// RUOLO:
// - Entry point prodotto
// - Toggle apertura / chiusura configurazione
//
// NOTE:
// - L'intera card è cliccabile
// - I bottoni NON togglano (stopPropagation)
//
// ======================================================
// FE || components/catalog/ProductCard.tsx
// ======================================================
// PRODUCT CARD — INLINE CONFIGURATOR
// ======================================================

import { useState } from "react";
import type { ProductDTO } from "../../../dto/productDTO";
import { eur } from "../../../utils/format";
import OptionSelector from "./OptionSelector"; // vedi nota naming
import CartPreview from "./CartPreview";


interface Props {
  product: ProductDTO;
}

export default function ProductCard({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleCard = () => {
    setOpen((v) => {
      const next = !v;
     
      return next;
    });
  };

  return (
    <div className={`product-card card ${open ? "is-active" : ""}`}>
      {/* AREA CLICCABILE UNICA */}
      <div className="product-card__body" onClick={toggleCard}>
        <h2 className="product-card__title">{product.name}</h2>

        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        <div className="product-card__price">
          <span className="price-value">
            {eur.format(product.startupFee)}
          </span>
          <span className="price-note">avvio progetto</span>
        </div>
      </div>

      {/* CONFIGURATORE INLINE */}
      {open && (
        <div
          className="product-card__panel"
          onClick={(e) => e.stopPropagation()}
        >
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
