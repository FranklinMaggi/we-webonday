// ======================================================
// FE || domains/business/api/business.owner.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — BUSINESS OWNER API (FRONTEND)
//
// RUOLO:
// - Layer FE → BE per il dominio Business Owner
// - Incapsula SOLO:
//   • owner draft (get / create-update)
//
// INVARIANTI:
// - ❌ FE NON invia contact primari
// - ❌ FE NON invia privacy
// - ❌ FE NON conferma owner
// - ✅ businessDraftId è l’unico ponte
// - ✅ apiFetch usa session cookie
//
// SOURCE OF TRUTH:
// - contact.email / phone → BusinessDraft (BE)
// - privacy → BusinessDraft (BE)
// ======================================================

import { apiFetch } from "../../../../../lib/api";

/* ======================================================
   DTO — INPUT (FE → BE)
====================================================== */

export interface BusinessOwnerDraftInputDTO {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO yyyy-mm-dd
  source?:string; 
  contact?: {
    secondaryMail?: string;
  };

}

/* ======================================================
   DTO — OUTPUT (BE → FE)
====================================================== */

export interface BusinessOwnerDraftDTO {
  id: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string;


 
}

export async function createBusinessOwnerDraft(
  payload: BusinessOwnerDraftInputDTO
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch<{
      ok: boolean;
      error?: string;
    }>("/api/owner/create-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res?.ok) {
      return {
        ok: false,
        error:
          res?.error ??
          "OWNER_DRAFT_CREATE_FAILED",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error(
      "[OWNER_API][CREATE_DRAFT][ERROR]",
      err
    );
    return {
      ok: false,
      error: "NETWORK_ERROR",
    };
  }
}

/* ======================================================
   GET — OWNER DRAFT
   GET /api/business/owner/draft?businessDraftId=
====================================================== */

export async function getBusinessOwnerDraft(
  businessDraftId: string
): Promise<BusinessOwnerDraftDTO | null> {
  if (!businessDraftId) {
    console.warn(
      "[OWNER_API][GET_DRAFT] missing businessDraftId"
    );
    return null;
  }

  try {
    const res = await apiFetch<{
      ok: boolean;
      owner?: BusinessOwnerDraftDTO;
    }>(
      `/api/business/owner/get-draft`,
      { method: "GET" }
    );

    if (!res?.ok || !res.owner) {
      return null;
    }

    return res.owner;
  } catch (err) {
    console.error(
      "[OWNER_API][GET_DRAFT][ERROR]",
      err
    );
    return null;
  }
}

/* ======================================================
   POST — CREATE / UPDATE OWNER DRAFT
   POST /api/business/owner/create-draft
====================================================== */

