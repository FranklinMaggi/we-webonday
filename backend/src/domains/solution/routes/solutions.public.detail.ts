/* ======================================================
   AI-SUPERCOMMENT
   FILE: backend/src/routes/solutions/solution.detail.ts

   RUOLO:
   - Espone il dettaglio pubblico di UNA Solution
   - Risolve i prodotti associati (solo ACTIVE)

   DOMINIO:
   - READ-ONLY
   - Marketing oriented
   - Backend = source of truth

   NON FA:
   - NON crea ordini
   - NON modifica KV
   - NON gestisce HTTP / CORS

   CONNECT POINT:
   - index.ts → GET /api/solution?id=XXX
====================================================== */

import type { Env } from "../../../types/env";
import { SolutionSchema } from "../schema/solution.schema";
import { ProductSchema } from "../../product/schema/product.schema";
import { getSolutionImageUrl } from "@domains/image/assets";
import { getSolutionImages } from "@domains/image/assets";
import { OpeningHoursDTO } from "@domains/GeneralSchema/hours.opening.schema";
/* ======================================================
   DOMAIN OUTPUT TYPES
====================================================== */
export type SolutionDetailResult =
  | {
      ok: true;
      solution: {
        id: string;
        name: string;
        description?: string;
        longDescription?: string;
      
        descriptionTags?: string[];
        serviceTags?: string[];
      
        image?: {
          hero: string;
          card: string;
        };
      
        openingHours?: OpeningHoursDTO;
      
        icon?: string;
        industries?: string[];
      
        /** ⬇️ NUOVO */
        templatePresets?: {
          id: string;
          label: string;
          previewImage: string;
          gallery: string[];
          style: "modern" | "elegant" | "minimal" | "bold";
          palette: "warm" | "dark" | "light" | "pastel" | "corporate";
        }[];
      };
      
      
      products: unknown[]; // DTO pubblico prodotto
    }
  | {
      ok: false;
      error:
        | "MISSING_SOLUTION_ID"
        | "SOLUTION_NOT_FOUND"
        | "SOLUTION_NOT_ACTIVE";
    };

/* ======================================================
   GET SOLUTION DETAIL (PUBLIC)
====================================================== */
export async function getSolutionDetail(
  request: Request,
  env: Env
): Promise<SolutionDetailResult> {
  /* =========================
     INPUT
  ========================= */
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return {
      ok: false,
      error: "MISSING_SOLUTION_ID",
    };
  }

  /* =========================
     LOAD SOLUTION
  ========================= */
  const raw = await env.SOLUTIONS_KV.get(`SOLUTION:${id}`);
  if (!raw) {
    return {
      ok: false,
      error: "SOLUTION_NOT_FOUND",
    };
  }

  /* =========================
     VALIDATION
  ========================= */
  const solution = SolutionSchema.parse(JSON.parse(raw));

  if (solution.status !== "ACTIVE") {
    return {
      ok: false,
      error: "SOLUTION_NOT_ACTIVE",
    };
  }

  /* =========================
     RESOLVE PRODUCTS
  ========================= */
  const products: unknown[] = [];

  for (const productId of solution.productIds) {
    const rawProduct = await env.PRODUCTS_KV.get(
      `PRODUCT:${productId}`
    );
    if (!rawProduct) continue;

    try {
      const product = ProductSchema.parse(
        JSON.parse(rawProduct)
      );

      if (product.status === "ACTIVE") {
        products.push(product);
      }
    } catch {
      // prodotto corrotto → ignorato (non blocca la solution)
    }
  }

  /* =========================
     DOMAIN OUTPUT
  ========================= */
  return {
    ok: true,
    solution: {
      id: solution.id,
      name: solution.name,
      description: solution.description,
      longDescription: solution.longDescription,
  
      openingHours: solution.openingHours,
      image: getSolutionImages(solution.imageKey),
  
      icon: solution.icon,
      industries: solution.industries,
  
      descriptionTags: solution.descriptionTags ?? [],
      serviceTags: solution.serviceTags ?? [],
  
      /** ⬇️ PASS-THROUGH PURO */
      templatePresets: solution.templatePresets ?? [],
    },
  
    products,
  };
  
}
