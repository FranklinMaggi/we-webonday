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
// - Solution (BE)
//
// NOTE:
// - openingHours arriva GIÀ strutturato dal BE
// - NON esiste più openingHoursDefault
// ======================================================

import { useEffect, useState } from "react";

import { useConfigurationSetupStore } from "../configuration/configurationSetup.store";
import BusinessForm from "./BusinessForm";
import {
  type OpeningHoursFE,
} from "../configuration/configurationSetup.store";
import { isOpeningHoursEmpty } from "./StepContent";
import { getSolutionById } from "../../../../marketing/pages/buyflow/api/publiApi/solutions/solutions.public.api";
import { apiFetch } from "@src/shared/lib/api";

/* ======================================================
   LOCAL TYPES
====================================================== */

export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHours: OpeningHoursFE | null;
};

type BusinessDraftReadDTO = {
  businessDraftId: string;
  businessName: string;
  openingHours: OpeningHoursFE | null;
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
    console.error("[STEP_BUSINESS][GUARD_FAIL]", {
      solutionId: data.solutionId,
      productId: data.productId,
    });

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
        console.log("[STEP_BUSINESS][BOOTSTRAP][START]", {
          solutionId: data.solutionId,
          configurationId: data.configurationId,
        });

        /* =========================
           1️⃣ LOAD SOLUTION
        ========================= */
        const solution = await getSolutionById(data.solutionId);

        console.log("[STEP_BUSINESS][SOLUTION][RAW]", solution);

        if (!cancelled) {
          const nextSeed: SolutionSeed = {
            descriptionTags: solution.descriptionTags ?? [],
            serviceTags: solution.serviceTags ?? [],
            openingHours: solution.openingHours ?? null,
          };

          console.log("[STEP_BUSINESS][SEED][BUILT]", nextSeed);
          setSeed(nextSeed);// 👇 PREFILL OPENING HOURS SOLO SE VUOTI
          if (
            nextSeed.openingHours &&
            isOpeningHoursEmpty(data.openingHours)
          ) {
            console.log(
              "[STEP_BUSINESS][OPENING_HOURS][PREFILL_FROM_SOLUTION]",
              nextSeed.openingHours
            );
            setField("openingHours", nextSeed.openingHours);
          }
          
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

          console.log("[STEP_BUSINESS][DRAFT][RAW]", res);

          if (res?.draft && !cancelled) {
            const d = res.draft;

            console.log("[STEP_BUSINESS][DRAFT][APPLY]", d);

            setField("businessDraftId", d.businessDraftId);
            setField("businessName", d.businessName);

            if (d.contact?.mail) setField("email", d.contact.mail);
            if (d.contact?.phoneNumber) setField("phone", d.contact.phoneNumber);

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
              });if (res.draft.openingHours) {
                console.log(
                  "[STEP_BUSINESS][OPENING_HOURS][PREFILL_FROM_DRAFT]",
                  res.draft.openingHours
                );
                setField("openingHours", res.draft.openingHours);
              }
              
            }
          }
        }
      } catch (err) {
        console.error("[STEP_BUSINESS][BOOTSTRAP][ERROR]", err);
      } finally {
        if (!cancelled) {
          console.log("[STEP_BUSINESS][BOOTSTRAP][DONE]");
          setLoading(false);
        }
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
