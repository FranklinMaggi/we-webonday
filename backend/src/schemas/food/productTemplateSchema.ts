import { z } from "zod";

export const ProductTemplateSchema = z.object({
  id: z.string(),                  // "pizza-margherita"
  title: z.string(),
  description: z.string().optional(),

  baseIngredients: z.array(z.string()), // ingredientId inclusi
  allowedCategories: z.array(z.string()), // categorie consentite

  suggestedBasePrice: z.number().nonnegative(),
  flags: z.array(z.string()).default([]), // veg, spicy, etc

  tenantType: z.enum(["food", "sport", "professional"]),
  enabled: z.boolean().default(true),
});

export type ProductTemplateDTO = z.infer<typeof ProductTemplateSchema>;
