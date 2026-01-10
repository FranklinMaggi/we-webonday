// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================
//
// CART STICKER — CHECKOUT ENTRY POINT (WEBONDAY)
//
// VERSIONE:
// - v3.0 (2026-01)
//
// ======================================================
// AI-SUPERCOMMENT (v3)
// ======================================================
//
// RUOLO:
// - Entry point persistente del checkout FE
// - Riepilogo carrello sempre accessibile
// - Avvio flusso di configurazione progetto
//
// COSA MOSTRA:
// - Prodotti selezionati (MVP: 1 solo)
// - Opzioni aggiuntive (monthly / yearly)
// - Costi separati e trasparenti:
//   • avvio (one-time)
//   • annuale
//   • mensile
//
// FLUSSO:
// 1. Visitor aggiunge prodotto dal catalogo
// 2. CartSticker mostra riepilogo persistente
// 3. Click "Completa configurazione":
//    - SE visitor:
//        • salva carrello in localStorage (PENDING_CART)
//        • redirect a /user/login
//    - SE user autenticato:
//        • POST /api/configuration/from-cart
//        • backend crea (o riusa) configuration
//        • redirect a /user/configurator
//
// SOURCE OF TRUTH:
// - Prezzi → backend (via ProductVM)
// - Carrello → cartStore (FE, staging)
// - Configuration → backend
//
// INVARIANTI:
// - MVP: UNA configurazione alla volta (items[0])
// - Nessun calcolo prezzi complessi qui
// - Le option NON vengono ricalcolate, solo mostrate
// - optionIds inviati al backend così come selezionati
//
// NON FA:
// - NON gestisce pagamenti
// - NON crea ordini
// - NON valida business logic
// - NON persiste carrello su backend
//
// NOTE ARCHITETTURALI:
// - cartStore è volutamente semplice (sync, FE-only)
// - apiFetch è l’unico contatto HTTP
// - Questo componente è UI + orchestrazione, NON dominio
//
// BACKEND ENDPOINT:
// - POST /api/configuration/from-cart
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartStore } from "../../lib/cart/cart.store";
import type { CartItem } from "../../lib/cart/cart.store";

import { useAuthStore } from "../../lib/store/auth.store";
import { apiFetch } from "../../lib/api";
import { uiBus } from "../../lib/ui/uiBus";
import { eur } from "../../utils/format";

// ======================================================
// API RESPONSE DTO
// ======================================================

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
  // STORE SYNC
  // =========================

  useEffect(
    () => cartStore.subscribe((s) => setItems(s.items)),
    []
  );

  // =========================
  // UI BUS (GLOBAL TOGGLE)
  // =========================

  useEffect(() => {
    const off = uiBus.on("cart:toggle", () =>
      setOpen((v) => !v)
    );
    return () => off();
  }, []);

  // =========================
  // TOTALI (DERIVATI)
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
    if (items.length === 0) return;

    // 🔐 VISITOR → LOGIN
    if (!user) {
      localStorage.setItem(
        "PENDING_CART",
        JSON.stringify({ items })
      );
      navigate("/user/login?redirect=/user/configurator");
      return;
    }

    // MVP: una sola configurazione
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
        console.error("CONFIGURATION CREATE ERROR", result);
        return;
      }

      // redirect configurator (id gestito dal backend)
      navigate("/user/configurator");
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
                Completa la configurazione
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
