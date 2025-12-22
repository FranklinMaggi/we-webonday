// backend/src/schemas/activitySchema.ts
import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),              // o hashId, se preferisci
  type: z.string(),                // "LOGIN", "ORDER_CREATED", ecc.
  timestamp: z.string(),           // ISO
  hash: z.string(),                // hash dell’evento/payload
  payload: z.record(z.any()).optional(), // minimale, anonimizzabile
});

export type ActivityDTO = z.infer<typeof ActivitySchema>;
