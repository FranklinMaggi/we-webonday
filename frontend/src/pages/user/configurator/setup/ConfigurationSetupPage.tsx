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
//   • configurazione FE
//
// SOURCE OF TRUTH:
// - cartStore                  → solution / product / options
// - authStore                  → email utente
// - configurationSetupStore    → dati configurazione
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza
// - Nessuna business logic
//
// ======================================================

import { useEffect, useRef, useState } from "react";

import { useConfigurationSetupStore } from "./configurationSetup.store";
import { useAuthStore } from "../../../../store/auth.store";
import { cartStore } from "../../../../lib/cart/cart.store";

import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepContent from "./steps/StepContent";
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
};

const STEPS = ["business", "design", "content", "extra", "review"] as const;

export default function ConfigurationSetupPage({
  configuration,
  industries = [],
}: ConfigurationSetupPageProps) {
  /* =========================
     STATO WIZARD
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);

  const { data, setField } = useConfigurationSetupStore();
  const { user } = useAuthStore();

  /**
   * Guard per evitare:
   * - doppio prefill (StrictMode)
   * - override input utente
   */
  const prefilledRef = useRef(false);

  /* ======================================================
     PREFILL INIZIALE (UNA SOLA VOLTA)
     ORDINE CORRETTO:
     1. EMAIL → sessione
     2. SOLUTION / PRODUCT / OPTIONS → carrello
     3. BUSINESS → configuration esistente (se presente)
  ====================================================== */
  useEffect(() => {
    if (prefilledRef.current) return;

    // ===== 1. EMAIL DA LOGIN =====
    if (user?.email && !data.email) {
      setField("email", user.email);
    }

    // ===== 2. DATI COMMERCIALI DA CARRELLO =====
    const cart = cartStore.getState();

    if (cart.items[0]) {
      const item = cart.items[0];

      setField("solutionId", item.solutionId);
      setField("productId", item.productId);
      setField(
        "optionIds",
        item.options.map((o) => o.id)
      );
    }

    // ===== 3. DATI BUSINESS DA CONFIGURATION (/[id]) =====
    if (configuration) {
      if (configuration.business?.name && !data.businessName) {
        setField("businessName", configuration.business.name);
      }

      if (
        configuration.business?.type &&
        !data.sector &&
        industries.includes(configuration.business.type)
      ) {
        setField("sector", configuration.business.type);
      }

      if (configuration.business?.city && !data.city) {
        setField("city", configuration.business.city);
      }

      if (configuration.business?.phone && !data.phone) {
        setField("phone", configuration.business.phone);
      }
    }

    prefilledRef.current = true;
  }, [user, configuration, industries, data, setField]);

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
    case "business":
      return <StepBusinessInfo onNext={next} />;

    case "design":
      return <StepDesign onNext={next} onBack={back} />;

    case "content":
      return <StepContent onNext={next} onBack={back} />;

    case "extra":
      return <StepExtra onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} />;

    default:
      return null;
  }
}
