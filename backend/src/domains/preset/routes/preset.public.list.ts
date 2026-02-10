import type { Env } from "../../../types/env";
import { readSitePresetsBySolution } from "./preset.read";
import type { SitePresetPublicDTO } from "../DataTransferObject/site.preset.dto";

/**
 * ======================================================
 * PUBLIC || LIST PRESETS BY SOLUTION
 * GET /api/preset/list?solutionId=bnb
 * ======================================================
 */

export async function listPresetsBySolution(
  request: Request,
  env: Env
): Promise<
  | { ok: true; presets: SitePresetPublicDTO[] }
  | { ok: false; error: string }
> {
  const { searchParams } = new URL(request.url);
  const solutionId = searchParams.get("solutionId");

  if (!solutionId) {
    return { ok: false, error: "MISSING_SOLUTION_ID" };
  }

  const presets = await readSitePresetsBySolution(
    env,
    solutionId
  );

  const publicPresets: SitePresetPublicDTO[] = presets.map(
    (p) => ({
      id: p.id,
      solutionId: p.solutionId,
      name: p.name,
      description: p.description,
      preview: {
        heroImageKey: p.preview.heroImageKey,
      },
    })
  );

  return {
    ok: true,
    presets: publicPresets,
  };
}
