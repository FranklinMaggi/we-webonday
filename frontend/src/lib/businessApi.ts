import { apiFetch } from "./api";
import type { BusinessDTO } from "./dto/businessDTO";

/**
 * GET /api/business/mine
 */
export function getMyBusiness(userId: string) {
  return apiFetch<{
    ok: boolean;
    business: BusinessDTO | null;
  }>(`/api/business/mine?userId=${userId}`);
}

/**
 * POST /api/business/create
 */
export function createBusiness(payload: {
  ownerUserId: string;
  name: string;
  address: string;
  phone: string;
  openingHours?: string;
}) {
  return apiFetch<{
    ok: boolean;
    business: BusinessDTO;
  }>("/api/business/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/business/menu/upload
 */
export function uploadBusinessMenu(
  businessId: string,
  file: File
) {
  const form = new FormData();
  form.append("file", file);

  return apiFetch<{
    ok: boolean;
    businessId: string;
    menuPdfUrl: string;
    status: "active";
  }>(`/api/business/menu/upload?businessId=${businessId}`, {
    method: "POST",
    body: form,
  });
}
