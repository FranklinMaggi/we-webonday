// ======================================================
// FE || USER DASHBOARD || PROFILE CONTAINER
// ======================================================
//
// RUOLO:
// - carica OwnerDraft della configuration attiva
// - carica stato Configuration collegata
//
// INVARIANTE:
// - Profile lavora su UNA configuration
//   • attiva (setupStore)
//   • oppure derivata dalle configuration utente
// ======================================================

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";

import { useMyConfigurations } from
  "@src/user/configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";

import type { OwnerDraftReadDTO } from
  "@src/user/dashboard/you/profile/DataTransferObject/owner.read.types";
import type { ConfigurationReadDTO } from
  "./DataTransferObject/configuration-read.type";

import { useConfigurationSetupStore } from
  "@src/shared/domain/user/configurator/configurationSetup.store";

export function useProfileContainer() {
  /* =====================
     STATE
  ====================== */
  const [user, setUser] =
    useState<OwnerDraftReadDTO | null>(null);

  const [configuration, setConfiguration] =
    useState<ConfigurationReadDTO | null>(null);

  /* =====================
     STORES
  ====================== */
  const { data, setField } =
    useConfigurationSetupStore();

  const { items: configurations = [] } =
    useMyConfigurations();

  /* =====================
     DERIVE CONFIGURATION
  ====================== */
  const configurationId =
    data.configurationId ??
    configurations[0]?.id ??
    null;

  /* =====================
     ALIGN STORE (ONCE)
  ====================== */
  useEffect(() => {
    if (!data.configurationId && configurationId) {
      setField("configurationId", configurationId);
    }
  }, [data.configurationId, configurationId, setField]);

  /* =====================
     LOAD PROFILE
  ====================== */
  const loadProfile = useCallback(async () => {
    if (!configurationId) {
      setUser(null);
      setConfiguration(null);
      return;
    }

    /* ---------- OWNER ---------- */
    const ownerRes = await apiFetch<{
      ok: boolean;
      owner?: OwnerDraftReadDTO | null;
    }>(
      `/api/owner/get-draft?configurationId=${configurationId}`
    );

    if (!ownerRes?.ok || !ownerRes.owner) {
      setUser(null);
      setConfiguration(null);
      return;
    }

    setUser(ownerRes.owner);

    /* ---------- CONFIGURATION ---------- */
    const cfgRes = await apiFetch<{
      ok: boolean;
      configuration?: ConfigurationReadDTO;
    }>(
      `/api/configuration/read-base/${configurationId}`
    );

    setConfiguration(cfgRes?.configuration ?? null);
  }, [configurationId]);

  /* =====================
     EFFECT
  ====================== */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* =====================
     PUBLIC API
  ====================== */
  return {
    user,               // OwnerDraft attivo
    configuration,      // Stato configuration
    reloadProfile: loadProfile,
  };
}
