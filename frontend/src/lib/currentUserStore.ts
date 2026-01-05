// ======================================================
// FE || lib/currentUserStore.ts
// ======================================================
//
// AI-SUPERCOMMENT — AUTH STORE (USER)
//
// RUOLO:
// - Gestire lo stato di autenticazione lato FE
// - Distinguere tra:
//   • sessione tecnica esistente (cookie / OAuth)
//   • login ESPLICITO deciso dall’utente
//
// PRINCIPIO CHIAVE (INVARIANTE):
// - L’utente NON è considerato "loggato" finché
//   non compie un’azione esplicita di login nel FE.
// - /api/user/me NON è mai un guard di navigazione.
//   È solo una fonte dati.
//
// QUESTO STORE:
// - NON fa redirect
// - NON decide il routing
// - NON viene inizializzato automaticamente
//
// CHI LO USA:
// - Pagina /login  → chiama markExplicitLogin + fetchUser
// - Cart / Checkout → legge user + hasExplicitLogin
//
// ======================================================

import { create } from "zustand";
import { API_BASE } from "./config";

// ======================================================
// CURRENT USER — DTO FE
// ======================================================
export type CurrentUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

// ======================================================
// AUTH STATE — CONTRATTO
// ======================================================
interface CurrentUserState {
  // Dati utente (null se non autenticato esplicitamente)
  user: CurrentUser | null;

  // Stato caricamento fetchUser
  loading: boolean;

  // FLAG CRITICO:
  // true SOLO dopo un login volontario (es. Google OAuth)
  hasExplicitLogin: boolean;

  // Marca il login come intenzionale
  markExplicitLogin: () => void;

  // Recupera i dati utente dalla sessione server
  // (da chiamare SOLO dopo login esplicito)
  fetchUser: () => Promise<void>;

  // Logout FE (reset completo stato auth)
  clearUser: () => void;
}

// ======================================================
// AUTH STORE — IMPLEMENTAZIONE
// ======================================================
export const useAuthStore = create<CurrentUserState>((set) => ({
  // Stato iniziale: visitor
  user: null,
  loading: false,
  hasExplicitLogin: false,

  // =========================================
  // MARK LOGIN INTENZIONALE
  // =========================================
  markExplicitLogin: () => {
    // PERCHÉ:
    // - separa login volontario da sessione tecnica
    // - impedisce login automatici "fantasma"
    set({ hasExplicitLogin: true });
  },

  // =========================================
  // FETCH CURRENT USER (SESSION)
  // =========================================
  fetchUser: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Sessione non valida o scaduta
        set({ user: null, loading: false });
        return;
      }

      const data = await res.json();

      // NOTA:
      // - NON settiamo hasExplicitLogin qui
      // - fetchUser NON implica intenzione
      set({
        user: data?.user ?? null,
        loading: false,
      });
    } catch {
      set({ user: null, loading: false });
    }
  },

  // =========================================
  // LOGOUT FE
  // =========================================
  clearUser: () => {
    // PERCHÉ:
    // - reset completo stato auth
    // - evita leakage tra sessioni
    set({
      user: null,
      loading: false,
      hasExplicitLogin: false,
    });
  },
}));
