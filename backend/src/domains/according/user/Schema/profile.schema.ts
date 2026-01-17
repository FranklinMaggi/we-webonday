// =======================================================
// BE || domains/user/user.schema.ts
// User profile (NO identity, NO auth)
// =======================================================

import { z } from "zod";

/**
 * USER PROFILE
 * -------------------------------------------------------
 * PERCHÉ dominio:
 * - separa chiaramente identity (auth) da profile (dati utente)
 * - il profilo può essere vuoto alla creazione
 * - cresce nel tempo (onboarding, business, checkout)
 *
 * PERCHÉ UI:
 * - form modulari
 * - step-by-step
 * - patch parziali senza obblighi
 */
export const userProfile = z.object({
  // ===============================
  // PROFILO PERSONALE
  // ===============================
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),


  // ===============================
  // INDIRIZZO
  // ===============================
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export type UserProfile = z.infer<typeof userProfile>;
