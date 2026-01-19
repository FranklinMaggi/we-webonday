// ======================================================
// BE || domains/configuration/schema/configuration.base.schema.ts
// ======================================================
//
// RUOLO:
// - Input MINIMO dal BuyFlow pre-login
// - Seed iniziale della Configuration
//
// INVARIANTI:
// - NON crea Business
// - NON scrive in BUSINESS_KV
// - NON valida policy
// ======================================================

import { z } from "zod";

export const ConfigurationBaseInputSchema = z.object({
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  // PREFILL VISITOR (non certificato)
  businessName: z.string().min(2).max(80),
});

export type ConfigurationBaseInput = z.infer<
  typeof ConfigurationBaseInputSchema
>;
