// ======================================================
// FE || lib/userApi/business.user.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — BUSINESS DOMAIN (USER SIDE)
//
// Backend = source of truth
// Questo layer:
// - normalizza
// - protegge la UI da null
// ======================================================

import { apiFetch } from "../../../../../../lib/api";

/* ======================================================
   TYPES
====================================================== */

export type BusinessSummaryDTO = {
  businessId: string;
  publicId: string;
  name: string;
  status: "draft" | "pending" | "active" | "suspended";
  createdAt: string;
};

export type CreateBusinessPayload = {
  name: string;
  address: string;
  phone?: string;
  openingHours?: Record<string, string>;

  solutionId: string;
  productId: string;
  optionIds: string[];
};

/* ======================================================
   API — USER BUSINESS
====================================================== */
/**
 * ======================================================
 * API — LIST MY BUSINESSES (USER)
 * GET /api/business
 *
 * RUOLO:
 * - Recupera tutti i business associati all’utente loggato
 *
 * BACKEND CONTRACT (SOURCE OF TRUTH):
 * {
 *   ok: true,
 *   items: BusinessSummaryDTO[]
 * }
 * ======================================================
 */

export async function listMyBusinesses(): Promise<{
  ok: true;
  items: BusinessSummaryDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: BusinessSummaryDTO[];
  }>("/api/business", {
    method: "GET",
  });

  // SAFETY GUARD — apiFetch non dovrebbe mai tornare null,
  // ma questa guardia evita crash silenziosi
  if (!res) {
    throw new Error("API /api/business returned null response");
  }

  return res;
}

/**
 * POST /api/business/create
 */
export async function createBusiness(
  payload: CreateBusinessPayload
): Promise<{
  ok: true;
  businessId: string;
  status: "draft";
}> {
  const res = await apiFetch<{
    ok: boolean;
    businessId: string;
    status: "draft";
  }>("/api/business/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res) {
    throw new Error("API /api/business/create returned null");
  }

  return res as {
    ok: true;
    businessId: string;
    status: "draft";
  };
}

/**
 * POST /api/business/menu/upload
 */
export async function uploadBusinessMenu(
  businessId: string,
  file: File
): Promise<{
  ok: true;
  businessId: string;
  menuPdfUrl: string;
  status: "pending";
}> {
  const form = new FormData();
  form.append("file", file);

  const res = await apiFetch<{
    ok: boolean;
    businessId: string;
    menuPdfUrl: string;
    status: "pending";
  }>(`/api/business/menu/upload?businessId=${businessId}`, {
    method: "POST",
    body: form,
    headers: {},
  });

  if (!res) {
    throw new Error("API /api/business/menu/upload returned null");
  }

  return res as {
    ok: true;
    businessId: string;
    menuPdfUrl: string;
    status: "pending";
  };
}
/* ======================================================
   GET BUSINESS (DETAIL — USER)
   GET /api/business/:id
====================================================== */

/* ======================================================
   GET BUSINESS (DETAIL — USER)
   GET /api/business/:id
====================================================== */
export async function getBusiness(
  businessId: string
): Promise<{
  ok: boolean;
  business: {
    id: string;
    name: string;
    status: string;
    address: string;
    phone: string;
  };
}> {
  const res = await apiFetch<{
    ok: boolean;
    business: {
      id: string;
      name: string;
      status: string;
      address: string;
      phone: string;
    };
  }>(`/api/business/${businessId}`);

  if (!res) {
    throw new Error("Invalid response from GET /api/business/:id");
  }

  return res;
}

