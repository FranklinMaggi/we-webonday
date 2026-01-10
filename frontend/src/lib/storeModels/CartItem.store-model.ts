/**
 * ======================================================
 * FE || CartItem — STORE MODEL
 * ======================================================
 *
 * RUOLO:
 * - Modello persistente del carrello FE
 *
 * NOTE:
 * - NON è un ViewModel
 * - NON dipende da ProductVM
 * - Deve essere serializzabile
 * ======================================================
 */

export interface CartOption {
    id: string;
    label: string;
    price: number;
  
    // dominio carrello: solo monthly
    type: "monthly";
  }
  
  export interface CartItem {
    /** 🔑 contesto commerciale */
    solutionId: string;
  
    productId: string;
    title: string;
  
    startupFee: number;
    yearlyFee: number;
    monthlyFee: number;
  
    options: CartOption[];
  }
  