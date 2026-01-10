// FE || components/catalog/ProductCard.tsx
// ======================================================
// PRODUCT CARD — INLINE CONFIGURATOR
// ======================================================
//
// RUOLO:
// - Entry point prodotto
// - Toggle apertura / chiusura configurazione INLINE
//
// FLUSSO:
// Solution/[id]
//   → ProductCard
//     → OptionSelector
//     → CartPreview
// ======================================================

import { useState } from "react";
import type { ProductVM } from "../../../../lib/viewModels/product/Product.view-model";
import { eur } from "../../../../utils/format";
import OptionSelector from "../ProductOption/OptionSelector";
import CartPreview from "./CartPreview";

interface Props {
  solutionId:string; 
  product: ProductVM;
}

export default function ProductCard({ solutionId ,product }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <div
      className={`wd-card product-card ${open ? "is-active" : ""}`}
     
    >
      {/* ================= BODY (TOGGLE) ================= */}
      <div
        className="product-card__body"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
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

      {/* ================= CONFIGURATORE INLINE ================= */}
      {open && (
        <div
          className="product-card__panel"
          onClick={(e) => e.stopPropagation()}
        >
          
          {product.options && product.options.length > 0 && (
          <OptionSelector
            options={product.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />
        )}

          <CartPreview
          solutionId={solutionId}
            product={product}
            selectedOptions={selectedOptions}
          />
        </div>
      )}
    </div>
  );
}
