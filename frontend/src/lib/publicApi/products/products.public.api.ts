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

import type { ProductDTO, ProductOptionDTO } from "../../dto/productDTO";
import { API_BASE } from "../../config";

/* ======================================================
   NORMALIZER — OPTION (ADMIN → PUBLIC)
====================================================== */
function normalizeOption(adminOpt: any): ProductOptionDTO {
  return {
    id: adminOpt.id,
    // 🔑 MAPPING DOMINIO → UI
    label:
      adminOpt.label ??
      adminOpt.name ??
      adminOpt.title ??
      adminOpt.code ??
      "Opzione",
    price: adminOpt.price,

    // 🔒 HARD-CODED: monthly only
    type: "monthly",
  };
}

/* ======================================================
   NORMALIZER — PRODUCT (ADMIN → PUBLIC)
====================================================== */
function normalizeProduct(raw: any): ProductDTO {
  return {
    ...raw,

    // GARANZIA: options esiste sempre nel FE
    options: Array.isArray(raw.options)
      ? raw.options.map(normalizeOption)
      : [],
  };
}

/* =========================
   FETCH ALL PRODUCTS
========================= */
export async function fetchProducts(): Promise<ProductDTO[]> {
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

  // 🔑 NORMALIZZAZIONE DOMINIO PUBLIC
  return data.products.map(normalizeProduct);
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

  // 🔑 NORMALIZZAZIONE DOMINIO PUBLIC
  return normalizeProduct(data.product);
}
