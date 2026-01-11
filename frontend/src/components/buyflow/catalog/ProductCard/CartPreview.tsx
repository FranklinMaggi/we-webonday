// ======================================================
// FE || components/catalog/CartPreview.tsx
// ======================================================
//
// CART PREVIEW — PRICING TRASPARENTE (WEBONDAY)
//
// VERSIONE:
// - v3.0 (2026-01)
//
// ======================================================
// AI-SUPERCOMMENT (v3)
// ======================================================
//
// RUOLO:
// - Riepilogo costi di un prodotto PUBLIC
// - Preparazione dati per inserimento nel carrello FE
//
// RESPONSABILITÀ:
// - Mostrare pricing separato e comprensibile
//   • startup (una tantum)
//   • annuale (prodotto)
//   • mensile (prodotto + option)
// - Educare l’utente PRIMA del checkout
//
// NON FA:
// - NON applica sconti
// - NON moltiplica canoni
// - NON conosce dominio admin
// - NON valida regole business
//
// INVARIANTI DI DOMINIO (PUBLIC):
// - Le option sono SEMPRE:
//   • recurring
//   • monthly
// - Il prodotto può avere:
//   • startupFee (una tantum)
//   • pricing.yearly
//   • pricing.monthly
//
// OUTPUT:
// - Inserisce nel carrello un CartItem
// - Il backend ricalcolerà e validerà tutto
//
// NOTE ARCHITETTURALI:
// - Questo componente NON è source of truth
// - Il carrello è uno staging FE
// ======================================================

import { useRef } from "react";

import type {
  ProductVM,
  ProductOptionVM,
} from "../../../../lib/viewModels/product/Product.view-model";

import type {
  CartOption,
} from "../../../../lib/storeModels/CartItem.store-model";

import { cartStore } from "../../../../lib/cart/cart.store";
import { eur } from "../../../../utils/format";

// ======================================================
// PROPS
// ======================================================

interface Props {
  solutionId: string;
  product: ProductVM;
  selectedOptions: string[]; // optionId[]
}

// ======================================================
// NORMALIZER LOCALE — OPTION → CART
// ======================================================
// (temporaneo, verrà estratto in normalizer dedicato)

function toCartOption(o: ProductOptionVM): CartOption {
  return {
    id: o.id,
    label: o.label,
    price: o.price,
    type: "monthly", // dominio PUBLIC
  };
}

// ======================================================
// COMPONENT
// ======================================================

export default function CartPreview({
  solutionId,
  product,
  selectedOptions,
}: Props) {
  const previewRef = useRef<HTMLElement>(null);

  // =========================
  // OPTION SELEZIONATE
  // =========================

  const selectedOptionObjects = product.options.filter(
    (o) => selectedOptions.includes(o.id)
  );

  // =========================
  // CALCOLO PREZZI (PUBLIC)
  // =========================

  // una tantum (solo prodotto)
  const startupFee = product.startupFee ?? 0;

  // annuale (solo prodotto)
  const yearlyFee = product.pricing.yearly ?? 0;

  // mensile = prodotto + option
  const monthlyOptionsTotal = selectedOptionObjects.reduce(
    (sum, o) => sum + o.price,
    0
  );

  const monthlyFee =
    (product.pricing.monthly ?? 0) + monthlyOptionsTotal;

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = () => {
    cartStore.getState().addItem({
      solutionId,
      productId: product.id,
      title: product.name,

      startupFee,
      yearlyFee,
      monthlyFee,
        requiresConfiguration:true ,
      options: selectedOptionObjects.map(toCartOption),
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
    <aside
      ref={previewRef}
      className="cart-preview"
      aria-live="polite"
    >
      <div className="card__header">
        <h3 className="card__title">Riepilogo costi</h3>
      </div>

      <div className="cart-line">
        <span>Prodotto</span>
        <strong>{product.name}</strong>
      </div>

      {/* AVVIO */}
      <div className="cart-line">
        <span>Avvio progetto (una tantum)</span>
        <strong>{eur.format(startupFee)}</strong>
      </div>

      {/* ANNUALE */}
      {yearlyFee > 0 && (
        <div className="cart-line">
          <span>Costi annuali</span>
          <strong>{eur.format(yearlyFee)} / anno</strong>
        </div>
      )}

      {/* MENSILE */}
      {monthlyFee > 0 && (
        <div className="cart-line">
          <span>Costi mensili</span>
          <strong>{eur.format(monthlyFee)} / mese</strong>
        </div>
      )}

      {/* NOTE */}
      <p className="cart-note">
        Il costo di avvio è separato dai canoni ricorrenti.
        <br />
        Tutti i prezzi saranno confermati in fase di checkout.
      </p>

      <button
        className="wd-btn wd-btn--primary cart-add-btn"
        onClick={addToCart}
      >
        Aggiungi al Carrello
      </button>
      
    </aside>
  );
}
