import { create } from "zustand";
import { API_BASE } from "./config";

export type CurrentUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

interface CurrentUserState {
  user: CurrentUser | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<CurrentUserState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, loading: false });
        return;
      }

      const data = await res.json();
      set({ user: data?.user ?? null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  clearUser: () => {
    set({ user: null, loading: false });
  },
}));
