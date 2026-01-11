// ======================================================
// FE || pages/user/configurator/setup/ConfigurationSetupPage.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION SETUP PAGE
//
// RUOLO:
// - Orchestratore UI del wizard di configurazione
// - Punto di aggancio tra:
//   • carrello (commerciale)
//   • sessione utente
//   • configurazione FE (Zustand)
//
// INVARIANTI:
// - FE ONLY
// - Nessuna fetch
// - Nessuna persistenza
// - Nessuna business logic
//
// ======================================================

import { useEffect, useRef, useState } from "react";

import { useConfigurationSetupStore } from "../../../../lib/store/configurationSetup.store";
import { useAuthStore } from "../../../../lib/store/auth.store";
import { cartStore } from "../../../../lib/cart/cart.store";

import StepProductIntro from "./steps/StepProductIntro";
import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

/* =========================
   PROPS
========================= */
export type ConfigurationSetupPageProps = {
  configuration?: {
    business?: {
      name?: string;
      type?: string;
      city?: string;
      email?: string;
      phone?: string;
    };
  };

  industries?: string[];

  /**
   * TAG SUGGERITI DALLA SOLUTION
   * (merge seed + userGenerated)
   */
  solutionTags?: string[];
};

/* =========================
   STEPS
========================= */
const STEPS = [
  "intro",
  "business",
  "design",
  "extra",
  "review",
] as const;

export default function ConfigurationSetupPage({
  configuration,
  industries = [],
  solutionTags = [],
}: ConfigurationSetupPageProps) {
  /* =========================
     STATO WIZARD
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);

  const { data, setField } = useConfigurationSetupStore();
  const { user } = useAuthStore();

  /**
   * Guard SEPARATI
   * - basePrefill → dati sync
   * - solutionTagsPrefill → dati async
   */
  const basePrefilledRef = useRef(false);
  const solutionTagsPrefilledRef = useRef(false);

  /* ======================================================
     PREFILL BASE (SYNC)
     - email
     - carrello
     - configuration business
  ====================================================== */
  useEffect(() => {
    if (basePrefilledRef.current) return;

    /* ===== EMAIL ===== */
    if (user?.email && !data.email) {
      setField("email", user.email);
    }

    /* ===== CARRELLO ===== */
    const cart = cartStore.getState();
    if (cart.items[0]) {
      const item = cart.items[0];

      if (!data.solutionId) {
        setField("solutionId", item.solutionId);
      }

      if (!data.productId) {
        setField("productId", item.productId);
      }

      if (!data.optionIds?.length) {
        setField(
          "optionIds",
          item.options.map((o) => o.id)
        );
      }
    }

    /* ===== BUSINESS DA CONFIGURATION ===== */
    if (configuration?.business) {
      const b = configuration.business;

      if (b.name && !data.businessName) {
        setField("businessName", b.name);
      }

      if (
        b.type &&
        !data.sector &&
        industries.includes(b.type)
      ) {
        setField("sector", b.type);
      }

      if (b.city && !data.city) {
        setField("city", b.city);
      }

      if (b.phone && !data.phone) {
        setField("phone", b.phone);
      }
    }

    basePrefilledRef.current = true;
  }, [user, configuration, industries, data, setField]);

  /* ======================================================
     PREFILL TAG SOLUTION (ASYNC)
     - entra SOLO quando solutionTags sono pronti
     - UNA SOLA VOLTA
  ====================================================== */
  useEffect(() => {
    if (solutionTagsPrefilledRef.current) return;
    if (!solutionTags || solutionTags.length === 0) return;

    setField("solutionTags", solutionTags);
    solutionTagsPrefilledRef.current = true;
  }, [solutionTags, setField]);

  /* =========================
     NAVIGAZIONE
  ========================= */
  const next = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const back = () =>
    setStepIndex((i) => Math.max(i - 1, 0));

  /* =========================
     STEP SWITCH
  ========================= */
  switch (STEPS[stepIndex]) {
    case "intro":
      return <StepProductIntro onNext={next} />;

    case "business":
      return <StepBusinessInfo onNext={next} />;

    case "design":
      return <StepDesign onNext={next} onBack={back} />;

    case "extra":
      return <StepExtra onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} />;

    default:
      return null;
  }
}
