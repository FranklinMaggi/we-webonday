import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "@domains/configuration";
import { CONFIGURATION_KEY } from "@domains/configuration/keys";

function normalizeBusinessDraftId(id: string) {
  return id.includes(":") ? id.split(":").pop()! : id;
}

/**
 * ======================================================
 * BE || ASSERT || CONFIGURATION OWNERSHIP BY BUSINESS DRAFT
 * ======================================================
 *
 * REGOLA CANONICA (attuale):
 * - BusinessDraft.id === configurationId
 *
 * NO SCAN KV:
 * - lookup diretto su CONFIGURATION:{id}
 */
export async function assertConfigurationOwnershipByBusinessDraft(
  env: Env,
  businessDraftId: string,
  userId: string
): Promise<ConfigurationDTO> {
  const canonicalId = normalizeBusinessDraftId(businessDraftId);

  // ✅ Lookup diretto (O(1))
  const configuration = (await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(canonicalId),
    "json"
  )) as ConfigurationDTO | null;

  if (!configuration) {
    console.error("[assertConfigurationOwnershipByBusinessDraft] CONFIG_NOT_FOUND", {
      businessDraftId,
      canonicalId,
      userId,
    });
    throw new Error("CONFIGURATION_NOT_FOUND");
  }

  if (configuration.userId !== userId) {
    console.error("[assertConfigurationOwnershipByBusinessDraft] FORBIDDEN", {
      configurationId: configuration.id,
      configUserId: configuration.userId,
      userId,
    });
    throw new Error("FORBIDDEN");
  }

  return configuration;
}