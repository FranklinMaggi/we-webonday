import { useEffect, useState } from "react";
import { apiFetch } from "../../../shared/lib/api";

export type ProductOptionDTO = {
  id: string;
  name: string;
  price: number;
  type: "one_time" | "monthly" | "yearly";
};

export type ProductWithOptionsDTO = {
  id: string;
  name: string;
  description?: string;
  nameKey?: string;
  descriptionKey?: string;
  status: "ACTIVE";
  configuration: unknown;
  startupFee?: number;
  pricing?: unknown;
  options: ProductOptionDTO[];
};

export function useActiveProductsWithOptions() {
  const [products, setProducts] = useState<ProductWithOptionsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{
      ok: true;
      products: ProductWithOptionsDTO[];
    }>("/api/products/with-options")
      .then((res) => {
        if (!res?.ok) {
          throw new Error("INVALID_RESPONSE");
        }
        setProducts(res.products);
      })
      .catch(() => {
        setError("Errore caricamento prodotti");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    products,
    loading,
    error,
  };
}
