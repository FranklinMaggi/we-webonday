/**
 * ======================================================
 * FE || CartItem — STORE MODEL (ALIGNED BE)
 * ======================================================
 *
 * RUOLO:
 * - Riflesso ESATTO del Cart BE
 * - Intento di acquisto (slot unico)
 *
 * CONTIENE:
 * - productId
 * - configurationId
 *
 * NON CONTIENE:
 * - pricing
 * - label
 * - title
 * - options
 * ======================================================
 */

export interface CartItem {
  productId: string;
  configurationId: string;
  quantity: 1;
}
