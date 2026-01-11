// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================
//
// CART STICKER — FLOW ORCHESTRATOR (WEBONDAY)
//
// VERSIONE:
// - v4.1 (2026-01) — LOOP SAFE
//
// ======================================================
// AI-SUPERCOMMENT
// ======================================================
//
// RUOLO:
// - Entry point del flusso di acquisto PRE-LOGIN
// - Orchestratore FE → BE handoff
//
// RESPONSABILITÀ:
// - Gestisce il carrello come SOURCE OF TRUTH solo PRE-login
// - Decide il flusso:
//   • configurator (requiresConfiguration === true)
//   • checkout diretto
//
// INVARIANTI (NON NEGOZIABILI):
// 1. Il carrello NON crea configuration se siamo già nel configurator
// 2. Dopo login NON si entra mai in /user/configurator senza ID
// 3. La configuration viene creata UNA SOLA VOLTA
// 4. Dopo createConfiguration → il cart NON deve più interferire
//
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  const { user } = useAuthStore();

  /* ======================================================
     SYNC STORE → LOCAL STATE
     (il carrello è uno staging FE)
  ====================================================== */
  useEffect(() => {
    return cartStore.subscribe((s) => setItems(s.items));
  }, []);

  /* ======================================================
     UI BUS (toggle pannello)
  ====================================================== */
  useEffect(() => {
    const off = uiBus.on("cart:toggle", () =>
      setOpen((v) => !v)
    );
    return () => off();
  }, []);

  /* ======================================================
     TOTALI (READ-ONLY)
  ====================================================== */
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

  /* ======================================================
     FLOW DECISION (CORE LOGIC)
  ====================================================== */
  const checkout = async () => {
    // 🚫 HARD GUARD
    // Se siamo già nel configurator, il carrello NON deve fare nulla
    if (location.pathname.startsWith("/user/configurator")) {
      console.warn(
        "[CART] checkout blocked — already in configurator"
      );
      return;
    }

    if (items.length === 0) return;

    const first = items[0];
    const requiresConfiguration =
      first.requiresConfiguration === true;

    /* ======================================================
       AUTH GUARD
       - Il redirect NON punta mai al configurator
       - Dopo login si torna a /user (neutro)
    ====================================================== */
    if (!user) {
      localStorage.setItem(
        "PENDING_CART",
        JSON.stringify({ items })
      );

      navigate("/user/login?redirect=/user");
      return;
    }

    /* ======================================================
       STEP 1 — CREATE CONFIGURATION (UNA SOLA VOLTA)
    ====================================================== */
    if (requiresConfiguration) {
      try {
        const res = await fetch(
          "/api/configuration/from-cart",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // TEMP: businessName statico
              // (verrà chiesto nello StepBusiness)
              businessName: "nuovo-progetto",

              solutionId: first.solutionId,
              productId: first.productId,
              optionIds: first.options.map((o) => o.id),
            }),
          }
        );

        const json = await res.json();

        if (!json?.ok || !json.configurationId) {
          console.error(
            "[CART] createConfiguration failed",
            json
          );
          return;
        }

        // 🔒 HANDOFF COMPLETO → il carrello non serve più
      

        navigate(
          `/user/configurator/${json.configurationId}`
        );
      } catch (err) {
        console.error("[CART] error", err);
      }
      cartStore.getState().clear();
      return;
    }

    /* ======================================================
       NO CONFIGURATION → CHECKOUT DIRETTO
    ====================================================== */
    navigate("/user/checkout");
  };

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className={`cart-sticker ${open ? "is-open" : ""}`}>
      <button
        className="cart-sticker__toggle"
        onClick={() => uiBus.emit("cart:toggle")}
      >
        <span className="cart-sticker__badge">{count}</span>
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
            <ul className="cart-sticker__list">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="cart-sticker__item"
                >
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
                        <li
                          key={opt.id}
                          className="item__opt"
                        >
                          <span>{opt.label}</span>
                          <span className="item__price">
                            {eur.format(opt.price)}
                            {opt.type === "monthly" &&
                              " / mese"}
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
                  <strong>
                    {eur.format(startupTotal)}
                  </strong>
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
