// frontend/src/stores/adminSolutions.store.ts

import { create } from "zustand";
import type { AdminSolution } from "../apiModels/admin/Solution.api-model";
import { fetchAdminSolutions } from "../../../admin/adminApi/admin.solutions.api";

type AdminSolutionsState = {
  solutions: AdminSolution[];
  loading: boolean;
  error: string | null;
  loadSolutions: () => Promise<void>;
};

export const useAdminSolutionsStore =
  create<AdminSolutionsState>((set) => ({
    solutions: [],
    loading: false,
    error: null,

    loadSolutions: async () => {
      set({ loading: true, error: null });

      try {
        const res = await fetchAdminSolutions();
        set({
          solutions: res.solutions,
          loading: false,
        });
      } catch (err) {
        set({
          error: "IMPOSSIBLE_LOAD_SOLUTIONS",
          loading: false,
        });
      }
    },
  }));
