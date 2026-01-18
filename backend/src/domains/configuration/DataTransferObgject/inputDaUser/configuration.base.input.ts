import { z } from "zod";

export const ConfigurationBaseInputSchema = z.object({
  solutionId: z.string().min(1),
  productId: z.string().min(1),
  businessName: z.string().min(2),
});

export type ConfigurationBaseInput = z.infer<
  typeof ConfigurationBaseInputSchema
>;
