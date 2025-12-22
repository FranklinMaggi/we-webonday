import type { BusinessDTO } from "../dto/businessDTO";
import type { BusinessPublicDTO } from "../dto/businessPublicDTO";

export function normalizeBusinessPublic(
  business: BusinessDTO
): BusinessPublicDTO {
  return {
    id: business.id,
    name: business.name,
    address: business.address,
    phone: business.phone,
    openingHours: business.openingHours ?? null,
    menuPdfUrl: business.menuPdfUrl,
  };
}
