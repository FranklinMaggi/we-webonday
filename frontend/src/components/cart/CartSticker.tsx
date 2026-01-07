// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { cartStore } from "../../lib/cart/cartStore";
import type { CartItem } from "../../lib/cart/cartStore";
import { eur } from "../../utils/format";
import { uiBus } from "../../lib/ui/uiBus";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { apiFetch } from "../../lib/api";

// =========================
// API RESPONSE DTO
// =========================
type CreateConfigResponse = {
  ok: true;
  configurationId: string;
  reused?: boolean;
} | {
  ok: false;
  error: string;
};

export default function CartSticker() {
  const [items, setItems] = useState<CartItem[]>(
    cartStore.getState().items
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // =========================
  // SYNC STORE
  // =========================
  useEffect(
    () => cartStore.subscribe((s) => setItems(s.items)),
    []
  );

  // =========================
  // UI BUS
  // =========================
  useEffect(() => {
    const off = uiBus.on("cart:toggle", () =>
      setOpen((v) => !v)
    );
    return () => off();
  }, []);

  // =========================
  // TOTALI
  // =========================
  const startupTotal = useMemo(
    () => items.reduce((s, i) => s + (i.startupFee ?? 0), 0),
    [items]
  );

 

  
 

  const count = items.length;

  const removeItem = (index: number) =>
    cartStore.getState().removeItem(index);

  // =========================
  // CHECKOUT → CREATE CONFIG
  // =========================
  const checkout = async () => {
    if (!user) {
      navigate("/user/login?redirect=/user/configurator");
      return;
    }

    if (items.length === 0) return;

    const first = items[0];

    try {
      const result = await apiFetch<CreateConfigResponse>(
        "/api/configuration/from-cart",
        {
          method: "POST",
          body: JSON.stringify({
            businessName: "Nuova attività",
            solutionId: first.solutionId,
            productId: first.productId,
            optionIds: first.options.map((o) => o.id),
          }),
        }
      );

      if (!result || !result.ok) {
        console.error(
          "CONFIGURATION ERROR",
          result
        );
        return;
      }

      // 🔄 clear cart
      cartStore.getState().clear();

      // 🚀 go to configurator
      navigate(
        `/user/configurator/${result.configurationId}`
      );
    } catch (err) {
      console.error(
        "CONFIGURATION CREATE FAILED",
        err
      );
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className={`cart-sticker ${open ? "is-open" : ""}`}>
      <button
        className="cart-sticker__toggle"
        onClick={() => uiBus.emit("cart:toggle")}
      >
        <span className="cart-sticker__badge">
          {count}
        </span>
        <span className="cart-sticker__label">
          Carrello
        </span>
        <span className="cart-sticker__total">
          {eur.format(startupTotal)}
        </span>
      </button>

      <section className="cart-sticker__panel">
        {count === 0 ? (
          <p>Il carrello è vuoto.</p>
        ) : (
          <>
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.title}</strong>
                  <button
                    onClick={() => removeItem(idx)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="wd-btn wd-btn--primary"
              onClick={checkout}
            >
              Completa la configurazione
            </button>
          </>
        )}
      </section>
    </div>
  );
}
