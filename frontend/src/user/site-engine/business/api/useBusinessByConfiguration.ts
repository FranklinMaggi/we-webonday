// ======================================================
// FE || HOOK || useBusinessByConfiguration
// ======================================================
//
// RUOLO:
// - Leggere dati Business dal BE
// - Source of Truth per Business View e Site Preview
//
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "@shared/lib/api";
import type { BusinessReadDTO } from
"@src/shared/domain/business/buseinssRead.types";

export function useBusinessByConfiguration(
configurationId: string | null
) {
const [business, setBusiness] =
useState<BusinessReadDTO | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
if (!configurationId) return;

setLoading(true);
setError(null);

apiFetch<{ ok: boolean; draft?: BusinessReadDTO }>(
    `/api/business/get?configurationId=${configurationId}`
)
    .then((res) => {
    if (res?.ok && res.draft) {
        setBusiness(res.draft);
    } else {
        setBusiness(null);
    }
    })
    .catch(() => {
    setError("FAILED_TO_LOAD_BUSINESS");
    setBusiness(null);
    })
    .finally(() => setLoading(false));
}, [configurationId]);

return { business, loading, error };
}
