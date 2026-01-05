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

import { create } from "zustand";
import { API_BASE } from "../lib/config";

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
      } else {
        set({ user: null, ready: true });
      }
    } catch {
      set({ user: null, ready: true });
    }
  }
,  

  clearUser() {
    set({ user: null, ready: true });
  },
}));
