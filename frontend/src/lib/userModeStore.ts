/**
 * ======================================================
 * FE || src/lib/userModeStore.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v0.9 (legacy)
 *
 * STATO:
 * - DEPRECATED (soft)
 *
 * RUOLO:
 * - Gestione locale del "modo utente" (client / partner)
 *
 * CONTESTO STORICO:
 * - Introdotto per simulare un cambio di contesto UI
 *   tra cliente finale e partner/business
 * - Basato su persistenza locale (localStorage)
 *
 * RESPONSABILITÀ:
 * - Esporre lo stato UI "mode"
 * - Persistenza locale della scelta utente
 *
 * NON FA:
 * - NON gestisce autenticazione
 * - NON rappresenta ruoli reali
 * - NON riflette permessi backend
 * - NON influenza API o sicurezza
 *
 * MOTIVO DEPRECATION:
 * - Il progetto ha adottato un modello più chiaro:
 *   • User = identità unica
 *   • Buyer / Business = stato derivato dal backend
 * - Il mode corretto deve arrivare da:
 *   • sessione
 *   • business associato
 *   • stato attività (DRAFT / ACTIVE)
 *
 * RISCHI SE USATO:
 * - Incoerenza UI
 * - Stato non allineato con backend
 * - Bug di permessi percepiti
 *
 * INVARIANTI ATTUALI:
 * - Non influisce su sicurezza
 * - Usato solo per UI / prototipi
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: RIMOZIONE
 * - Sostituzione con:
 *   • stato derivato da /api/user/me
 *   • oppure da business associato
 *
 * AZIONE CONSIGLIATA:
 * - NON estendere
 * - NON usare in nuove feature
 * - Rimuovere solo dopo audit UI completo
 *
 * NOTE:
 * - File mantenuto per backward compatibility
 * - Backend = source of truth
 * ======================================================
 */

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
