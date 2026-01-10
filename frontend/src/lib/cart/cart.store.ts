// ======================================================
// FE || lib/cart/cart.store.ts
// ======================================================
// CART STORE — STATO LOCALE FE
//
// RUOLO:
// - Mantenere lo stato del carrello lato frontend
// - Persistenza locale (localStorage)
//
// CONTIENE:
// - Item selezionati dall’utente
// - Pricing già calcolato (startup / annuale / mensile)
//
// NON FA:
// - NON gestisce identità utente (visitor / user)
// - NON fa merge post-login
// - NON valida prezzi lato business
//
// NOTE ARCHITETTURALI:
// - Questo store rappresenta uno STAGING CART FE
// - Il modello verrà normalizzato lato backend in fase di checkout
// ======================================================
// ======================================================
// FE || lib/cart/cart.store.ts
// ======================================================

import { create } from "zustand";
import type { CartItem } from "../storeModels/CartItem.store-model";
export type { CartItem } from "../storeModels/CartItem.store-model";

interface CartState {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;

  replace: (items: CartItem[]) => void;
  loadFromStorage: () => void;
}

export const cartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const updated = [...get().items, item];
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  removeItem: (index) => {
    const updated = get().items.filter((_, i) => i !== index);
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  clear: () => {
    set({ items: [] });
    localStorage.removeItem("webonday_cart");
  },

  replace: (items) => {
    set({ items });
    localStorage.setItem("webonday_cart", JSON.stringify(items));
  },

  loadFromStorage: () => {
    const saved = localStorage.getItem("webonday_cart");
    if (!saved) return;

    try {
      const parsed: CartItem[] = JSON.parse(saved);
      set({ items: parsed });
    } catch {
      console.error("[CART] Errore parsing webonday_cart");
    }
  },
}));

cartStore.getState().loadFromStorage();
