/**
 * ======================================================
 * FE || src/lib/products/productsApi.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PUBLIC)
 *
 * RUOLO:
 * - API FE per il catalogo PRODOTTI pubblico
 *
 * CONTESTO:
 * - Usata da visitor e user non admin
 *
 * RESPONSABILITÀ:
 * - Recuperare prodotti con opzioni
 * - Normalizzare dati ADMIN → PUBLIC
 *
 * NON FA:
 * - NON gestisce auth
 * - NON espone campi sensibili admin
 * - NON calcola pricing
 *
 * INVARIANTI:
 * - Nessun token
 * - Nessun dato admin-sensitive
 * - Backend = source of truth
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/publicApi/products.public.api.ts
 * - Refactor:
 *   • uso apiFetch
 *   • separazione netta public/admin DTO
 *
 * NOTE:
 * - Normalizzazione VOLUTA
 * - Protezione del dominio admin
 * ======================================================
 */
import { API_BASE } from "../../../../../lib/config";
import type { ProductVM } from "../../../../../lib/viewModels/product/Product.view-model";
import { normalizeAdminProductToPublic } from "../../../../../lib/normalizers/product.admin-to-public";

/* =========================
   FETCH ALL PRODUCTS (PUBLIC)
========================= */
export async function fetchProducts(): Promise<ProductVM[]> {
  const res = await fetch(`${API_BASE}/api/products/with-options`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Products fetch failed (${res.status})`);
  }

  const data = await res.json();

  if (!data?.ok || !Array.isArray(data.products)) {
    throw new Error("Invalid products response shape");
  }

  return data.products.map(normalizeAdminProductToPublic);
}

/* =========================
   FETCH SINGLE PRODUCT (PUBLIC)
========================= */
export async function fetchProduct(
  id: string
): Promise<ProductVM> {
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

  return normalizeAdminProductToPublic(data.product);
}
