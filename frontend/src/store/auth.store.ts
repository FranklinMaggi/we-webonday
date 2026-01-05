// ======================================================
// FE || store/auth.store.ts
// ======================================================
//
// AI-SUPERCOMMENT — AUTH STORE
//
// PRINCIPIO:
// - La sessione ESISTE solo se:
//   • fetchUser ha risposto
// - Il login è VALIDO solo se:
//   • è stato intenzionale
//
// ======================================================
import { create } from "zustand";
import { getCurrentUser } from "../lib/authApi";

interface AuthState {
  user: any | null;
  ready: boolean;

  /** 🔐 TRUE solo dopo login volontario */
  hasExplicitLogin: boolean;

  fetchUser: () => Promise<void>;
  markExplicitLogin: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  hasExplicitLogin: false,

  async fetchUser() {
    try {
      const user = await getCurrentUser(); // /api/user/me

      // ⚠️ USER VIENE SETTATO SOLO SE C'È LOGIN ESPLICITO
      if (get().hasExplicitLogin) {
        set({ user });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    } finally {
      set({ ready: true });
    }
  },

  markExplicitLogin() {
    set({ hasExplicitLogin: true });
  },

  clearUser() {
    set({
      user: null,
      hasExplicitLogin: false,
      ready: true,
    });
  },
}));
