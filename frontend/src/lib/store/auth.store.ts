// ======================================================
// FE || store/auth.store.ts
// ======================================================
//
// AUTH STORE — SOURCE OF TRUTH FE
//
// PRINCIPIO:
// - La sessione è determinata SOLO dal backend
// - FE legge, non decide
// ======================================================
import { cartStore } from "../cart/cart.store";
import { create } from "zustand";
import { API_BASE } from "../config";

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
  
      // ✅ BLIND: user ESISTE solo se data.user è oggetto
      if (data && data.user && typeof data.user === "object") {
        set({ user: data.user, ready: true });

  // ============================================
        // 🔁 RESTORE PENDING CART (UNA SOLA VOLTA)
        // ============================================
        const raw = localStorage.getItem("PENDING_CART");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);

            if (parsed?.items?.length) {
              cartStore.getState().replace(parsed.items);
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
  },
}));