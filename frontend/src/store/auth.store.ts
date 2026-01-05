// ======================================================
// FE || store/auth.store.ts
// ======================================================
//
// AI-SUPERCOMMENT — AUTH STORE (USER)
//
// RUOLO:
// - Gestire lo stato di autenticazione UTENTE lato FE
//
// PRINCIPI NON NEGOZIABILI:
// - Nessun login automatico al bootstrap
// - /api/user/me NON è un guard di navigazione
// - L’utente è considerato loggato SOLO dopo
//   un’azione ESPLICITA di login (email o Google)
//
// DISTINZIONE CHIAVE:
// - Sessione tecnica (cookie HttpOnly) ≠ login intenzionale FE
//
// QUESTO STORE:
// - NON fa redirect
// - NON inizializza auth da solo
// - NON decide il routing
//
// CHI PUÒ CHIAMARE fetchUser():
// - SOLO la pagina /login, dopo successo OAuth o login manuale
//
// ======================================================

import { create } from "zustand";
import { getCurrentUser } from "../lib/authApi";

// ======================================================
// AUTH STATE — CONTRATTO
// ======================================================
interface AuthState {
  // Dati utente (null se visitor)
  user: any | null;

  // Flag di readiness FE (router / layout)
  ready: boolean;

  // FLAG CRITICO:
  // true SOLO dopo login volontario dell’utente
  hasExplicitLogin: boolean;

  // Marca il login come intenzionale
  markExplicitLogin: () => void;

  // Recupera i dati utente dalla sessione server
  // ⚠️ DA CHIAMARE SOLO DOPO login esplicito
  fetchUser: () => Promise<void>;

  // Logout FE completo
  clearUser: () => void;

  // Segnala che l’app è pronta (bootstrap)
  setReady: (v: boolean) => void;
}

// ======================================================
// AUTH STORE — IMPLEMENTAZIONE
// ======================================================
export const useAuthStore = create<AuthState>((set) => ({
  // ===========================
  // STATO INIZIALE (VISITOR)
  // ===========================
  user: null,
  ready: false,
  hasExplicitLogin: false,

  // ===========================
  // MARK LOGIN INTENZIONALE
  // ===========================
  markExplicitLogin: () => {
    // PERCHÉ:
    // - separa login volontario da sessione tecnica
    // - impedisce login automatici “fantasma”
    set({ hasExplicitLogin: true });
  },

  // ===========================
  // FETCH CURRENT USER
  // ===========================
  fetchUser: async () => {
    try {
      // ⚠️ /api/user/me
      // Usato SOLO dopo login esplicito
      const user = await getCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  // ===========================
  // LOGOUT FE
  // ===========================
  clearUser: () => {
    // Reset completo stato auth
    set({
      user: null,
      hasExplicitLogin: false,
      ready: true,
    });
  },

  // ===========================
  // BOOTSTRAP FE
  // ===========================
  setReady: (v: boolean) => {
    // NOTA:
    // - Non carica l’utente
    // - Segnala solo che il FE è pronto
    set({ ready: v });
  },
}));
