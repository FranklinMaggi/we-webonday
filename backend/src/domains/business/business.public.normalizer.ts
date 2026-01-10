import type { BusinessInternalDTO } from "./business.internal.dto";
import type { BusinessPublicDTO } from "./business.public.dto";

/**
 * ======================================================
 * DOMAIN || BUSINESS || PUBLIC NORMALIZER
 * ======================================================
 *
 * RUOLO:
 * - Trasforma BusinessInternalDTO in BusinessPublicDTO
 * - Garantisce esposizione SOLO di campi sicuri
 *
 * USATO DA:
 * - routes/public/business*
 *
 * NON FA:
 * - NON valida
 * - NON muta dati
 * ======================================================
 */
export function normalizePublicBusiness(
  internalDTO: BusinessInternalDTO
): BusinessPublicDTO {
  return {
    id: internalDTO.id,
    name: internalDTO.name,
    address: internalDTO.address,
    phone: internalDTO.phone,
    openingHours: internalDTO.openingHours ?? null,
    menuPdfUrl: internalDTO.menuPdfUrl,
  };
}
