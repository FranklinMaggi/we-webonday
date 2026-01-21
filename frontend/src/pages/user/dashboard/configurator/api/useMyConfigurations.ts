import { useEffect, useState } from "react";
import { listMyConfigurations } from "./configuration.user.api";
import type { ConfigurationConfiguratorDTO } from "../models/ConfigurationConfiguratorDTO";

export function useMyConfigurations() {
  const [items, setItems] = useState<ConfigurationConfiguratorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMyConfigurations()
      .then((res) => {
        if (!res.ok) {
          setError("Errore caricamento configurazioni");
          return;
        }
        setItems(res.items ?? []);
      })
      .catch(() => {
        setError("Errore di rete");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    items,
    loading,
    error,
  };
}


// ======================================================
// FE || HOOK || useMyWorkspaceConfigurations
// ======================================================
//
// RUOLO:
// - Deriva le configurazioni pronte
// - Workspace = stato READY
//
// ======================================================


export function useMyWorkspaceConfigurations() {
  const { items, loading, error } = useMyConfigurations();

  const workspaceItems = items.filter(
    (c) => c.status === "READY"
  );

  return {
    items: workspaceItems,
    loading,
    error,
    hasItems: workspaceItems.length > 0,
  };
}


// ======================================================
// FE || HOOK || useMyWorkspaceConfigurations
// ======================================================
//
// RUOLO:
// - Deriva le configurazioni pronte
// - Workspace = stato READY
//
// ======================================================



export function useMyWorkspaceEditor() {
  const { items, loading, error } = useMyConfigurations();

  const workspaceItems = items.filter(
    (c) => c.status === "DRAFT"
  );

  return {
    items: workspaceItems,
    loading,
    error,
    hasItems: workspaceItems.length > 0,
  };
}
