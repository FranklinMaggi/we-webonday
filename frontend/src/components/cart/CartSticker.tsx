// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { cartStore } from "../../lib/cart/cart.store";
import type { CartItem } from "../../lib/cart/cart.store";
import { eur } from "../../utils/format";
import { uiBus } from "../../lib/ui/uiBus";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { apiFetch } from "../../lib/api";

// =========================
// API RESPONSE DTO
// =========================
type CreateConfigResponse =
  | {
      ok: true;
      configurationId: string;
      reused?: boolean;
    }
  | {
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

  const yearlyTotal = useMemo(
    () => items.reduce((s, i) => s + (i.yearlyFee ?? 0), 0),
    [items]
  );

  const monthlyTotal = useMemo(
    () => items.reduce((s, i) => s + (i.monthlyFee ?? 0), 0),
    [items]
  );

  const count = items.length;

  const removeItem = (index: number) =>
    cartStore.getState().removeItem(index);

  // =========================
  // CHECKOUT → CREATE CONFIG
  // =========================
  const checkout = async () => {
    // 🔐 auth guard
    if (!user) {
      localStorage.setItem(
        "PENDING_CART",
        JSON.stringify({ items })
      );
      navigate("/user/login?redirect=/user/configurator");
      return;
    }

    if (items.length === 0) return;

    const first = items[0]; // MVP: una config per volta

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
        console.error("CONFIGURATION ERROR", result);
        return;
      }

      // 🧠 clear cart
      cartStore.getState().clear();

      // 🚀 redirect configurator
      navigate(`/user/configurator/${result.configurationId}`);
    } catch (err) {
      console.error("CONFIGURATION CREATE FAILED", err);
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
        <span className="cart-sticker__badge">{count}</span>
        <span className="cart-sticker__label">Carrello</span>
        <span className="cart-sticker__total">
          {eur.format(startupTotal)}
        </span>
      </button>

      <section className="cart-sticker__panel">
        {count === 0 ? (
          <p>Il carrello è vuoto.</p>
        ) : (
          <>
            <ul className="cart-sticker__list">
              {items.map((item, idx) => (
                <li key={idx} className="cart-sticker__item">
                  <strong>{item.title}</strong>
                  <button onClick={() => removeItem(idx)}>✕</button>
                </li>
              ))}
            </ul>
            <ul className="cart-sticker__options">
  {item.options?.map((o) => (
    <li key={o.id} className="cart-sticker__option">
      + {o.label}
      {o.type !== "one_time" && (
        <span className="cart-sticker__recurring">
          ({o.type})
        </span>
      )}
    </li>
  ))}
</ul>
            <div className="cart-sticker__footer">
              <div className="cart-sticker__grand">
                <div>
                  <span>Avvio</span>
                  <strong>{eur.format(startupTotal)}</strong>
                </div>

                {yearlyTotal > 0 && (
                  <div>
                    <span>Annuale</span>
                    <strong>
                      {eur.format(yearlyTotal)} / anno
                    </strong>
                  </div>
                )}

                {monthlyTotal > 0 && (
                  <div>
                    <span>Mensile</span>
                    <strong>
                      {eur.format(monthlyTotal)} / mese
                    </strong>
                  </div>
                )}
              </div>

              <button
                className="wd-btn wd-btn--primary wd-btn--block"
                onClick={checkout}
              >
                Completa la configurazione
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
