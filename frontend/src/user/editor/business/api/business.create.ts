import { apiFetch } from "@src/shared/lib/api";
import { type CreateBusinessPayload } from "./business.user.api";

/**
 * POST /api/business/create
 */

export async function createBusiness(
payload: CreateBusinessPayload
): Promise<{
ok: true;
businessId: string;
}> {
const res = await apiFetch<{
    ok: boolean;
    businessId: string;
}>("/api/business/create", {
    method: "POST",
    body: JSON.stringify(payload),
});

if (!res) {
    throw new Error("API /api/business/create returned null");
}

return res as {
    ok: true;
    businessId: string;
    status: "draft";
};
}
