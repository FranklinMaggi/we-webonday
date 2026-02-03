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
// - BusinessDraft (BE) → vince sempre
// - Solution (BE) → seed iniziale
//
// NOTE:
// - openingHours arriva GIÀ strutturato dal BE
// - NON esiste più openingHoursDefault
// ======================================================

import { useEffect, useState } from "react";
import { isOpeningHoursEmpty } from "@shared/domain/business/openingHours.utils";
import { apiFetch } from "@shared/lib/api";
import { getSolutionById } from "@src/marketing/pages/buyflow/api/publiApi/solutions/solutions.public.api";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import BusinessForm from "./BusinessForm";

import type {
  SolutionSeed,
  BusinessDraftReadDTO,
} from "@shared/domain/business/buseinssRead.types";

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
     HARD GUARD — CONFIG MINIMA
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
     BOOTSTRAP
     1) Load Solution (seed)
     2) Load BusinessDraft (override)
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        console.group("[STEP_BUSINESS][BOOTSTRAP][START]");
        console.log("CTX", {
          solutionId: data.solutionId,
          configurationId: data.configurationId,
        });

        /* =========================
           1️⃣ LOAD SOLUTION (READ ONLY)
        ========================= */

        const solution = await getSolutionById(data.solutionId);

        if (cancelled) return;

        const nextSeed: SolutionSeed = {
          descriptionTags: solution.descriptionTags ?? [],
          serviceTags: solution.serviceTags ?? [],
          openingHours: solution.openingHours ?? null,
        };

        console.log("[STEP_BUSINESS][SOLUTION][SEED]", nextSeed);
        setSeed(nextSeed);

        // 👉 Prefill openingHours SOLO se lo store è vuoto
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

        /* =========================
           2️⃣ LOAD BUSINESS DRAFT (BE WINS)
        ========================= */

        if (!data.configurationId) return;

        const res = await apiFetch<{
          ok: boolean;
          draft?: BusinessDraftReadDTO;
        }>(
          `/api/business/get-base-draft?configurationId=${data.configurationId}`,
          { method: "GET" }
        );

        if (cancelled || !res?.draft) return;

        const d = res.draft;

        console.log("[STEP_BUSINESS][DRAFT][RAW]", d);

        /* =========================
           APPLY DRAFT → STORE
        ========================= */

        setField("businessDraftId", d.businessDraftId);
        setField("businessName", d.businessName);

        // CONTACT
        if (d.contact?.mail) {
          setField("email", d.contact.mail);
        }

        if (d.contact?.phoneNumber) {
          setField("phone", d.contact.phoneNumber);
        }

        // ADDRESS (CANONICAL OBJECT)
        if (d.address ) {
          setField("businessAddress", {
            street: d.address.street ?? "",
            number: d.address.number ?? "",
            city: d.address.city ?? "",
            province: d.address.province ?? "",
            zip: d.address.zip ?? "",
            region: "",
            country: "Italia",
          });
        }

        // TAGS
        setField(
          "businessDescriptionTags",
          d.businessDescriptionTags ?? []
        );

        setField(
          "businessServiceTags",
          d.businessServiceTags ?? []
        );

        // PRIVACY
        if (d.privacy) {
          setField("privacy", {
            accepted: d.privacy.accepted,
            acceptedAt: d.privacy.acceptedAt,
            policyVersion: d.privacy.policyVersion,
          });
        }

        // OPENING HOURS (BE OVERRIDE TOTALE)
        if (d.openingHours) {
          console.log(
            "[STEP_BUSINESS][OPENING_HOURS][PREFILL_FROM_DRAFT]",
            d.openingHours
          );
          setField("openingHours", d.openingHours);
        }

        console.groupEnd();
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
