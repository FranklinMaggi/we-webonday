/**
 * ======================================================
 * FE || Product — VIEW MODEL (PUBLIC)
 * ======================================================
 *
 * RUOLO:
 * - Modello dati usato dalla UI pubblica
 *
 * USATO DA:
 * - Catalogo
 * - Carrello
 * - Checkout
 *
 * NOTE:
 * - UI-first
 * - Nessuna conoscenza del backend
 * ======================================================
 */

export interface ProductPricingVM {
  yearly: number;
  monthly: number;
}

export interface ProductOptionVM {
  id: string;
  label: string;
  price: number;

  /**
   * Dominio PUBLIC:
   * - sempre recurring
   * - sempre monthly
   */
  type: "monthly";
}

export interface ProductVM {
  id: string;

  name: string;
  description: string;

  startupFee: number;
  pricing: ProductPricingVM;

  options: ProductOptionVM[];
}
