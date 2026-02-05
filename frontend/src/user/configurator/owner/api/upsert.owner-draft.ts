// ======================================================
// FE || DOMAIN || OWNER || OWNER DRAFT API
// ======================================================
//
// RUOLO:
// - Layer FE → BE per OwnerDraft
// - Create / Update / Read OwnerDraft
//
// INVARIANTI:
// - FE NON conferma owner
// - FE NON gestisce KYC
// - Session cookie obbligatorio
//
// SOURCE OF TRUTH:
// - OwnerDraftSchema (BE)
// ======================================================

import { apiFetch } from "@shared/lib/api";
import { type OwnerDraftInputDTO } from "../DataTransferObject/owner-draft.input.dto";

/* ======================================================
   CREATE / UPDATE OWNER DRAFT
   POST /api/owner/create-draft
====================================================== */

export async function upsertOwnerDraft(
  payload: OwnerDraftInputDTO
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    
    const res = await apiFetch<{ ok: boolean; error?: string }>(
      "/api/owner/create-draft",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!res?.ok) {
      return {
        ok: false,
        error: res?.error ?? "OWNER_DRAFT_UPSERT_FAILED",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[OWNER_DRAFT_API][UPSERT][ERROR]", err);
    return { ok: false, error: "NETWORK_ERROR" };
  }
}
