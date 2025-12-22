// backend/src/normalizers/normalizeIngredients.ts

import { IngredientCatalogSchema } from "../schemas/food/ingredientCatalogSchema";
import { mapIngredientCategory } from "../scripts/food/mapIngredientCategory";

// IMPORT ESPLICITO DEL DATASET LEGACY

/**
 * STEP A
 * Normalizza ingredienti legacy in catalogo globale
 * Source of truth: data.js → ingredientiBaseGlobal
 */
export function normalizeIngredients() {
  const source = pucciariaData.ingredientiBaseGlobal;

  return source.map((item: any) => {
    // Prezzi legacy: prendi il massimo tra i contesti (pizza, puccia, senza_puccia)
    const prices = item.prezzo?.aggiungi ?? {};
    const suggestedPrice = Math.max(
      ...Object.values(prices).map((v: any) => Number(v ?? 0)),
      0
    );

    const normalized = {
      id: item.id,
      label: item.nome,
      category: mapIngredientCategory(item.tipo),
      allergens: item.allergeni ?? [],
      suggestedPrice,
      removable: item.modificabile !== false,
      tenantId: null,                 // catalogo globale
      enabled: item.disponibile !== false,
    };

    // 🔒 VALIDAZIONE STRUTTURALE
    return IngredientCatalogSchema.parse(normalized);
  });
}
