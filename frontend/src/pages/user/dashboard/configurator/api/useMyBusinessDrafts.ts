// ======================================================
// FE || TYPE || BackendEntity (PARACADUTE)
// ======================================================
//
// RUOLO:
// - Rappresenta QUALSIASI entità BE
// - Accetta qualunque campo
// - L'id viene gestito separatamente
//
// ======================================================

export type BackendEntity<T extends object = {}> = {
    id?: string;          // opzionale, mai usato direttamente
  } & T & Record<string, unknown>;
  
  // ======================================================
// FE || UTILS || normalizeBackendEntity
// ======================================================
//
// RUOLO:
// - Riceve un oggetto BE
// - Rimuove l'id
// - Ritorna TUTTO il resto intatto
//
// ======================================================

export function normalizeBackendEntity<T extends object>(
    raw: T & { id?: string }
  ): Omit<T, "id"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = raw;
    return rest;
  }
  
  // ======================================================
// FE || HOOK || useMyBusinessDraft (ESTENSIBILE)
// ======================================================
//
// RUOLO:
// - Legge il Business Draft dell’utente
// - Espone TUTTI i campi BE (tranne id)
//
// ======================================================
// ======================================================
// FE || HOOK || useMyBusinessDrafts (ESTENSIBILE)
// ======================================================
// ======================================================
// FE || HOOK || useBusinessDraft
// ======================================================
//
// RUOLO:
// - Carica il BusinessDraft di UNA Configuration
// - Lookup puntuale
//
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../../lib/api";


export function useBusinessDraft(configurationId?: string) {
  const [draft, setDraft] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);

    apiFetch<{
      ok: boolean;
      draft?: any;
    }>(
      `/api/business/get-base-draft?configurationId=${configurationId}`
    )
      .then((res) => {
        if (!res?.ok || !res.draft) {
          setDraft(null);
          return;
        }

        setDraft(normalizeBackendEntity(res.draft));
      })
      .finally(() => setLoading(false));
  }, [configurationId]);

  return {
    draft,
    loading,
    hasDraft: Boolean(draft),
  };
}
