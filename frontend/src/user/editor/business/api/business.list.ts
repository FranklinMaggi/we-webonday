import { apiFetch} from "@src/shared/lib/api";
import { type BusinessSummaryDTO } from "./business.user.api";

export async function listMyBusinesses(): Promise<{
    ok: true;
    items: BusinessSummaryDTO[];
  }> {
    const res = await apiFetch<{
      ok: true;
      items: BusinessSummaryDTO[];
    }>("/api/business/list", {
      method: "GET",
    });
  
    // SAFETY GUARD — apiFetch non dovrebbe mai tornare null,
    // ma questa guardia evita crash silenziosi
    if (!res) {
      throw new Error("API /api/business returned null response");
    }
  
    return res;
  }
  