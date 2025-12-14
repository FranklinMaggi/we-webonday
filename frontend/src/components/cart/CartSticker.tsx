import { useEffect, useMemo, useState } from "react";
import { cartStore } from "../../lib/cartStore";
import type { CartItem } from "../../lib/cartStore";
import { eur } from "../../utils/format";
import "./cart-sticker.css";
import { uiBus } from "../../lib/uiBus";
export default function CartSticker() {
const [items, setItems] = useState<CartItem[]>(cartStore.getState().items);
const [open, setOpen] = useState(false);

// Aggiorna lista al variare dello store
useEffect(() => cartStore.subscribe((state) => setItems(state.items)), []);

// Ascolta eventi globali per aprire/chiudere da navbar o altrove
useEffect(() => {
const offOpen = uiBus.on("cart:open", () => setOpen(true));
const offClose = uiBus.on("cart:close", () => setOpen(false));
const offToggle = uiBus.on("cart:toggle", () => setOpen((v) => !v));
return () => { offOpen(); offClose(); offToggle(); };
}, []);

const total = useMemo(() => items.reduce((s, i) => s + i.total, 0), [items]);
const count = items.length;

const removeItem = (index: number) => cartStore.getState().removeItem(index);
const checkout = () => { window.location.href = "/user/checkout"; };

return (
<div className={`cart-sticker ${open ? "is-open" : ""}`} aria-live="polite">
    <button
    className="cart-sticker__toggle"
    onClick={() => setOpen((v) => !v)}
    aria-expanded={open}
    aria-controls="mini-cart-panel"
    title={open ? "Chiudi carrello" : "Apri carrello"}
    >
    <span className="cart-sticker__badge" aria-label={`${count} articoli in carrello`}>
        {count}
    </span>
    <span className="cart-sticker__label">Carrello</span>
    <span className="cart-sticker__total">{eur.format(total)}</span>
    <svg className="cart-sticker__chev" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
    </button>

    <section
    id="mini-cart-panel"
    className="cart-sticker__panel"
    role="dialog"
    aria-modal="false"
    aria-label="Riepilogo carrello"
    >
    {count === 0 ? (
        <div className="cart-sticker__empty"><p>Il carrello è vuoto.</p></div>
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
                >✕</button>
                </div>

                <div className="item__line">
                <span>Base</span><strong>{eur.format(item.basePrice)}</strong>
                </div>

                {item.options.length > 0 && (
                <details className="item__options">
                    <summary>Opzioni incluse</summary>
                    <ul>
                    {item.options.map((opt) => (
                        <li key={opt.id} className="item__opt">
                        <span className="opt__label">{opt.label}</span>
                        <span className="opt__price">{eur.format(opt.price)}</span>
                        </li>
                    ))}
                    </ul>
                </details>
                )}

                <div className="item__total">
                <span>Totale voce</span><strong>{eur.format(item.total)}</strong>
                </div>
            </li>
            ))}
        </ul>

        <div className="cart-sticker__footer">
            <div className="cart-sticker__grand">
            <span>Totale</span><strong>{eur.format(total)}</strong>
            </div>
            <button className="btn btn-primary" onClick={checkout}>
            Procedi al Checkout
            </button>
        </div>
        </>
    )}
    </section>
</div>
);
}
