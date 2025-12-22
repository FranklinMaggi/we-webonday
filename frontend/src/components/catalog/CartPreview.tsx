// CartPreview.tsx
import type { ProductDTO } from "../../lib/types";
import { cartStore } from "../../lib/cartStore";
import { getOrCreateVisitorId } from "../../utils/visitor";
import { eur } from "../../utils/format";
import { useRef } from "react";

interface Props {
  product: ProductDTO;
  selectedOptions: string[];
}

export default function CartPreview({ product, selectedOptions }: Props) {
  const selectedObjects = product.options.filter((o) => selectedOptions.includes(o.id));
  const optionsTotal = selectedObjects.reduce((sum, o) => sum + o.price, 0);
  const total = product.basePrice + optionsTotal;
  const previewRef = useRef<HTMLElement>(null);
  const addToCart = () => {
    const visitorId = getOrCreateVisitorId();
  
    cartStore.getState().addItem({
      visitorId,
      productId: product.id,
      title: product.title,
      basePrice: product.basePrice,
      options: selectedObjects,
      total,
    });
  
    // feedback visivo "aggiunto al carrello"
    previewRef.current?.classList.add("is-added");
    setTimeout(() => {
      previewRef.current?.classList.remove("is-added");
    }, 450);
  };
  

  return (
    <aside ref={previewRef} className="cart-preview card">
      <div className="card__header">
        <h3 className="card__title">Riepilogo</h3>
      </div>

      <div className="cart-line">
        <span>Prodotto</span>
        <strong>{product.title}</strong>
      </div>

      <div className="cart-line">
        <span>Base</span>
        <strong>{eur.format(product.basePrice)}</strong>
      </div>

      {selectedObjects.length > 0 && (
        <ul className="cart-options">
          {selectedObjects.map((opt) => (
            <li key={opt.id} className="cart-option">
              <span className="cart-option__label">{opt.label}</span>
              <span className="cart-option__price">{eur.format(opt.price)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <span>Totale</span>
        <strong>{eur.format(total)}</strong>
      </div>

      <button className="btn btn-primary cart-add-btn" onClick={addToCart}>
        Aggiungi al Carrello
      </button>
    </aside>
  );
}
