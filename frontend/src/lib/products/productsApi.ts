// FE || lib/products/productsApi.ts
// ======================================================
// PRODUCTS API — DOMAIN PRODUCTS (PUBLIC)
// ======================================================
//
// RUOLO:
// - Consuma API /api/products/with-options
// - Normalizza i dati ADMIN → PUBLIC
//
// PERCHE:
// - Admin e Public hanno DTO diversi (VOLUTO)
// - Il FE pubblico NON deve conoscere:
//   - payment.mode
//   - payment.interval
//   - optionIds
//
// ======================================================

import type { ProductDTO, ProductOptionDTO } from "../../dto/productDTO";
import { API_BASE } from "../config";

/* ======================================================
   NORMALIZER — OPTION (ADMIN → PUBLIC)
====================================================== */
function normalizeOption(adminOpt: any): ProductOptionDTO {
  return {
    id: adminOpt.id,
    label: adminOpt.label,
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
