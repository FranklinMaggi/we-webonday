// FE || components/catalog/CartPreview.tsx
// ======================================================
// CART PREVIEW — PRICING TRASPARENTE (WEBONDAY)
// ======================================================
//
// RESPONSABILITÀ:
// - Mostrare costi REALI e separati
// - Educare il cliente prima del checkout
//
// NON FA:
// - sconti
// - moltiplicatori
// - magia sui prezzi
//
// ======================================================

import type { ProductDTO, ProductOptionDTO } from "../../dto/productDTO";
import { cartStore } from "../../lib/cartStore";
import { getOrCreateVisitorId } from "../../utils/visitor";
import { eur } from "../../utils/format";
import { useRef } from "react";

interface Props {
  product: ProductDTO;
  selectedOptions: string[];
}

export default function CartPreview({ product, selectedOptions }: Props) {
  const previewRef = useRef<HTMLElement>(null);

  // =========================
  // OPTIONS SELEZIONATE
  // =========================
 const selectedObjects: ProductOptionDTO[] = product.options.filter(
  (o): o is ProductOptionDTO => selectedOptions.includes(o.id)
);


  // =========================
  // CALCOLI PREZZI
  // =========================
  const startupFee = product.startupFee ?? 0;

  const yearlyBase = product.pricing?.yearly ?? 0;
  const monthlyBase = product.pricing?.monthly ?? 0;

  const oneTimeOptions = selectedObjects
    .filter((o) => o.recurringType === "one_time")
    .reduce((sum, o) => sum + o.price, 0);

  const yearlyOptions = selectedObjects
    .filter((o) => o.recurringType === "yearly")
    .reduce((sum, o) => sum + o.price, 0);

  const monthlyOptions = selectedObjects
    .filter((o) => o.recurringType === "monthly")
    .reduce((sum, o) => sum + o.price, 0);

  const totalStartup = startupFee + oneTimeOptions;
  const totalYearly = yearlyBase + yearlyOptions;
  const totalMonthly = monthlyBase + monthlyOptions;

  // =========================
  // ADD TO CART (STRUTTURATO)
  // =========================
  const addToCart = () => {
    const visitorId = getOrCreateVisitorId();

    cartStore.getState().addItem({
      visitorId,
      productId: product.id,
      title: product.title,

      startupFee: totalStartup,
      yearlyFee: totalYearly,
      monthlyFee: totalMonthly,

      options: selectedObjects,
    });

    // feedback visivo
    previewRef.current?.classList.add("is-added");
    setTimeout(() => {
      previewRef.current?.classList.remove("is-added");
    }, 450);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <aside ref={previewRef} className="cart-preview card">
      <div className="card__header">
        <h3 className="card__title">Riepilogo costi</h3>
      </div>

      <div className="cart-line">
        <span>Prodotto</span>
        <strong>{product.title}</strong>
      </div>

      {/* AVVIO */}
      <div className="cart-line">
        <span>Avvio progetto (una tantum)</span>
        <strong>{eur.format(totalStartup)}</strong>
      </div>

      {/* ANNUALE */}
      {totalYearly > 0 && (
        <div className="cart-line">
          <span>Costi annuali</span>
          <strong>{eur.format(totalYearly)} / anno</strong>
        </div>
      )}

      {/* MENSILE */}
      {totalMonthly > 0 && (
        <div className="cart-line">
          <span>Costi mensili</span>
          <strong>{eur.format(totalMonthly)} / mese</strong>
        </div>
      )}

      {/* NOTE */}
      <p className="cart-note">
        Il costo di avvio è separato dai canoni ricorrenti.
        <br />
        Gli aggiornamenti operativi sono a carico del cliente.
      </p>

      <button className="btn btn-primary cart-add-btn" onClick={addToCart}>
        Aggiungi al Carrello
      </button>
    </aside>
  );
}
