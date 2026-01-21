import { Env } from "../../../types/env";
import { ConfigurationDTO } from "@domains/configuration";




function normalizeBusinessDraftId(id: string) {
  return id.includes(":") ? id.split(":").pop()! : id;
}
export async function assertConfigurationOwnershipByBusinessDraft(
  env: Env,
  businessDraftId: string,
  userId: string
): Promise<ConfigurationDTO> {

  const canonicalId = normalizeBusinessDraftId(businessDraftId);

  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  for (const k of keys) {
    const config = await env.CONFIGURATION_KV.get(
      k.name,
      "json"
    ) as ConfigurationDTO | null;

    if (!config?.businessDraftId) continue;

    const configBusinessDraftId =
      normalizeBusinessDraftId(config.businessDraftId);

    if (configBusinessDraftId === canonicalId) {
      if (config.userId !== userId) {
        throw new Error("FORBIDDEN");
      }
      return config;
    }
  }

  throw new Error("BUSINESS_DRAFT_NOT_FOUND");
}
