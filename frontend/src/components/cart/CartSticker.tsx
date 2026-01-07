// ======================================================
// FE || components/cart/CartSticker.tsx
// ======================================================
// CART STICKER — RIEPILOGO TRASPARENTE
//
// RUOLO:
// - Visualizzare il contenuto del carrello FE
// - Mostrare i costi reali e separati
// - Fornire accesso al checkout
//
// NON FA:
// - NON modifica la struttura del carrello
// - NON calcola prezzi di business
// - NON comunica con il backend
//
// NOTE:
// - È un consumer passivo di cartStore
// - Il checkout normalizzerà i dati lato server
// ======================================================


import { useEffect, useMemo, useState } from "react";
import { cartStore } from "../../lib/cart/cartStore";
import type { CartItem } from "../../lib/cart/cartStore";
import { eur } from "../../utils/format";
import { uiBus } from "../../lib/ui/uiBus";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";


export default function CartSticker() {
const [items, setItems] = useState<CartItem[]>(cartStore.getState().items);
const [open, setOpen] = useState(false);
const navigate = useNavigate();
const { user } = useAuthStore();
// =========================
// SYNC STORE
// =========================
useEffect(() => cartStore.subscribe((state) => setItems(state.items)), []);

// =========================
// UI BUS — SINGLE SOURCE
// =========================
useEffect(() => {
    const offToggle = uiBus.on("cart:toggle", () => {
      setOpen((v) => !v);
    });
  
    return () => offToggle();
  }, []);
  



// =========================
// TOTALI (ESPLICITI)
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

const checkout = async () => {
  // 🔐 Guard FE: la configurazione richiede login
  if (!user) {
    navigate("/user/login?redirect=/user/configurator");
    return;
  }

  const items = cartStore.getState().items;

  if (items.length === 0) return;

  const first = items[0]; // MVP: 1 configuration = 1 solution

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/configuration/from-cart`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: "Nuova attività", // TEMP → verrà chiesto nello step
          solutionId: first.solutionId,
          productId: first.productId,
          optionIds: first.options.map((o) => o.id),
        }),
      }
    );

    const json = await res.json();

    if (!json.ok) {
      console.error("CONFIGURATION ERROR", json);
      return;
    }

    // 🧠 pulizia carrello (opzionale ma consigliata)
    cartStore.getState().clear();

    // 🚀 redirect configurator
    navigate(`/user/configurator/${json.configurationId}`);
  } catch (err) {
    console.error("CONFIGURATION CREATE FAILED", err);
  }
};


// =========================
// RENDER
// =========================
return (
<div className={`cart-sticker ${open ? "is-open" : ""}`} aria-live="polite">
<button
  className="cart-sticker__toggle"
  onClick={() => uiBus.emit("cart:toggle")}
  aria-label="Apri o chiudi carrello"
>
  <span
    className="cart-sticker__badge"
    aria-label={`${count} articoli in carrello`}
  >
    {count}
  </span>

  <span className="cart-sticker__label">Carrello</span>

  <span className="cart-sticker__total">
    {eur.format(startupTotal)}
  </span>
</button>


    <section
    id="cart-sticker-panel"
    className="cart-sticker__panel"
    role="dialog"
    aria-modal="false"
    aria-label="Riepilogo carrello"
    >
    {count === 0 ? (
        <div className="cart-sticker__empty">
        <p>Il carrello è vuoto.</p>
        </div>
    ) : (
        <>
        <ul className="cart-sticker__list">
            {items.map((item, idx) => (
            <li key={idx} className="cart-sticker__item">
                <div className="item__head">
                <h4 className="item__title">{item.title}</h4>
                <button
                    className="item__remove"
                    onClick={() => removeItem(idx)}
                    aria-label={`Rimuovi ${item.title}`}
                    title="Rimuovi"
                >
                    ✕
                </button>
                </div>

                {/* STARTUP */}
                {item.startupFee > 0 && (
                <div className="item__line">
                    <span>Avvio progetto</span>
                    <strong>{eur.format(item.startupFee)}</strong>
                </div>
                )}

                {/* ANNUALE */}
                {item.yearlyFee > 0 && (
                <div className="item__line">
                    <span>Costi annuali</span>
                    <strong>{eur.format(item.yearlyFee)} / anno</strong>
                </div>
                )}

                {/* MENSILE */}
                {item.monthlyFee > 0 && (
                <div className="item__line">
                    <span>Costi mensili</span>
                    <strong>{eur.format(item.monthlyFee)} / mese</strong>
                </div>
                )}

                {/* OPZIONI */}
                {item.options.length > 0 && (
                <details className="item__options">
                    <summary>Opzioni selezionate</summary>
                    <ul>
                    {item.options.map((opt) => (
                        <li key={opt.id} className="item__opt">
                        <span className="opt__label">{opt.label}</span>
                        <span className="opt__price">
                            {eur.format(opt.price)}
                        </span>
                        </li>
                    ))}
                    </ul>
                </details>
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
                <strong>{eur.format(yearlyTotal)} / anno</strong>
                </div>
            )}

            {monthlyTotal > 0 && (
                <div>
                <span>Mensile</span>
                <strong>{eur.format(monthlyTotal)} / mese</strong>
                </div>
            )}
            </div>

            <button className="wd-btn wd-btn--primary wd-btn--block" onClick={checkout}>
            Completa la configurazione 
            </button>
        </div>
        </>
    )}
    </section>
</div>
);
}
