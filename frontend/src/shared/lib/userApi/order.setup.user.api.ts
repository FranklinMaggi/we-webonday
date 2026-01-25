/**
 * ======================================================
 * FE || src/lib/orders/order.setup.user.api.ts/lib/userAPi
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (POST-ORDER)
 *
 * RUOLO:
 * - API FE per salvare i dati di setup ordine
 *
 * CONTESTO:
 * - Chiamata DOPO la creazione dell’ordine
 * - Prima del pagamento
 *
 * RESPONSABILITÀ:
 * - Inviare al backend i dati di configurazione finale
 * - Associare i dati all’orderId esistente
 *
 * NON FA:
 * - NON crea ordini
 * - NON calcola prezzi
 * - NON valida i dati di setup
 *
 * INVARIANTI:
 * - orderId è SEMPRE generato dal backend
 * - credentials: include (visitor / user)
 * - Backend = source of truth
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 * - Import path fragile verso pagine UI
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/orders.setup.user.api.ts
 * - Refactor:
 *   • sostituire fetch con apiFetch
 *   • isolare DTO dal layer UI
 *
 * NOTE:
 * - File volutamente minimale
 * - Da NON estendere senza audit di flusso checkout
 * ======================================================
 */

import { apiFetch } from "../api";

/**
 * POST /api/order/setup?orderId=XXX
 */

type OrderSetupPayload = Record<string, unknown>;
export async function saveOrderSetup(
  orderId: string,
  data: OrderSetupPayload
): Promise<unknown> {
  const res = await apiFetch<unknown>(
    `/api/order/setup?orderId=${orderId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (res === null) {
    throw new Error("Invalid order setup response");
  }

  return res;
}
