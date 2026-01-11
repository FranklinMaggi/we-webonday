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
