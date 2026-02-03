import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";

import type { OwnerDraftReadDTO } from
  "@src/shared/domain/owner/owner.read.types";

import type { ConfigurationReadDTO } from "./DataTransferObject/configuration-read.type";
import { useConfigurationSetupStore } from
  "@src/shared/domain/user/configurator/configurationSetup.store";

export function useProfileContainer() {
  const [user, setUser] =
    useState<OwnerDraftReadDTO | null>(null);

  const [configuration, setConfiguration] =
    useState<ConfigurationReadDTO | null>(null);

  const { setField } = useConfigurationSetupStore();

  const loadProfile = useCallback(async () => {
    /* ================= OWNER ================= */
    const ownerRes = await apiFetch<{
      ok: boolean;
      owner?: OwnerDraftReadDTO;
    }>("/api/owner/get-draft");

    if (!ownerRes?.owner) {
      setUser(null);
      setConfiguration(null);
      return;
    }

    const owner = ownerRes.owner;
    setUser(owner);

    if (owner.configurationId) {
      setField("configurationId", owner.configurationId);

      /* ================= CONFIGURATION READ ================= */
      const cfgRes = await apiFetch<{
        ok: boolean;
        configuration?: ConfigurationReadDTO;
      }>(
        `/api/configuration/${owner.configurationId}`
      );

      setConfiguration(cfgRes?.configuration ?? null);
    } else {
      setConfiguration(null);
    }
  }, [setField]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    configuration,
    reloadProfile: loadProfile,
  };
}
