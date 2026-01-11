// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================
//
// CART STICKER — FLOW ORCHESTRATOR (WEBONDAY)
//
// VERSIONE:
// - v4.0 (2026-01)
//
// ======================================================
// AI-SUPERCOMMENT
// ======================================================
//
// RUOLO:
// - Entry point del flusso di acquisto
// - Decide il percorso in BASE AL CARRELLO
//
// REGOLE CHIAVE:
// - Il carrello FE è source of truth pre-login
// - Il BE NON viene chiamato qui
// - Login SEMPRE richiesto prima di uscire
//
// DECISIONI:
// - requiresConfiguration === true  → /user/configurator
// - requiresConfiguration === false → /user/checkout
//
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartStore } from "../../../lib/cart/cart.store";
import type { CartItem } from "../../../lib/cart/cart.store";

import { useAuthStore } from "../../../lib/store/auth.store";
import { uiBus } from "../../../lib/ui/uiBus";
import { eur } from "../../../utils/format";

// ======================================================
// COMPONENT
// ======================================================

export default function CartSticker() {
  const [items, setItems] = useState<CartItem[]>(
    cartStore.getState().items
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();



  const { user } = useAuthStore();

  // =========================
  // SYNC STORE → STATE
  // =========================
  useEffect(() => {
    return cartStore.subscribe((s) => setItems(s.items));
  }, []);

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

  // ======================================================
  // FLOW DECISION (CORE)
  // ======================================================
  const checkout = () => {
    if (items.length === 0) return;

    // MVP: 1 item
    const first = items[0];
    const requiresConfiguration =
      first.requiresConfiguration === true;

    const targetPath = requiresConfiguration
      ? "/user/configurator/${configurationId}"
      : "/user/checkout";

    console.log("[CART FLOW]", {
      requiresConfiguration,
      targetPath,
      item: first,
    });

    // 🔐 LOGIN REQUIRED
    if (!user) {
      localStorage.setItem(
        "PENDING_CART",
        JSON.stringify({ items })
      );

      navigate(
        `/user/login?redirect=${encodeURIComponent(
          targetPath
        )}`
      );
      return;
    }

    // 🟢 USER LOGGATO → ROUTE DIRETTA
    navigate(targetPath);
  };

  // ======================================================
  // RENDER
  // ======================================================
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
                  <div className="item__head">
                    <strong>{item.title}</strong>
                    <button
                      className="item__remove"
                      onClick={() => removeItem(idx)}
                    >
                      ✕
                    </button>
                  </div>

                  {item.options.length > 0 && (
                    <ul className="item__options">
                      {item.options.map((opt) => (
                        <li key={opt.id} className="item__opt">
                          <span>{opt.label}</span>
                          <span className="item__price">
                            {eur.format(opt.price)}
                            {opt.type === "monthly" && " / mese"}
                          </span>
                        </li>
                      ))}
                    </ul>
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
                Continua
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
