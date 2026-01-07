// ======================================================
// FE || lib/adminApi/admin.products.api.ts
// ======================================================
// ADMIN PRODUCTS API
//
// RESPONSABILITÀ:
// - READ: admin (tutti gli stati)
// - WRITE: delegata al CORE (/api/products/register)
//
// ======================================================
/**
 * ======================================================
 * FE || src/lib/adminApi/products.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.1 (2026-01)
 *
 * STATO:
 * - CORE (con una sezione LEGACY da rimuovere)
 *
 * RUOLO:
 * - API FE per la gestione PRODOTTI in contesto ADMIN
 *
 * RESPONSABILITÀ:
 * - Recuperare lista prodotti (tutti gli stati)
 * - Recuperare singolo prodotto per editor
 * - Delegare scrittura / upsert al backend CORE
 *
 * NON FA:
 * - NON calcola prezzi
 * - NON valida pricing
 * - NON decide status o visibilità
 * - NON gestisce opzioni (delegato ad altri domini)
 *
 * INVARIANTI:
 * - Il backend è source of truth
 * - Tutte le chiamate ADMIN passano da adminFetch
 * - Vietato usare fetch diretto
 *
 * RELAZIONE CON BACKEND:
 * - READ: /api/admin/products/*
 * - WRITE: /api/products/register (core backend)
 *
 * RELAZIONE CON UI:
 * - UI admin consuma DTO ADMIN
 * - Nessuna normalizzazione UI in questo file
 *
 * PROBLEMA ATTUALE:
 * - Presenza di una funzione legacy che usa fetch diretto
 * - Viola la regola "UN SOLO API CLIENT"
 *
 * AZIONE OBBLIGATORIA:
 * - Rimuovere la funzione fetchAdminProducts() legacy
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/adminApi/admin.products.api.ts
 * - Motivazione:
 *   Uniformare naming e struttura alle altre adminApi
 *
 * NOTE:
 * - Questo file resta CORE dopo cleanup
 * ======================================================
 */

import { adminFetch } from "./client";
import type { AdminProductDTO } from "../dto/AdminProductDTO";
import type { AdminUpdateProductDTO } from "../dto/AdminUpdateProductDTO";

/* =========================
   LIST PRODUCTS (ADMIN)
   GET /api/admin/products/list
========================= */
type AdminProductsResponse = {
  ok: boolean;
  products: AdminProductDTO[];
};

export async function getAdminProducts(): Promise<AdminProductDTO[]> {
  const res = await adminFetch<AdminProductsResponse>(
    "/api/admin/products/list"
  );
  return res.products;
}

/* =========================
   GET SINGLE PRODUCT (ADMIN)
   GET /api/admin/product?id=XXX
========================= */
type AdminProductResponse = {
  ok: boolean;
  product: AdminProductDTO;
};

export async function fetchAdminProduct(
  id: string
): Promise<AdminProductDTO> {
  const res = await adminFetch<AdminProductResponse>(
    `/api/admin/product?id=${id}`
  );
  return res.product;
}

/* =========================
   UPSERT PRODUCT (ADMIN)
   PUT /api/products/register
========================= */
export async function updateAdminProduct(
  payload: AdminUpdateProductDTO
) {
  return adminFetch("/api/products/register", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

  