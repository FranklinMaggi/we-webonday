// ======================================================
// FE || STEP — BUSINESS INFO (CANONICAL)
// ======================================================
//
// RUOLO:
// - Carica dati READ-ONLY da Solution
// - Carica BusinessDraft (se esiste)
// - Prefilla COMPLETAMENTE lo store FE
//
// SOURCE OF TRUTH:
// - BusinessDraft (BE)
// ======================================================

import { useEffect, useState } from "react";

import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import BusinessForm from "../business/BusinessForm";

import { getSolutionById } from "../../../../../../domains/buyflow/api/publiApi/solutions/solutions.public.api";
import { apiFetch } from "../../../../../../lib/api";

/* ======================================================
   LOCAL TYPES
====================================================== */
export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHoursDefault: Record<string, string> | null;
};

type BusinessDraftReadDTO = {
  businessDraftId: string;
  businessName: string;

  businessOpeningHour?: Record<string, string>;

  contact?: {
    mail?: string;
    phoneNumber?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
  };
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};

/* ======================================================
   COMPONENT
====================================================== */
export default function StepBusinessInfo({
  onNext,
}: {
  onNext: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();

  const [seed, setSeed] = useState<SolutionSeed | null>(null);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     HARD GUARD — MINIMO
  ====================================================== */
  if (!data.solutionId || !data.productId) {
    return (
      <div className="step-error">
        <h2>Configurazione incompleta</h2>
      </div>
    );
  }

  /* ======================================================
     LOAD SEED + BUSINESS DRAFT
  ====================================================== */
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        /* =========================
           1️⃣ LOAD SOLUTION SEED
        ========================= */
        const solution = await getSolutionById(data.solutionId);
        if (!cancelled) {
          setSeed({
            descriptionTags: solution.descriptionTags ?? [],
            serviceTags: solution.serviceTags ?? [],
            openingHoursDefault:
              solution.openingHoursDefault ?? null,
          });
        }

        /* =========================
           2️⃣ LOAD BUSINESS DRAFT (IF EXISTS)
        ========================= */
        if (data.configurationId) {
          const res = await apiFetch<{
            ok: boolean;
            draft?: BusinessDraftReadDTO;
          }>(
            `/api/business/get-base-draft?configurationId=${data.configurationId}`,
            { method: "GET" }
          );
         
          if (res?.draft && !cancelled) {
            const d = res.draft;

            // 🔑 PREFILL STORE — BUSINESS
            setField("businessDraftId", d.businessDraftId);
            setField("businessName", d.businessName);

            if (d.businessOpeningHour) {
              setField("openingHours", d.businessOpeningHour);
            }

            if (d.contact?.mail) {
              setField("email", d.contact.mail);
            }

            if (d.contact?.phoneNumber) {
              setField("phone", d.contact.phoneNumber);
            }

            if (d.contact?.address) {
              setField("address", d.contact.address.street ?? "");
              setField("city", d.contact.address.city ?? "");
              setField("state", d.contact.address.province ?? "");
              setField("zip", d.contact.address.zip ?? "");
            }

            setField(
              "businessDescriptionTags",
              d.businessDescriptionTags ?? []
            );
            setField(
              "businessServiceTags",
              d.businessServiceTags ?? []
            );
            if (d.privacy) {
              setField("privacy", {
                accepted: d.privacy.accepted,
                acceptedAt: d.privacy.acceptedAt,
                policyVersion: d.privacy.policyVersion,
              });
            }
            
          }
        }
      } catch {
        // FAIL SILENTLY
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [data.solutionId, data.configurationId, setField]);

  /* ======================================================
     UI GUARD
  ====================================================== */
  if (loading) {
    return <div className="step">Caricamento dati business…</div>;
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <BusinessForm
      solutionSeed={seed}
      onComplete={onNext}
    />
  );
}
