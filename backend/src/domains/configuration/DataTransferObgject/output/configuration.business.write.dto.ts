// ======================================================
// BE || ConfigurationBusinessWriteDto
// ======================================================
//
// RUOLO:
// - Scrittura STEP BUSINESS
// - Collega Business reale
//
// INVARIANTI:
// - Policy già accettata
// - Business già creato
// ======================================================

import { z } from "zod";

export const ConfigurationBusinessWriteSchema = z.object({
  configurationId: z.string().min(1),

  businessId: z.string().min(1),
});

export type ConfigurationBusinessWriteDto =
  z.infer<typeof ConfigurationBusinessWriteSchema>;
