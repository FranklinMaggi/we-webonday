import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreConfigPayload = {
  businessName: string;
  solutionId: string;
  productId: string;
};

interface PreConfigurationState {
  payload: PreConfigPayload | null;

  setPreConfig: (data: PreConfigPayload) => void;
  consume: () => PreConfigPayload | null;
}

export const usePreConfigurationStore = create<PreConfigurationState>()(
  persist(
    (set, get) => ({
      payload: null,

      setPreConfig: (data) =>
        set({
          payload: {
            businessName: data.businessName.trim(),
            solutionId: data.solutionId,
            productId: data.productId,
          },
        }),

      consume: () => {
        const snapshot = get().payload;
        set({ payload: null });
        return snapshot;
      },
    }),
    {
      name: "wod-pre-config",
    }
  )
);
