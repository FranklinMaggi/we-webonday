/* ======================================================
   AI-SUPERCOMMENT
   FILE: backend/src/routes/solutions/solutions.public.ts

   RUOLO:
   - Espone il catalogo pubblico delle SOLUTIONS
   - Solo lettura (marketing / visitor)

   DOMINIO:
   - Backend = source of truth
   - NO Response HTTP
   - NO CORS
   - NO logica admin

   REGOLE:
   - SOLO solution.status === "ACTIVE"
   - Fail-fast su KV corrotto

   CONNECT POINT:
   - index.ts → GET /api/solutions
====================================================== */

import type { Env } from "../../types/env";
import { SolutionSchema } from "../../schemas/core/solutionSchema";
import { getSolutionImageUrl } from "../../utils/assets";
/* ======================================================
   DOMAIN OUTPUT TYPE
====================================================== */
export type PublicSolutionsResult = {
  ok: true;
  solutions: unknown[]; // DTO pubblico (refine lato FE)
};

/* ======================================================
   GET PUBLIC SOLUTIONS
====================================================== */
export async function getSolutions(
  env: Env
): Promise<PublicSolutionsResult> {
  const list = await env.SOLUTIONS_KV.list({
    prefix: "SOLUTION:",
  });

  const solutions: unknown[] = [];

  for (const key of list.keys) {
    const raw = await env.SOLUTIONS_KV.get(key.name);
    if (!raw) continue;

    // 🔒 KV deve essere valido
    const parsed = SolutionSchema.parse(JSON.parse(raw));

    // 🔓 Public guard
    if (parsed.status === "ACTIVE") {
        solutions.push({
          id: parsed.id,
          name: parsed.name,
          description: parsed.description,
          icon: parsed.icon,
          image: getSolutionImageUrl(parsed.imageKey), // ✅ QUI
        });
      }
      
  }

  // UX marketing
  solutions.sort((a: any, b: any) =>
    a.name.localeCompare(b.name)
  );

  return {
    ok: true,
    solutions,
  };
}
