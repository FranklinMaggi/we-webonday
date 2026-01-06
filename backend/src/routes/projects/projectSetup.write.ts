/**
 * ======================================================
 * PROJECT SETUP — WRITE SIDE (POST-CHECKOUT)
 * File: backend/src/routes/projects/projectSetup.write.ts
 * ======================================================
 *
 * COSA È:
 * - Configurazione OPERATIVA del progetto
 * - Inserita DOPO l’acquisto
 * - Usata per l’esecuzione del servizio
 *
 * COSA NON È:
 * - NON è un ordine
 * - NON è un atto economico
 * - NON influisce su prezzi o pagamento
 *
 * RELAZIONE:
 * - Associato a un CheckoutOrder / EconomicOrder tramite orderId
 * - Persistito separatamente in KV
 *
 * SOURCE OF TRUTH:
 * - ProjectSetupSchema
 *
 * KV UTILIZZATO:
 * - PROJECT_SETUP:{orderId}
 *
 * ======================================================
 */

import type { Env } from "../../types/env";
import { json } from "../../lib/https";

/**
 * ProjectSetupSchema
 * --------------------------------------
 * Schema della configurazione operativa post-vendita.
 */
import { OrderSetupSchema } from "../../schemas/core/projectSetupSchema";

/* ======================================================
   POST /api/projects/setup
   SAVE PROJECT SETUP
====================================================== */
/**
 * Salva o aggiorna la configurazione di un progetto
 * associata a un ordine già effettuato.
 *
 * ERRORI:
 * - 400 → orderId mancante o payload invalido
 * - 405 → metodo non consentito
 */
export async function saveProjectSetup(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== "POST") {
    return json(
      { ok: false, error: "METHOD_NOT_ALLOWED" },
      request,
      env,
      405
    );
  }

  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) {
    return json(
      { ok: false, error: "MISSING_ORDER_ID" },
      request,
      env,
      400
    );
  }

  let body;
  try {
    body = OrderSetupSchema.parse(await request.json());
  } catch (err) {
    return json(
      { ok: false, error: "INVALID_PROJECT_SETUP", details: err },
      request,
      env,
      400
    );
  }

  await env.ORDER_KV.put(
    `PROJECT_SETUP:${orderId}`,
    JSON.stringify({
      ...body,
      updatedAt: new Date().toISOString(),
    })
  );

  return json({ ok: true }, request, env);
}
