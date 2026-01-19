import type { ConfigurationSetupStoreDTO } from
  "../../../pages/user/dashboard/configurator/store/configurationSetup.store";
import type { BusinessCreateSchedaPayload } from "./businessCreate-payload";

/**
 * ======================================================
 * FE || BusinessCreateScheda Normalizer
 * ======================================================
 *
 * RUOLO:
 * - Adatta dati UI → payload /business/create-schede
 *
 * INVARIANTI:
 * - Nessuna validazione dominio
 * - Nessuna serializzazione
 * - Zod BE è source of truth
 */
export function buildBusinessCreateSchedaPayload(
  data: ConfigurationSetupStoreDTO
): BusinessCreateSchedaPayload {
  if (!data.businessName) {
    throw new Error("BUSINESS_NAME_REQUIRED");
  }

  if (!data.solutionId || !data.productId) {
    throw new Error("COMMERCIAL_ORIGIN_REQUIRED");
  }

  if (!data.email) {
    throw new Error("EMAIL_REQUIRED");
  }

  return {

    businessName: data.businessName.trim(),

    solutionId: data.solutionId,
    productId: data.productId,

    businessOpeningHour: data.openingHours ?? {},

    contact: {
      address: {
        street: data.address ?? undefined,
        city: data.city ?? undefined,
        province: data.state ?? undefined,
        zip: data.zip ?? undefined,
      },
      phoneNumber: data.phone ?? undefined,
      mail: data.email,
    },

    businessDescriptionTags: data.businessDescriptionTags ?? [],
    businessServiceTags: data.businessServiceTags ?? [],

   

  };
}
