/**
 * ======================================================
 * BE || PAYMENT || PAYPAL — AUTH
 * File: backend/src/routes/payment/paypal/paypal.auth.ts
 * ======================================================
 *
 * RUOLO:
 * - Ottenere Access Token OAuth PayPal
 *
 * NOTA:
 * - Nessuna logica ordine
 * - Nessun accesso KV
 */

import type { Env } from "../../../types/env";
import type { PaypalAccessTokenResponse } from "./paypal.types";

export async function getPaypalAccessToken(env: Env): Promise<string> {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET || !env.PAYPAL_API_BASE) {
    throw new Error("PAYPAL_CONFIG_MISSING");
  }

  const creds = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);

  const res = await fetch(`${env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PAYPAL_AUTH_FAILED");

  const data = (await res.json()) as PaypalAccessTokenResponse;
  return data.access_token;
}
