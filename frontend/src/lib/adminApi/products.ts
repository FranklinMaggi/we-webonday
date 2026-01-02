// ======================================================
// FE || lib/adminApi/products.ts
// ======================================================
// ADMIN PRODUCTS API
//
// RESPONSABILITÀ:
// - READ: admin (tutti gli stati)
// - WRITE: delegata al CORE (/api/products/register)
//
// ======================================================

import { adminFetch } from "./client";
import type { AdminProductDTO } from "../../dto/AdminProductDTO";
import type { AdminUpdateProductDTO } from "../../dto/AdminUpdateProductDTO";

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
export async function fetchAdminProducts(): Promise<AdminProductDTO[]> {
    const res = await fetch("/api/products/admin", {
      credentials: "include",
    });
  
    if (!res.ok) {
      throw new Error("Errore fetch prodotti admin");
    }
  
    return res.json();
  }
  