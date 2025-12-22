import { z } from "zod";

export const IngredientCategorySchema = z.enum([
  "base",
  "cheese",
  "protein",
  "vegetable",
  "sauce",
  "extra",
  "other",
]);

export const IngredientCatalogSchema = z.object({
  id: z.string(),                 // es: "mozzarella"
  label: z.string(),              // "Mozzarella"
  category: IngredientCategorySchema,
  allergens: z.array(z.string()).optional(),
  suggestedPrice: z.number().nonnegative().default(0), // prezzo guida
  removable: z.boolean().default(true),
  tenantId: z.string().nullable(), // null = piattaforma, string = custom tenant
  enabled: z.boolean().default(true),
});

export type IngredientCatalogDTO = z.infer<typeof IngredientCatalogSchema>;
