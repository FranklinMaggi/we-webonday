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

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../../lib/api";

type BusinessDraftRaw = {
  id?: string;
  configurationId: string;
  businessName?: string;
};

export function useMyBusinessDrafts() {
  const [items, setItems] = useState<
    Omit<BusinessDraftRaw, "id">[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{
      ok: boolean;
      items?: BusinessDraftRaw[];
    }>("/api/business/get-base-draft")
      .then((res) => {
        if (!res?.ok || !Array.isArray(res.items)) {
          setItems([]);
          return;
        }

        setItems(res.items.map(normalizeBackendEntity));
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    items,
    loading,
    hasItems: items.length > 0,
  };
}
