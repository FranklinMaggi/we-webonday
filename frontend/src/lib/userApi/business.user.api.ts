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

import { apiFetch } from "../api";

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
 * GET /api/business
 */
export async function listMyBusinesses(): Promise<{
  ok: true;
  businesses: BusinessSummaryDTO[];
}> {
  const res = await apiFetch<{
    ok: boolean;
    businesses: BusinessSummaryDTO[];
  }>("/api/business");

  if (!res) {
    throw new Error("API /api/business returned null");
  }

  return res as { ok: true; businesses: BusinessSummaryDTO[] };
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

