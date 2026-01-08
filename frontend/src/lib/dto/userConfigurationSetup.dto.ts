/**
 * ======================================================
 * FE || DTO — USER CONFIGURATION SETUP
 * ======================================================
 *
 * RUOLO:
 * - Contratto dati PRE-ORDER per configurazione progetto
 *
 * USATO DA:
 * - Zustand store (UI)
 * - userApi (order.setup)
 *
 * NON FA:
 * - NON contiene stato
 * - NON contiene logica
 * - NON dipende da React o Zustand
 * ======================================================
 */
export type UserConfigurationSetupDTO = {
  /* =========================
     BUSINESS
  ========================= */
  businessName: string;
  sector: string;

  address: string;
  city: string;
  state: string;
  zip: string;

  businessImage?: File | null;
  placeId?: string;

  /* =========================
     CONTACT
  ========================= */
  email: string;
  phone?: string;
  privacyAccepted: boolean;

  /* =========================
     COMMERCIAL CONTEXT
     (from cart)
  ========================= */
  solutionId: string;
  productId: string;
  optionIds: string[];

  /* =========================
     DESIGN / CONTENT
  ========================= */
  primaryColor: string;
  style: "modern" | "elegant" | "minimal" | "bold";

  description: string;
  services: string;
  cta: string;

  extras: {
    maps: boolean;
    whatsapp: boolean;
    newsletter: boolean;
  };
};

