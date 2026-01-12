// ======================================================
// AUTH STORE — FE
// ======================================================
//
// RUOLO (INVARIANTE):
// - Gestisce ESCLUSIVAMENTE lo stato di autenticazione
// - Determina se l’utente è loggato oppure no
//
// NON È RESPONSABILE DI:
// - Identità applicativa (visitor / identity)
// - Persistenza multi-device
// - Carrello o configuration
//
// NOTA ARCHITETTURALE:
// - `user === null` ≠ assenza di identità
// - L’identità applicativa è gestita altrove (IdentityStore)
//
// Questo store NON va esteso oltre auth.
//
// ======================================================

import { create } from "zustand";
import { API_BASE } from "../config";
import { cartStore } from "../cart/cart.store";
import { useIdentityStore } from "./identity.store";

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

      if (data && data.user && typeof data.user === "object") {
        set({ user: data.user, ready: true });

        // ======================================================
        // 🔗 IDENTITY ATTACH (SOFT)
        // ======================================================
        // Collega l'identità applicativa FE allo user autenticato.
        // NON crea sessioni
        // NON migra dati
        // NON tocca il carrello
        useIdentityStore.getState().attachUser(data.user.id);
      } else {
        set({ user: null, ready: true });
      }
    } catch {
      set({ user: null, ready: true });
    }
  },

  clearUser() {
    set({ user: null, ready: true });

    // ======================================================
    // 🔗 IDENTITY DETACH (SOFT)
    // ======================================================
    // Torna in modalità visitor mantenendo identityId
    useIdentityStore.getState().detachUser();

    cartStore.getState().clear();
  },
}));
