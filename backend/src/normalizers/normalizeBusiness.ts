import type { BusinessDTO } from "../dto/businessDTO";

/**
 * Normalizza business dal formato KV / storage
 * verso DTO consumabile dal frontend
 */
export function normalizeBusiness(raw: any): BusinessDTO {
  return {
    id: raw.id,
    ownerUserId: raw.ownerUserId,
    name: raw.name,
    address: raw.address,
    phone: raw.phone,
    openingHours: raw.openingHours ?? null,
    menuPdfUrl: raw.menuPdfUrl ?? null,
    referralToken: raw.referralToken,
    referredBy: raw.referredBy ?? null,
    status: raw.status,
    createdAt: raw.createdAt,
  };
}
