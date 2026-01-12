// ======================================================
// FE || store/identity.store.ts
// ======================================================
//
// IDENTITY STORE — SOFT / SHADOW MODE
//
// RUOLO:
// - Gestire l’identità applicativa FE
// - Precedere l’autenticazione
// - Sopravvivere al login / logout
//
// QUESTA IDENTITY:
// - NON è una sessione
// - NON è un user
// - NON sostituisce auth.store
//
// È un perno stabile per:
// - visitor
// - device
// - future multi-device
//
// ======================================================
/**
 * NOTA TERMINOLOGICA (VINCOLANTE):
 *
 * - Identity ≠ User
 * - Identity ≠ Auth
 * - Identity è un concetto applicativo FE
 * - User esiste SOLO se autenticato
 *
 * Vietato usare `identityId` come `userId`.
 */
// ======================================================
// IDENTITY — PERSISTED SHAPE (NO METHODS)
// ======================================================
interface PersistedIdentity {
    identityId: string;
    mode: IdentityMode;
    userId?: string;
  }
  
import { create } from "zustand";

const IDENTITY_STORAGE_KEY = "WOD_IDENTITY_V1";

export type IdentityMode = "visitor" | "user";

export interface IdentityState {
  /** Identità applicativa stabile (per device) */
  identityId: string;

  /** Stato logico */
  mode: IdentityMode;

  /** UserId associato (se loggato) */
  userId?: string;

  /** Azioni */
  attachUser: (userId: string) => void;
  detachUser: () => void;
}

/**
 * Utility — genera identityId
 * Usa crypto se disponibile, fallback sicuro
 */
function generateIdentityId(): string {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `identity_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

/**
 * Bootstrap identity dal localStorage
 */
function loadInitialIdentity(): PersistedIdentity {
    try {
      const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PersistedIdentity;
      }
    } catch {
      // ignore
    }
  
    const identity: PersistedIdentity = {
      identityId: generateIdentityId(),
      mode: "visitor",
    };
  
    localStorage.setItem(
      IDENTITY_STORAGE_KEY,
      JSON.stringify(identity)
    );
  
    return identity;
  }
  

export const useIdentityStore = create<IdentityState>((set) => {
  const initial = loadInitialIdentity();

  return {
    ...initial,

    attachUser(userId: string) {
      set((state) => {
        const next = {
          ...state,
          mode: "user" as const,
          userId,
        };

        localStorage.setItem(
          IDENTITY_STORAGE_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    },

    detachUser() {
      set((state) => {
        const next = {
          identityId: state.identityId,
          mode: "visitor" as const,
        };

        localStorage.setItem(
          IDENTITY_STORAGE_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    },
  };
});
