import { apiFetch } from "../../../shared/lib/api/client";
import { type ConfigurationUserSummaryDTO } from "./DataTransferObject/ConfigurationConfiguratorDTO";


export async function listMyConfigurations(): Promise<{
  ok: true;
  items: ConfigurationUserSummaryDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: ConfigurationUserSummaryDTO[];
  }>("/api/configuration/get-list", {
    method: "GET",
  });

  if (!res) {
    throw new Error("API /api/configuration returned null");
  }

  return res;
}
