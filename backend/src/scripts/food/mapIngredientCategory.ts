import { IngredientCategorySchema } from "../../domains/schemas/legacy/schemas/food/ingredientCatalogSchema";

export function mapIngredientCategory(raw: string) {
  const key = raw.toLowerCase();

  if (["impasto", "base"].includes(key)) return "base";

  if (["formaggi", "formaggio"].includes(key)) return "cheese";

  if (
    ["salumi", "carne", "pesce", "crostacei"].includes(key)
  ) return "protein";

  if (
    ["verdure", "erbe aromatiche", "limone"].includes(key)
  ) return "vegetable";

  if (
    ["salse", "pesti", "olio"].includes(key)
  ) return "sauce";

  if (
    ["frutta secca", "sott'oli", "spezie"].includes(key)
  ) return "extra";

  return "other";
}
