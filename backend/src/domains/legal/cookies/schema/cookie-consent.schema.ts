// ======================================================
// DOMAIN || LEGAL || COOKIE CONSENT SCHEMA
// ======================================================
//
// RUOLO:
// - Rappresenta il consenso cookie GDPR-compliant
// - È la BASE per la creazione dello userId
//
// INVARIANTI:
// - version obbligatoria
// - timestamp obbligatorio
// - categorie esplicite
// ======================================================

import { z } from "zod";

export const CookieCategoriesSchema = z.object({
  necessary: z.literal(true), // sempre true
  preferences: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export const CookieConsentSchema = z.object({
  version: z.string().min(1),           // es: "cookie_v1"
  acceptedAt: z.string().datetime(),    // ISO
  expiresAt: z.string().datetime(),     // ISO
  categories: CookieCategoriesSchema,
  locale: z.string().optional(),        // es: it-IT
});

export type CookieConsentDTO = z.infer<typeof CookieConsentSchema>;