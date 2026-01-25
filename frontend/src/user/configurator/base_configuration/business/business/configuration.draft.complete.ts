// ======================================================
// FE || domains/business/api/configuration.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION API
//
// RUOLO:
// - Orchestrazione Configuration (FE → BE)
//
// INVARIANTI:
// - Session cookie obbligatorio
// - FE NON passa ownerId
// - FE NON passa business data
// ======================================================

import { apiFetch } from "../../../../../shared/lib/api";

/* ======================================================
   INPUT DTO
====================================================== */

export interface AttachOwnerToConfigurationInputDTO {
  configurationId: string;
}

/* ======================================================
   POST — ATTACH OWNER
   POST /api/business/configuration/attach-owner
====================================================== */
export async function attachOwnerToConfiguration(
  payload: AttachOwnerToConfigurationInputDTO
): Promise<
  | { ok: true; configurationId?: string; status?: string }
  | { ok: false; error: string }
> {
  try {
    const res = await apiFetch<{
      ok: boolean;
      configurationId?: string;
      status?: string;
      error?: string;
    }>("/api/business/configuration/attach-owner", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // ❌ NON essere più rigidi del backend
    if (!res) {
      return { ok: false, error: "EMPTY_RESPONSE" };
    }

    if (res.ok === false) {
      return {
        ok: false,
        error: res.error ?? "CONFIGURATION_ATTACH_OWNER_FAILED",
      };
    }

    // ✅ OK è OK, anche se mancano campi opzionali
    return {
      ok: true,
      configurationId: res.configurationId,
      status: res.status,
    };
  } catch (err) {
    console.error(
      "[CONFIGURATION_API][ATTACH_OWNER][ERROR]",
      err
    );
    return {
      ok: false,
      error: "NETWORK_ERROR",
    };
  }
}
