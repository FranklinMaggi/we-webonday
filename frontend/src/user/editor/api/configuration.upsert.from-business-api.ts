
import { apiFetch } from "@src/shared/lib/api";

export async function upsertConfigurationFromBusiness(input: {
    businessId: string;
    productId: string;
    optionIds: string[];
    businessDescriptionTags?: string[];
    businessServiceTags?: string[];
  }) {
    return apiFetch<{
      ok: true;
      configurationId: string;
    }>("/api/configuration/from-business", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
  