// ======================================================
// FE || CartSticker — FLOW ORCHESTRATOR (v5)
// ======================================================
//
// RUOLO:
// - Entry point del flusso di acquisto
// - NON mostra pricing
// - NON gestisce items
//
// INVARIANTI:
// - Slot unico
// - Dopo createConfiguration → cart irrilevante
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { cartStore } from "../../../lib/cart/cart.store";
import { useAuthStore } from "../../../lib/store/auth.store";
import { uiBus } from "../../../lib/ui/uiBus";

export default function CartSticker() {
  const [hasCart, setHasCart] = useState(
    Boolean(cartStore.getState().item)
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  /* ======================================================
     SYNC STORE → LOCAL STATE
  ====================================================== */
  useEffect(() => {
    return cartStore.subscribe((s) =>
      setHasCart(Boolean(s.item))
    );
  }, []);

  /* ======================================================
     UI BUS
  ====================================================== */
  useEffect(() => {
    const off = uiBus.on("cart:toggle", () =>
      setOpen((v) => !v)
    );
    return () => off();
  }, []);

  /* ======================================================
     FLOW
  ====================================================== */
  const proceed = () => {
    if (!hasCart) return;

    // 🚫 guard: già nel configurator
    if (location.pathname.startsWith("/user/configurator")) {
      console.warn("[CART] already in configurator");
      return;
    }

    if (!user) {
      navigate("/user/login?redirect=/user");
      return;
    }

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
        <span className="cart-sticker__badge">
          {hasCart ? 1 : 0}
        </span>
        <span className="cart-sticker__label">
          Progetto
        </span>
      </button>

      {open && (
        <section className="cart-sticker__panel">
          {!hasCart ? (
            <p>Nessun progetto selezionato.</p>
          ) : (
            <>
              <p>Hai un progetto in corso.</p>

              <button
                className="wd-btn wd-btn--primary wd-btn--block"
                onClick={proceed}
              >
                Continua
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
