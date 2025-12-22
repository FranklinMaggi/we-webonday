import { create } from "zustand";

export type UserMode = "client" | "partner";

interface UserModeState {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

export const useUserMode = create<UserModeState>((set) => ({
  mode: (localStorage.getItem("user_mode") as UserMode) || "client",
  setMode: (mode) => {
    localStorage.setItem("user_mode", mode);
    set({ mode });
  },
}));
