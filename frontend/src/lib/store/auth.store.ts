// ======================================================
// FE || store/auth.store.ts
// ======================================================
//
// AUTH STORE — SOURCE OF TRUTH FE
// ======================================================

import { create } from "zustand";
import { API_BASE } from "../config";
import { cartStore } from "../cart/cart.store";
import { putCart } from "../cart/cart.api";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  ready: boolean;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,

  async fetchUser() {
    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, ready: true });
        return;
      }

      const data = await res.json();

      if (data && data.user && typeof data.user === "object") {
        set({ user: data.user, ready: true });

        // ============================================
        // 🔁 RESTORE PENDING CART (UNA SOLA VOLTA)
        // ============================================
        const raw = localStorage.getItem("PENDING_CART");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);

            /**
             * REGOLA:
             * - PENDING_CART può contenere SOLO configurationId
             * - Niente items, niente pricing
             */
            const configurationId =
              parsed?.configurationId ??
              parsed?.items?.[0]?.configurationId;

            if (configurationId) {
              // 👉 ripristino slot cart BE + FE
              await putCart({ configurationId });
            }
          } catch (err) {
            console.warn(
              "[AUTH] PENDING_CART non valido, ignorato",
              err
            );
          } finally {
            // ⚠️ fondamentale: evitare restore multipli
            localStorage.removeItem("PENDING_CART");
          }
        }
      } else {
        set({ user: null, ready: true });
      }
    } catch {
      set({ user: null, ready: true });
    }
  },

  clearUser() {
    set({ user: null, ready: true });
    cartStore.getState().clear();
  },
}));
