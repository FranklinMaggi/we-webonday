import { create } from "zustand";
import type { ProductOptionDTO } from "../dto/productDTO";

// ======================================================
// CART ITEM — MODELLO CANONICO
// ======================================================

export interface CartItem {
  visitorId: string;
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
  loadFromStorage: () => void;
}

export const cartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    const updated = [...get().items, item];
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  removeItem: (index: number) => {
    const updated = get().items.filter((_, i) => i !== index);
    set({ items: updated });
    localStorage.setItem("webonday_cart", JSON.stringify(updated));
  },

  clear: () => {
    set({ items: [] });
    localStorage.removeItem("webonday_cart");
  },

  loadFromStorage: () => {
    const saved = localStorage.getItem("webonday_cart");
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        set({ items: parsed });
      } catch {
        console.error("Errore nel parsing del carrello salvato.");
      }
    }
  },
}));

// Carica automaticamente il carrello alla prima importazione
cartStore.getState().loadFromStorage();
