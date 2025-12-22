
export type LegacyPriceContext = "pizza" | "puccia" | "senza_puccia";

export interface LegacyIngredientPrice {
  aggiungi?: Partial<Record<LegacyPriceContext, number>>;
  togli?: Partial<Record<LegacyPriceContext, number>>;
}

export interface LegacyIngredient {
  id: string;
  nome: string;
  tipo: string;

  modificabile?: boolean;
  disponibile?: boolean;

  allergeni?: string[];

  extra_pizza?: boolean;
  extra_puccia?: boolean;
  extra_senza_puccia?: boolean;

  prezzo?: LegacyIngredientPrice;
}
