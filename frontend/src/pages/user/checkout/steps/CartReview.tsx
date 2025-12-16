import type { CheckoutStep } from "../types";
import type { CartItem } from "../../../../lib/cartStore";
import { eur } from "../../../../utils/format";

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
    <section style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Riepilogo ordine</h2>

      <ul style={{ marginTop: 16 }}>
        {cart.map((item, idx) => (
          <li
            key={`${item.productId}-${idx}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px dashed #ddd",
            }}
          >
            <span>{item.title}</span>
            <strong>{eur.format(item.total)}</strong>
          </li>
        ))}
      </ul>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          fontSize: 18,
        }}
      >
        <span>Totale</span>
        <strong>{eur.format(total)}</strong>
      </div>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        Procedendo accetterai i Termini e la Privacy Policy.
      </p>

      <button
        onClick={() => next("policy")}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "14px",
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 10,
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Continua al pagamento
      </button>
    </section>
  );
}
