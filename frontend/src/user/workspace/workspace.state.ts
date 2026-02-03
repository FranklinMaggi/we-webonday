import { create } from "zustand";
// FE || WORKSPACE STATE — CANONICAL

type WorkspaceState = {
  activeConfigurationId: string | null;
  setActiveConfiguration: (id: string) => void;
};

export const useWorkspaceState = create<WorkspaceState>((set) => ({
  activeConfigurationId: null,
  setActiveConfiguration: (id) =>
    set({ activeConfigurationId: id }),
}));
