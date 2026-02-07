import { apiFetch } from "@shared/lib/api";

export async function updateConfiguration(
  configurationId: string,
  payload: unknown
): Promise<{ ok: true }> {
  const res = await apiFetch<{ ok: true }>(
    `/api/configuration/${configurationId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  if (!res) {
    throw new Error("CONFIGURATION_UPDATE_FAILED");
  }

  return res;
}