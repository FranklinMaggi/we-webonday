/**
 * AI-SUPERCOMMENT
 * COMPONENT: NavCartButton
 *
 * RUOLO:
 * - UI control persistente in navbar
 * - toggle del mini-cart tramite uiBus
 *
 * NOTE ARCHITETTURALI:
 * - NON è un link
 * - NON conosce lo stato open/closed
 * - emette solo intenti (cart:toggle)
 */

import { uiBus } from "../../lib/ui/uiBus";
import { cartStore } from "../../lib/cart/cart.store";
import { useEffect, useState } from "react";

export default function NavCartButton() {
  const [count, setCount] = useState(cartStore.getState().items.length);

  useEffect(() => {
    return cartStore.subscribe((s) => setCount(s.items.length));
  }, []);

  return (
    <button
      type="button"
      className="navbar-cart-toggle"
      onClick={() => uiBus.emit("cart:toggle")}
      aria-label="Apri o chiudi carrello"
      title="Carrello"
    >
      <span className="navbar-cart-label">Carrello</span>
      <span className="navbar-cart-badge">{count}</span>
    </button>
  );
}
