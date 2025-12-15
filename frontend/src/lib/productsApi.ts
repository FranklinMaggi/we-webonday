import type { ProductDTO } from "./types";
import { API_BASE } from "./config";

export async function fetchProducts(): Promise<ProductDTO[]> {
    const res = await fetch(`${API_BASE}/api/products`, {
      headers: { Accept: "application/json" },
    });
  
    if (!res.ok) {
      throw new Error(`Products fetch failed (${res.status})`);
    }
  
    const data = await res.json();
  
    if (!data.ok || !Array.isArray(data.products)) {
      throw new Error("Invalid products response shape");
    }
  
    return data.products;
  }
  
  export async function fetchProduct(id: string): Promise<ProductDTO> {
    const res = await fetch(
      `${API_BASE}/api/product?id=${encodeURIComponent(id)}`,
      { headers: { Accept: "application/json" } }
    );
  
    if (!res.ok) {
      throw new Error(`Product fetch failed (${res.status})`);
    }
  
    const data = await res.json();
  
    if (!data.ok || !data.product) {
      throw new Error(data.error ?? "Invalid product response shape");
    }
  
    return data.product;
  }
  