/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || ACTIVITY || SCHEMA
======================================================

RUOLO:
- Rappresenta un evento di sistema (audit / tracking)
- Dominio append-only
- Usato per log, metriche, analisi

CASI D'USO:
- LOGIN
- ORDER_CREATED
- CHECKOUT_FINALIZED
- BUSINESS_CREATED
- ERROR_EVENT

INVARIANTI:
- Mai modificato dopo la creazione
- Mai cancellato
- payload deve essere anonimizzabile

NON È:
- NON è un log tecnico
- NON è una notifica
- NON è una metrica aggregata

STORAGE:
- KV / R2 / futuro DB (append-only)

IMPATTO MODIFICHE:
- Cambiare questo schema richiede audit
  di tutti i writer di eventi
====================================================== */

import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string().uuid(),

  // null per eventi di sistema
  userId: z.string().uuid().nullable(),

  // Es: "LOGIN", "ORDER_CREATED"
  type: z.string().min(1),

  // ISO timestamp dell’evento
  timestamp: z.string(),

  // hash del payload per dedup / audit
  hash: z.string(),

  // payload minimale e anonimizzabile
  payload: z.record(z.any()).optional(),
});

export type Activity = z.infer<typeof ActivitySchema>;
