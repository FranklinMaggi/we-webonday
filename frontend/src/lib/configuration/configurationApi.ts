// ======================================================
// FE || lib/configurationApi.ts
// ======================================================
//
// CONFIGURATION API — FE ⇄ BE
//
// RUOLO:
// - Persistenza draft configurazione
//
// INVARIANTI:
// - Usa sempre configurationId
// - credentials: include

import { API_BASE } from "../config";

// ======================================================

export async function updateConfiguration(
    configurationId: string,
    payload: unknown
  ) {
    const res = await fetch(
      `${API_BASE}/api/configuration/${configurationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        "Errore salvataggio configurazione: " + text
      );
    }
  
    return res.json();
  }
  