// ======================================================
// BE || domains/configuration/configuration.schema.ts
// ======================================================
//
// CONFIGURATION — CORE DOMAIN (PRE-ORDER WORKSPACE)
//
// RUOLO:
// - Single Source of Truth della Configuration
// - È un workspace mutabile pre-ordine
//
// INVARIANTI:
// - Configuration ≠ Order
// - user derivato da sessione
// - KV keys deterministiche
//
// NOTE:
// - Manteniamo compatibilità con flussi esistenti:
//   • createConfigurationFromCart (che oggi non setta sempre id/userId)
//   • createConfiguration (che aggiunge createdAt/updatedAt manualmente)
// ======================================================


import { z } from "zod";


/* ======================================================
   CONFIGURATION STATUS — CANONICAL STATE MACHINE
   ====================================================== */

   export const CONFIGURATION_STATUS = [
    // =========================
    // BOOTSTRAP
    // =========================
    "DRAFT", 
    // Creata dal BuyFlow (Configuration BASE)
    // Contiene solo riferimenti minimi (solutionId, productId, businessName)
  
    // =========================
    // BUSINESS SETUP
    // =========================
    "BUSINESS_READY",
    // StepBusiness completato
    // Business aggiornato e referenziato correttamente
  
    // =========================
    // CONFIGURATION SETUP
    // =========================
    "CONFIGURATION_IN_PROGRESS",
    // L’utente sta lavorando nel configurator
    // Layout / design / contenuti in corso
  
    "CONFIGURATION_READY",
    // Tutti gli step obbligatori completati
    // Pronta per preview / validazione
  
    // =========================
    // PREVIEW & VALIDATION
    // =========================
    "PREVIEW",
    // Preview tecnica / cliente
    // Nessun vincolo commerciale ancora
  
    "ACCEPTED",
    // Il cliente accetta la configurazione
    // Blocco contenuti (immutabile)
  
    // =========================
    // COMMERCIALE
    // =========================
    "ORDERED",
    // Ordine effettuato
    // Checkout completato
  
    // =========================
    // POST-ORDER
    // =========================
    "IN_PRODUCTION",
    // Team / AI / pipeline in lavorazione
  
    "DELIVERED",
    // Progetto consegnato
  
    // =========================
    // TERMINALI / ECCEZIONI
    // =========================
    "CANCELLED",
    // Annullata manualmente
  
    "ARCHIVED",
    // Storico / sola lettura
  ] as const;
  

export type ConfigurationStatus =
  (typeof CONFIGURATION_STATUS)[number];

/* =========================
   WORKSPACE DATA (TIPIZZATA)
========================= */

export const ConfigurationWorkspaceSchema = z.object({
  // dati TEMPORANEI, UI-driven
  layoutId: z.string().optional(),
  themeId: z.string().optional(),

  // preview / engine
  lastPreviewAt: z.string().optional(),
});

/* =========================
   SCHEMA
========================= */
export const ConfigurationSchema = z.object({
  /* ---------- Identity (BE) ---------- */
  id: z.string().optional(),
  userId: z.string().optional(),
  businessId: z.string().optional(),

  /* ---------- Commercial origin ---------- */
  solutionId: z.string().min(1),
  productId: z.string().optional(),

  /* ---------- Options ---------- */
  options: z.array(z.string()).default([]),

  /* ---------- Workspace FE ---------- */
  data: ConfigurationWorkspaceSchema.default({}),

  /* ---------- Status ---------- */
  status: z.enum(CONFIGURATION_STATUS).default("DRAFT"),

  /* ---------- Timestamps ---------- */
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export type ConfigurationDTO = z.infer<typeof ConfigurationSchema>;
