import { apiFetch } from "../../../../../lib/api";
import { type SolutionConfiguratorSeedApiModel } from "../../../../../lib/apiModels/public/SolutionConfiguratorSeed.api-model";


export type GetSolutionPublicResponse = {
  ok: true;
  solution: SolutionConfiguratorSeedApiModel;
};

export async function getSolutionById(
  solutionId: string
): Promise<GetSolutionPublicResponse> {
  const res = await apiFetch<GetSolutionPublicResponse>(
    `/api/solutions/public/${solutionId}`
  );

  if (!res || !res.ok) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return res;
}
