// FE || lib/products/productsApi.ts
// ======================================================
// PRODUCTS API — DOMAIN PRODUCTS
// ======================================================
//
// CONNECT POINT:
// - Consuma API CORE /api/products
// - L’API ritorna { ok: boolean, products: ProductDTO[] }
//
// PERCHE:
// - Il backend wrappa sempre le risposte
// - Qui estraiamo solo ciò che serve al FE
//
// ======================================================

import type { ProductDTO } from "../../dto/productDTO";
import { API_BASE } from "../config";

/* =========================
   FETCH ALL PRODUCTS
========================= */
export async function fetchProducts(): Promise<ProductDTO[]> {
  const res = await fetch(`${API_BASE}/api/products`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Products fetch failed (${res.status})`);
  }

  const data = await res.json();

  // PERCHE: il backend ritorna sempre un wrapper { ok, products }
  if (!data?.ok || !Array.isArray(data.products)) {
    throw new Error("Invalid products response shape");
  }

  return data.products;
}

/* =========================
   FETCH SINGLE PRODUCT
========================= */
export async function fetchProduct(id: string): Promise<ProductDTO> {
  const res = await fetch(
    `${API_BASE}/api/product?id=${encodeURIComponent(id)}`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) {
    throw new Error(`Product fetch failed (${res.status})`);
  }

  const data = await res.json();

  if (!data?.ok || !data.product) {
    throw new Error("Invalid product response shape");
  }

  return data.product;
}
