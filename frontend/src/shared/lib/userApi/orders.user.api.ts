/**
 * ======================================================
 * FE || src/lib/orders.user.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - API FE per la creazione ORDINI lato USER / VISITOR
 *
 * RESPONSABILITÀ:
 * - Inviare al backend la richiesta di creazione ordine
 * - Trasmettere i dati minimi necessari (visitor / policy)
 * - Restituire l’identificativo ordine generato dal BE
 *
 * NON FA:
 * - NON calcola prezzi
 * - NON valida contenuti del carrello
 * - NON gestisce pagamenti
 * - NON gestisce stato ordine (delegato al backend)
 *
 * INVARIANTI:
 * - Usa session cookie (credentials: include)
 * - Nessun token admin
 * - Nessun userId deciso dal FE (backend source of truth)
 *
 * RELAZIONE CON BACKEND:
 * - Endpoint: POST /api/order
 * - Il backend:
 *   • genera orderId
 *   • valida policyVersion
 *   • associa visitor / user se presente
 *
 * RELAZIONE CON UI:
 * - La UI riceve solo { orderId }
 * - Ogni step successivo (setup, pagamento, stato)
 *   usa l’orderId come riferimento
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/orders.user.api.ts
 * - Evoluzione prevista:
 *   • supporto a payload più ricchi (configurationId)
 *   • distinzione visitor / user loggato
 *
 * NOTE:
 * - File volutamente minimale
 * - Backend = source of truth
 * ======================================================
 */

import { apiFetch } from "../api";

export type CreateOrderPayload = {
  visitorId: string;
  email: string;
  policyVersion: string;
};

/**
 * POST /api/order
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<{ orderId: string }> {
  const res = await apiFetch<{ orderId: string }>(
    "/api/order",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res || !res.orderId) {
    throw new Error("Invalid order creation response");
  }

  return res;
}

