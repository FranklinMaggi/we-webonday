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

import { create } from "zustand";
import type { ProductOptionDTO } from "../dto/productDTO";

// ======================================================
// CART ITEM — MODELLO CANONICO
// ======================================================

export interface CartItem {
  /** 🔑 CONTEXTO MARKETING / CONFIG */
  solutionId: string;

  productId: string;
  title: string;

  // pricing separato e dichiarativo
  startupFee: number;
  yearlyFee: number;
  monthlyFee: number;

  options: ProductOptionDTO[];
}

interface CartState {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;

  /** 🔁 Restore controllato post-login */
  replace: (items: CartItem[]) => void;

  /** 🔄 Restore visitor (localStorage) */
  loadFromStorage: () => void;
}

export const cartStore = create<CartState>((set, get) => ({
  items: [],

  // ======================================================
  // ADD ITEM
  // ======================================================
  addItem: (item: CartItem) => {
    const updated = [...get().items, item];
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  // ======================================================
  // REMOVE ITEM
  // ======================================================
  removeItem: (index: number) => {
    const updated = get().items.filter((_, i) => i !== index);
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  // ======================================================
  // CLEAR CART
  // ======================================================
  clear: () => {
    set({ items: [] });
    localStorage.removeItem("webonday_cart");
  },

  // ======================================================
  // 🔁 REPLACE (POST-LOGIN)
  // ======================================================
  replace: (items: CartItem[]) => {
    set({ items });
    localStorage.setItem("webonday_cart", JSON.stringify(items));
  },

  // ======================================================
  // 🔄 LOAD VISITOR CART
  // ======================================================
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

// ======================================================
// AUTO-BOOTSTRAP (VISITOR ONLY)
// ======================================================
cartStore.getState().loadFromStorage();
