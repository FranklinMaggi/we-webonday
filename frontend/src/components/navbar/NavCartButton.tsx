import { uiBus } from "../../lib/uiBus";
import { cartStore } from "../../lib/cartStore";
import { useEffect, useState } from "react";

export default function NavCartButton() {
  const [count, setCount] = useState(cartStore.getState().items.length);

  useEffect(() => cartStore.subscribe((s) => setCount(s.items.length)), []);

  return (
    <button
      type="button"
      onClick={() => uiBus.emit("cart:toggle")}
      className="nav-cart-btn"
      title="Apri carrello"
    >
      <span>Carrello</span>
      <span className="nav-cart-badge">{count}</span>
    </button>
  );
}
