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
  explicitLogin: boolean;

  markExplicitLogin: () => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  explicitLogin: false,

  markExplicitLogin: () => {
    set({ explicitLogin: true });
  },

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ ready: true });
    }
  },

  clearUser: () => {
    set({
      user: null,
      ready: true,
      explicitLogin: false,
    });
  },
}));
