// ======================================================
// FE || PROFILE || OWNER DRAFT
// ======================================================

import { apiFetch } from "@shared/lib/api";

export async function createOwnerDraft(payload: any) {
  const res = await apiFetch<{ ok: boolean }>(
    "/api/owner/create-draft",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res?.ok) {
    throw new Error("OWNER_DRAFT_CREATE_FAILED");
  }
}
