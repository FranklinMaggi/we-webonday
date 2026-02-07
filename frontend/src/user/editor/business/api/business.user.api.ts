import { apiFetch } from "../../../../shared/lib/api";

export type BusinessVerificationStatus =
  | "DRAFT"
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export type BusinessSummaryDTO = {
  businessId: string;

  // === IDENTITÀ ===
  name: string;
  publicId: string;            // slug → mattoni.webonday.it

  // === STATO ===
  status: "DRAFT" | "PENDING" | "active" | "suspended";
  verification: BusinessVerificationStatus;

  // === COMPLETEZZA DATI ===
  businessDataComplete: boolean;

  // === COLLEGAMENTO SITO ===
  configurationId?: string;    // esiste solo se il sito è stato creato

  // === META ===
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

