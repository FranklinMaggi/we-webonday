// ======================================================
// DOMAIN || USER || LEGAL STATE
// ======================================================
//
// RUOLO:
// - Rappresenta lo stato legale dell’utente
// - GDPR-driven
//
// INVARIANTI:
// - privacy obbligatoria
// - versioning obbligatorio
// ======================================================

import { z } from "zod";
import { CookieConsentSchema } from "@domains/legal/cookies/schema/cookie-consent.schema";
import { PolicyAcceptanceSchema } from "@domains/legal/cookies/schema/policy.acceptance.schema";

export const UserLegalSchema = z.object({
  locale: z.string(),

  privacy: PolicyAcceptanceSchema, // obbligatoria
  terms: PolicyAcceptanceSchema.optional(),

  cookie: CookieConsentSchema.optional(),
});

export type UserLegalDTO = z.infer<typeof UserLegalSchema>;