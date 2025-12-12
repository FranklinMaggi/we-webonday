import { useEffect, useState } from "react";
import { cartStore } from "../../lib/cartStore";
import type { CartItem } from "../../lib/cartStore";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(cartStore.getState().items);

  useEffect(() => {
    return cartStore.subscribe((state) => {
      setItems(state.items);
    });
  }, []);

  const removeItem = (index: number) => {
    cartStore.getState().removeItem(index);
  };
  

  const total = items.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="cart-page">
      <h1>Il tuo carrello</h1>

      {items.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item, index) => (
              <li key={index} className="cart-item">
                <h3>{item.title}</h3>
                <p>Base: € {item.basePrice.toFixed(2)}</p>

                {item.options.length > 0 && (
                  <ul>
                    {item.options.map((opt) => (
                      <li key={opt.id}>
                        {opt.label} — € {opt.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}

                <strong>Totale: € {item.total.toFixed(2)}</strong>

                <button onClick={() => removeItem(index)}>Rimuovi</button>
              </li>
            ))}
          </ul>

          <hr />

          <div className="cart-summary">
            <h2>Totale Carrello: € {total.toFixed(2)}</h2>

            <button
              className="checkout-btn"
              onClick={() => (window.location.href = "/user/checkout")}
            >
              Procedi al Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
