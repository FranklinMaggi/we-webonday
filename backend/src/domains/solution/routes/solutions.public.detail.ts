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
import { ProductSchema } from "../../product/product.schema";
import { getSolutionImageUrl } from "../../../utils/assets";
import { getSolutionImages } from "../../../utils/assets";
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
        userGeneratedDescriptionTags?: string[];
        serviceTags?: string [];
        userGeneratedServiceTags?: string [];

        /** URL pubblico hero / card */
        image?: {
          hero: string;
          card: string;
          
        };
        openingHoursDefault?: {
          monday: string;
          tuesday: string;
          wednesday: string;
          thursday: string;
          friday: string;
          saturday: string;
          sunday: string;
        };
        
        /** @deprecated */
        icon?: string;
      
        industries?: string[];
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
      openingHoursDefault : solution.openingHoursDefault ,
      image: getSolutionImages(solution.imageKey),
    
      icon: solution.icon, // legacy
      industries: solution.industries,
      descriptionTags : solution.descriptionTags ?? [],
      serviceTags: solution.serviceTags ?? [],
     
    },
    
    products,
  };
}
