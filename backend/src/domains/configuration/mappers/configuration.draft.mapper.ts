import type { ConfigurationDTO } from "../schema/configuration.schema";
import type { ConfigurationBaseReadDTO } from
  "../DataTransferObgject/output/configuration.base.read.dto";

export function toBaseReadDTO(
  config: ConfigurationDTO
): ConfigurationBaseReadDTO {
  if (config.status !== "DRAFT" && config.status !== "BUSINESS_READY") {
    throw new Error(
      `INVALID_CONFIGURATION_STATE_FOR_BASE_READ: ${config.status}`
    );
  }

  return {
    id: config.id!,
    status: config.status, // ora è SAFE
    solutionId: config.solutionId,
    productId: config.productId,
    businessName: config.prefill?.businessName,
    businessDraftId:config.businessDraftId ?? null,
  };
}
