// ======================================================
// FE || HOOK || useMyConfigurations (DEDUPED + CACHED)
// File: src/user/pages/dashboard/configurator/api/useMyConfigurations.ts
// ======================================================
//
// PERCHÉ:
// - Evita fetch duplicati (Sidebar, Dashboard, Workspace…)
// - Stabilizza rendering dopo createBusinessDraft / createOwnerDraft
//
// STRATEGIA:
// - cache in modulo (in-memory) + inflight promise condivisa
// - TTL breve (es. 15s) per evitare staleness
// - nessun file nuovo
// ======================================================

import { useEffect, useState } from "react";
import { listMyConfigurations } from "./get.my-pre-configuration";
import {type ConfigurationConfiguratorDTO } from "../ConfigurationConfiguratorDTO";
type CacheState = {
  ts: number;
  items: ConfigurationConfiguratorDTO[];
};

const TTL_MS = 15_000;

// cache in memoria (per tab)
let cache: CacheState | null = null;

// promessa in flight condivisa (dedupe)
let inflight:
  | Promise<{ ok: boolean; items?: ConfigurationConfiguratorDTO[] }>
  | null = null;

async function loadOnce() {
  // 1) cache hit
  if (cache && Date.now() - cache.ts < TTL_MS) {
    return { ok: true, items: cache.items };
  }

  // 2) dedupe
  if (inflight) return inflight;

  inflight = listMyConfigurations()
    .then((res) => {
      if (res?.ok) {
        cache = {
          ts: Date.now(),
          items: res.items ?? [],
        };
      }
      return res;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function useMyConfigurations() {
  const [items, setItems] = useState<ConfigurationConfiguratorDTO[]>(
    cache?.items ?? []
  );
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    setLoading(!cache);
    setError(null);

    loadOnce()
      .then((res) => {
        if (!alive) return;

        if (!res?.ok) {
          setError("Errore caricamento configurazioni");
          return;
        }
        setItems(res.items ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setError("Errore di rete");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error };
}
