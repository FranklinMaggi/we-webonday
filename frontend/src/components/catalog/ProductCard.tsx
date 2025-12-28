// FE || components/catalog/ProductCard.tsx
// ======================================================
// PRODUCT CARD — ENTRY POINT PRODOTTO
// ======================================================
//
// RESPONSABILITÀ:
// - Presentare il prodotto
// - Mostrare costo di avvio
// - Avviare configurazione
//
// NON FA:
// - calcoli
// - sconti
// - gestione opzioni
//
// ======================================================

import type { ProductDTO } from "../../dto/productDTO";
import { eur } from "../../utils/format";

interface Props {
  product: ProductDTO;
  onSelect: (product: ProductDTO) => void;
}

export default function ProductCard({ product, onSelect }: Props) {
  return (
    <div className="product-card card">
      <div className="product-card__body">
        <h2 className="product-card__title">{product.title}</h2>

        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        {/* PREZZO DI PARTENZA */}
        <div className="product-card__price">
          <span className="price-value">
            {eur.format(product.startupFee)}
          </span>
          <span className="price-note">
            avvio progetto
          </span>
        </div>
      </div>

      <div className="product-card__footer">
        <button
          className="btn btn-primary"
          onClick={() => onSelect(product)}
        >
          Configura
        </button>
      </div>
    </div>
  );
}
