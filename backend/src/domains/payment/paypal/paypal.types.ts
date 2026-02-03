/**
 * ======================================================
 * BE || PAYMENT || PAYPAL — TYPES
 * File: backend/src/routes/payment/paypal/paypal.types.ts
 * ======================================================
 *
 * RUOLO:
 * - Centralizzare tipi PayPal
 * - Evitare duplicazioni negli handler
 */

import { z } from "zod";

/* =========================
   INPUT API
========================= */

export const CreatePaypalOrderBody = z.object({
  orderId: z.string().uuid(),
});

export const CapturePaypalOrderBody = z.object({
  orderId: z.string().uuid(),
});

/* =========================
   PAYPAL DOMAIN TYPES
========================= */

export type PaypalAccessTokenResponse = {
  access_token: string;
};

export type PaypalCreateOrderResponse = {
  id: string;
};
