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
import type { ProductVM } from "@shared/lib/viewModels/product/Product.view-model";
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
          setOpen(v => !v);
        }}
      >
        <h2 className="product-card__title">{product.name}</h2>

        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        {/* ================= OPTIONS ================= */}
        {product.options?.length ? (
          <ul className="product-card__options">
            {product.options.map((o) => (
              <li key={o.id} className="product-card__option">
                <div className="product-card__option-head">
                  <strong>{o.label}</strong>

                  <span className="product-card__option-price">
                    {o.price === 0 ? " Incluso" : `+${o.price}€/${o.type === "yearly" ? "anno" : "mese"}`}
                  </span>
                </div>

                {o.description && (
                  <p className="product-card__option-desc">
                    {o.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {/* ================= CTA ================= */}
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
