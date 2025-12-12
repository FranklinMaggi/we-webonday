import type { ProductDTO } from "./types";
import { API_BASE } from "./config";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    console.error("[ProductsAPI] HTTP error:", res.status, res.statusText);
    throw new Error(`Failed request (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(): Promise<ProductDTO[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      headers: { "Accept": "application/json" },
    });
    const data = await handleResponse<ProductDTO[]>(res);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[ProductsAPI] fetchProducts error:", err);
    throw err;
  }
}
export async function fetchProduct(id: string): Promise<ProductDTO | { error: string }> {
    const res = await fetch(`${API_BASE}/api/product?id=${encodeURIComponent(id)}`);
  
    let parsed: any;
  
    try {
      parsed = await res.json();
    } catch (err) {
      throw new Error("Risposta non valida dal backend in fetchProduct()");
    }
  
    return parsed;
  }
  