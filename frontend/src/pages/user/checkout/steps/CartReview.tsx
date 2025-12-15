import type { CheckoutStep } from "../types";
import type { CartItem } from "../../../../lib/cartStore";

interface Props {
  cart: CartItem[];
  next: (step: CheckoutStep) => void;
}

export default function CartReview({ cart, next }: Props) {
  if (cart.length === 0) {
    return <p>Il carrello è vuoto</p>;
  }

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <section>
      <h2>Riepilogo carrello</h2>

      <ul>
        {cart.map((item) => (
          <li key={item.productId}>
            {item.title} — €{item.total.toFixed(2)}
          </li>
        ))}
      </ul>

      <p>
        <strong>Totale:</strong> €{total.toFixed(2)}
      </p>

      <button onClick={() => next("user")}>Continua</button>
    </section>
  );
}
