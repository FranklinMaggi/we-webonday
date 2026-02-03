    // business/api/get.my-business-draft.ts

    import {type BusinessDraftBaseReadDTO } from "../DataTransferObject/output/business.draft.read.dto";
    import { useEffect ,useState } from "react";
    import { apiFetch } from "@src/shared/lib/api";

    type BusinessDraftReadResponse = {
        ok: boolean;
        draft?: BusinessDraftBaseReadDTO;
      
    };

    export function useMyBusinessDraft(configurationId?: string) {
        const [data, setData] =
        useState<BusinessDraftBaseReadDTO | null>(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
        if (!configurationId) return;
        let alive = true;
        setLoading(true);

        apiFetch<BusinessDraftReadResponse>(
            `/api/business/get-base-draft?configurationId=${configurationId}`,
            { method: "GET" }
        ).then((res) => {
            if (!alive) return;

            if (res?.ok && res.draft) {
            setData(res.draft);
            } else {
            setData(null);
            }
        })
        .catch(() => {
            if (!alive) return;
            setData(null);
        })
        .finally(() => {
            if (alive) setLoading(false);
        });


        return () => {
            alive = false;
            };
        }, [configurationId]);
        
        return {
            data,
            loading,
            hasDraft: !!data,
            isComplete: false,
        };
    }