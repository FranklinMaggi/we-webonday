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
// - Carrello o configuration (se non per bootstrap legacy)
//
// NOTA ARCHITETTURALE:
// - `user === null` ≠ assenza di identità
// - La gestione dell’identità è intenzionalmente esterna
//   (verrà isolata in uno store dedicato)
//
// Questo store NON va esteso oltre auth.
//
// ======================================================

import { create } from "zustand";
import { API_BASE } from "../config";
import { cartStore } from "../cart/cart.store";
import { putCart } from "../cart/cart.api";
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
// NON crea sessioni, NON migra dati, NON tocca il cart.
useIdentityStore.getState().attachUser(data.user.id);

        // ============================================
        // 🔁 RESTORE PENDING CART (UNA SOLA VOLTA)
        // ============================================
        const raw = localStorage.getItem("PENDING_CART");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);

            /**
             * REGOLA:
             * - PENDING_CART può contenere SOLO configurationId
             * - Niente items, niente pricing
             */
            const configurationId =
              parsed?.configurationId ??
              parsed?.items?.[0]?.configurationId;

            if (configurationId) {
              // 👉 ripristino slot cart BE + FE
              await putCart({ configurationId });
            }
          } catch (err) {
            console.warn(
              "[AUTH] PENDING_CART non valido, ignorato",
              err
            );
          } finally {
            // ⚠️ fondamentale: evitare restore multipli
            localStorage.removeItem("PENDING_CART");
          }
        }
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
  // Torna in modalità visitor mantenendo identityId.
  useIdentityStore.getState().detachUser();
    cartStore.getState().clear();
  },
}));
