/**
 * ======================================================
 * FE || src/lib/adminApi/admin.users.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Esporre l’API FE per la gestione UTENTI in contesto ADMIN
 *
 * RESPONSABILITÀ:
 * - Definire il DTO AdminUser allineato al backend
 * - Recuperare la lista utenti amministrabile
 * - Astrarre la variabilità della response backend
 *
 * NON FA:
 * - NON crea utenti
 * - NON aggiorna utenti
 * - NON gestisce permessi o ruoli
 * - NON applica logica di business
 *
 * INVARIANTI:
 * - Il backend è source of truth per:
 *   • stato utente
 *   • data di creazione
 *   • visibilità utenti
 * - Tutte le chiamate passano da adminFetch
 * - Vietato usare fetch diretto
 *
 * RELAZIONE CON BACKEND:
 * - Endpoint: GET /api/admin/users/list
 * - Il backend può rispondere con:
 *   • array diretto
 *   • oggetto { ok, users }
 * - Questo file assorbe la differenza di shape
 *
 * RELAZIONE CON UI:
 * - La UI riceve sempre AdminUser[]
 * - Nessuna logica di adattamento lato componente
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/adminApi/admin.users.api.ts (file già allineato)
 * - Evoluzione possibile:
 *   • paginazione
 *   • filtri (status, data)
 *   • azioni admin (suspend / activate)
 *
 * NOTE:
 * - File volutamente minimale
 * - Ogni estensione deve essere guidata dal backend
 * ======================================================
 */

import { adminFetch } from "./client";

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  status: "active" | "suspended";
}

type AdminUsersListResponse = {
  ok: true;
  users: AdminUser[];
};

export async function getAdminUsers() {
  const out = await adminFetch<AdminUser[] | AdminUsersListResponse>("/api/admin/users/list");
  return Array.isArray(out) ? out : out.users;
}
