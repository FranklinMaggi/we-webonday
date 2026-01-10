import { z } from "zod";

export const TenantIngredientOverrideSchema = z.object({
  ingredientId: z.string(),
  price: z.number().nonnegative(),
  enabled: z.boolean().default(true),
});

export const TenantProductOverrideSchema = z.object({
  templateId: z.string(),
  basePrice: z.number().nonnegative(),
  enabled: z.boolean().default(true),
});

export type TenantIngredientOverrideDTO =
  z.infer<typeof TenantIngredientOverrideSchema>;

export type TenantProductOverrideDTO =
  z.infer<typeof TenantProductOverrideSchema>;
