// ======================================================
// FE || BuyFlow — ProductCard (NO PRICING)
// ======================================================
//
// RUOLO:
// - Consentire la scelta di UN prodotto
// - Avviare la configurazione BASE
//
// INVARIANTI:
// - Nessuna prezzistica
// - Nessuna option selection
// - Nessuna persistenza
//
// ======================================================

import { useState } from "react";
import type { ProductVM } from "../../../../lib/viewModels/product/Product.view-model";
import BuyflowPreForm from "./PreForm";

interface Props {
  solutionId: string;
  product: ProductVM;
}
export default function ProductCard({ solutionId, product }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`wd-card product-card ${open ? "is-active" : ""}`}>
      {/* ================= HEADER ================= */}
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

        {/* ================= CTA HINT ================= */}
        <p className="product-card__hint">
          Avvia una richiesta guidata per questo prodotto
        </p>

        <button
          type="button"
          className="wd-btn wd-btn--secondary"
        >
          Contattaci
        </button>
      </div>

      {/* ================= NEXT STEP ================= */}
      {open && (
        <div
          className="product-card__panel"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="product-card__next-step">
            Nel prossimo passaggio raccoglieremo le informazioni
            essenziali per capire il tuo progetto e guidarti
            nella configurazione.
          </p>

          <BuyflowPreForm
            solutionId={solutionId}
            product={product}
          />
        </div>
      )}
    </div>
  );
}
