import { create } from "zustand";
import {type CartPointer } from "./cart.api";
/**
 * ======================================================
 * FE || Cart Store
 * ======================================================
 *
 * RUOLO:
 * - Stato locale FE
 * - Slot unico
 *
 * NOTE:
 * - NO pricing
 * - NO preview
 * - NO localStorage
 * ======================================================
 */
/**
 * NOTA ARCHITETTURALE:
 * - Questo store NON conosce identity né auth
 * - Il carrello è identity-scoped a livello BE
 * - Lo stato FE è solo una proiezione temporanea
 */


interface CartState {
  item?: CartPointer;

  setItem: (item: CartPointer) => void;
  clear: () => void;
}

export const cartStore = create<CartState>((set) => ({
  item: undefined,

  setItem: (item) => set({ item }),
  clear: () => set({ item: undefined }),
}));
