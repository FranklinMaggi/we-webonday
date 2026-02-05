// ======================================================
// FE || PROFILE || VERIFICATION || ORCHESTRATOR
// ======================================================
//
// RUOLO:
// - UNICO punto che avvia la verifica
// - Chiamato SOLO dopo step 2 completato
//
// ======================================================

import { apiFetch } from "@shared/lib/api";

export async function startVerification(
  configurationId: string
) {
  if (!configurationId) {
    throw new Error("MISSING_CONFIGURATION_ID");
  }

  // 1️⃣ attach owner → configuration
  await apiFetch(
    "/api/business/configuration/derive-state",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );

  // 2️⃣ init owner verification
  await apiFetch(
    "/api/owner/verification/init",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );

  // 3️⃣ init business verification
  await apiFetch(
    "/api/business/verification/init",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );
}
