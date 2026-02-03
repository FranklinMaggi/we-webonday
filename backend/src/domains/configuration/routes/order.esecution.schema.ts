/**
 * ======================================================
 * PROJECT SETUP — DOMAIN SCHEMA (V1)
 * ======================================================
 *
 * COSA RAPPRESENTA:
 * - Configurazione OPERATIVA del progetto
 * - Inserita DOPO un ordine pagato
 * - Usata per eseguire il servizio (design / contenuti)
 *
 * COSA NON È:
 * - NON è un ordine
 * - NON è un atto economico
 * - NON influisce su prezzi o pagamenti
 *
 * RELAZIONE:
 * - Associato a un EconomicOrder / CheckoutOrder tramite orderId
 * - Persistito separatamente (PROJECT_SETUP:{orderId})
 *
 * NOTE:
 * - Dominio MUTABILE
 * - Aggiornabile più volte
 *
 * ======================================================
 */


import { z } from "zod";

export const OrderSetupSchema = z.object({
  businessName: z.string().min(1),
  sector: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),

  primaryColor: z.string().min(1),
  style: z.enum(["modern", "elegant", "minimal", "bold"]),

  description: z.string().min(1),
  services: z.string().min(1),
  cta: z.string().min(1),

  extras: z.object({
    maps: z.boolean(),
    whatsapp: z.boolean(),
    newsletter: z.boolean(),
  }),
});

export type OrderSetupDTO = z.infer<typeof OrderSetupSchema>;
