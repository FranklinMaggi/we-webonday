// ======================================================
// FE || pages/user/checkout/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CHECKOUT ENTRY
//
// RUOLO:
// - Entry point checkout autenticato
//
// RESPONSABILITÀ:
// - Guard auth
// - Orchestrazione checkout
//
// NOTA CRITICA:
// - NESSUNA policy qui
// ======================================================
// ======================================================
// FE || pages/user/checkout/index.tsx
// ======================================================
//
// CHECKOUT ENTRY — AUTHENTICATED
// ======================================================

import { useEffect } from "react";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../store/auth.store";
import { cartStore } from "../../../lib/cart/cartStore";

export default function CheckoutPage() {
  const { user, ready } = useAuthStore();

  // 🧠 FE source of truth
  const cart = cartStore((s) => s.items);

  // 🔑 email DERIVATA da sessione
  const email = user?.email ?? "";

  const checkout = useCheckout(email);

  /* =========================
     AUTH GUARD
  ========================= */
  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/checkout";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;

  /* =========================
     RENDER
  ========================= */
  return (
    <CartReview
      cart={cart}
      submitOrder={checkout.submitCheckout}
    
    
    />
  );
}
