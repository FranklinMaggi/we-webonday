/**
 * ======================================================
 * FE || Product — VIEW MODEL (PUBLIC)
 * ======================================================
 *
 * RUOLO:
 * - Modello dati usato dalla UI pubblica
 * - Source of truth FE per il comportamento del Product
 *
 * USATO DA:
 * - Catalogo
 * - ProductCard
 * - Cart
 * - Checkout
 *
 * DECISIONE DI DOMINIO (CRITICA):
 * - È il Product a decidere il flusso utente
 * - requiresConfiguration = false → checkout diretto
 * - requiresConfiguration = true  → configuratore
 *
 * NOTE:
 * - UI-first
 * - Nessuna conoscenza del backend
 * - Nessuna logica di business complessa
 * ======================================================
 */

export interface ProductPricingVM {
  /**
   * Prezzo ricorrente annuale
   * (mostrato a UI, NON calcolato qui)
   */
  yearly: number;

  /**
   * Prezzo ricorrente mensile
   */
  monthly: number;
}
export type RecurringType = "monthly"|"yearly"|"one_time";
export interface ProductOptionVM {
  id: string;
  label: string;
  price: number;
  description:string; 

  /**
   * Dominio PUBLIC:
   * - tutte le option sono recurring
   * - billing mensile
   */
  type: RecurringType;
}

export interface ProductVM {
  /**
   * Identificativo univoco prodotto
   */
  id: string;

  /**
   * Copy marketing
   */
  name: string;
  description: string;

  /**
   * Costo di avvio una tantum
   */
  startupFee: number;

  /**
   * Pricing ricorrente
   */
  pricing: ProductPricingVM;

  options?: ProductOptionVM[];
  requiresConfiguration: boolean;
}
