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
  businessName: string;
  sector: string;
  city: string;
  email: string;
  phone?: string;

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
