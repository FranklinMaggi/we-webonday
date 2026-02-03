// ======================================================
// DOMAIN || LEGAL || POLICY ACCEPTANCE
// ======================================================
//
// RUOLO:
// - Traccia accettazione Privacy / T&C
// - Versionata
//
// NOTA:
// - NON è opzionale per configuration
// ======================================================

import { z } from "zod";

export const PolicyAcceptanceSchema = z.object({
  policyType: z.enum([
    "PRIVACY",
    "TERMS",
    "COOKIE_POLICY",
  ]),
  version: z.string().min(1),         // es: "privacy_v3"
  acceptedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
});

export type PolicyAcceptanceDTO =
  z.infer<typeof PolicyAcceptanceSchema>;