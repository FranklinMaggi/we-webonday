import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE } from "../lib/config";

/* =========================
   Tipi
   ========================= */
export type User = {
  id: string;
  email: string;
  role?: "user" | "admin";
  firstName?: string;
  lastName?: string;
};

type AuthState = {
  user: User | null;

  // 🔑 stato di bootstrap (fondamentale)
  ready: boolean;
  loading: boolean;

  // actions
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setReady: (ready: boolean) => void;
  clearUser: () => void;
};

/* =========================
   Store
   ========================= */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      ready: false,
      loading: false,

      setUser: (user) => set({ user }),

      setReady: (ready) => set({ ready }),

      fetchUser: async () => {
        set({ loading: true });

        try {
          const res = await fetch(`${API_BASE}/api/user/me`, {
            credentials: "include",
          });

          if (!res.ok) {
            set({ user: null, loading: false, ready: true });
            return;
          }

          const data = await res.json();

          set({
            user: data?.user ?? null,
            loading: false,
            ready: true,
          });
        } catch {
          set({ user: null, loading: false, ready: true });
        }
      },

      clearUser: () =>
        set({
          user: null,
          loading: false,
          ready: true,
        }),
    }),
    {
      name: "webonday-auth",
      partialize: (state) => ({
        user: state.user, // persisti SOLO l’utente
      }),
    }
  )
);
