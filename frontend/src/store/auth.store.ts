import { create } from "zustand";
import { getCurrentUser } from "../lib/authApi";

interface AuthState {
  user: any | null;
  ready: boolean;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
  setReady: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,

  fetchUser: async () => {
    try {
      const user = await getCurrentUser(); // 🔐 /api/user/me
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ ready: true });
    }
  },

  clearUser: () => set({ user: null , ready: true}),

  setReady: (v) => set({ ready: v }),
}));
