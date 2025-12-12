import type { ProductDTO } from "../../lib/types";
import { cartStore } from "../../lib/cartStore";
    import { getOrCreateVisitorId } from "../../utils/cookieConsent";

interface Props {
  product: ProductDTO;
  selectedOptions: string[];
}

export default function CartPreview({ product, selectedOptions }: Props) {
  const selectedObjects = product.options.filter((o) =>
    selectedOptions.includes(o.id)
  );

  const optionsTotal = selectedObjects.reduce((sum, o) => sum + o.price, 0);

  const total = product.basePrice + optionsTotal;

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
  };
  
  return (
    <div className="cart-preview">
      <h3>Riepilogo</h3>

      <p>Prodotto: <strong>{product.title}</strong></p>

      <p>Base: € {product.basePrice.toFixed(2)}</p>

      {selectedObjects.length > 0 && (
        <ul className="cart-options">
          {selectedObjects.map((opt) => (
            <li key={opt.id}>
              {opt.label} — € {opt.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        Totale: <strong>€ {total.toFixed(2)}</strong>
      </div>

      <button className="cart-add-btn" onClick={addToCart}>
        Aggiungi al Carrello
      </button>
    </div>
  );
}
console.log("STORE IMPORTATO ->", cartStore);console.log("METODI STORE ->", cartStore.getState());