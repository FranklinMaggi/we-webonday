import { z } from "zod";

export const FoodCategorySchema = z.object({
  id: z.string(),              // "pizza"
  label: z.string(),           // "Pizza"
  allowedIngredientCategories: z.array(z.string()),
  enabled: z.boolean().default(true),
});

export type FoodCategoryDTO = z.infer<typeof FoodCategorySchema>;
