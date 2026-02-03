// ======================================================
// DOMAIN || LEGAL || VISITOR (CANONICAL)
// ======================================================
//
// RUOLO:
// - Rappresenta un visitor anonimo (soft identity)
// - Usato SOLO per continuità di navigazione
//
// INVARIANTI:
// - Nessuna PII
// - Nessun userId
// - Nessun consenso giuridicamente vincolante
// - Nessuna persistenza obbligatoria
//
// NOTE:
// - Questo schema NON rappresenta un'entità DB
// - È uno snapshot runtime / opzionalmente serializzabile
// ======================================================

import { z } from "zod";

export const VisitorSchema = z.object({
  /** Identificatore tecnico anonimo */
  visitorId: z.string().min(12),

  /** Timestamp creazione visitor */
  createdAt: z.string().datetime(),

  /** Ultima interazione */
  lastSeenAt: z.string().datetime(),
});

export type VisitorDTO = z.infer<typeof VisitorSchema>;