import type { ConfigurationSetupStoreDTO } from
  "../../../store/configurationSetup.store";
import type { BusinessCreateSchedaPayload } from "./businessCreate-payload";

/**
 * ======================================================
 * FE || BusinessCreateScheda Normalizer
 * ======================================================
 *
 * RUOLO:
 * - Adatta dati UI → payload /business/create-draft
 *
 * INVARIANTI:
 * - Nessuna validazione dominio
 * - Nessuna serializzazione
 * - Zod BE è source of truth
 */
export function buildBusinessCreateSchedaPayload(
  data: ConfigurationSetupStoreDTO
): BusinessCreateSchedaPayload {
  
  if (!data.configurationId) {
    throw new Error("CONFIGURATION_ID_REQUIRED");
  }

  if (!data.businessName?.trim()) {
    throw new Error("BUSINESS_NAME_REQUIRED");
  }

  if (!data.solutionId || !data.productId) {
    throw new Error("COMMERCIAL_ORIGIN_REQUIRED");
  }

  if (!data.email) {
    throw new Error("EMAIL_REQUIRED");
  }

  if (!data.privacy.accepted) {
    throw new Error("PRIVACY_NOT_ACCEPTED");
  }

  return {
    /* =====================
       Identity / linkage
    ====================== */
    configurationId: data.configurationId,

    /* =====================
       Core
    ====================== */
    businessName: data.businessName.trim(),
    solutionId: data.solutionId,
    productId: data.productId,

    /* =====================
       Opening hours
    ====================== */
    businessOpeningHour: data.openingHours ?? {},

    /* =====================
       Contact
    ====================== */
    contact: {
      address: {
        street: data.address ?? "",
        city: data.city ?? "",
        province: data.state ?? "",
        zip: data.zip ?? "",
      },
      phoneNumber: data.phone ?? "",
      mail: data.email,
    },

    /* =====================
       Classification
    ====================== */
    businessDescriptionTags: data.businessDescriptionTags ?? [],
    businessServiceTags: data.businessServiceTags ?? [],

    /* =====================
       Privacy & compliance
    ====================== */
    privacy: {
      accepted: data.privacy.accepted,
      acceptedAt: data.privacy.acceptedAt,
      policyVersion: data.privacy.policyVersion || "v1",
    },}
}
