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
// SOURCE OF TRUTH:
// - cartStore                  → solution / product / options
// - authStore                  → email utente
// - configurationSetupStore    → dati configurazione (FE)
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
};

/**
 * ORDINE STEP:
 * - intro    → contesto prodotto
 * - business → anagrafica + contenuti + orari (UNIFICATO)
 * - design   → stile visivo
 * - extra    → extra / opzioni
 * - review   → riepilogo finale
 */
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
}: ConfigurationSetupPageProps) {
  /* =========================
     STATO WIZARD
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);

  const { data, setField } = useConfigurationSetupStore();
  const { user } = useAuthStore();

  /**
   * Guard per evitare:
   * - doppio prefill (React StrictMode)
   * - override di input già modificati dall’utente
   */
  const prefilledRef = useRef(false);

  /* ======================================================
     PREFILL INIZIALE (UNA SOLA VOLTA)
     ORDINE GARANTITO:
     1. EMAIL → sessione
     2. SOLUTION / PRODUCT / OPTIONS → carrello
     3. BUSINESS → configuration esistente (se presente)
  ====================================================== */
  useEffect(() => {
    if (prefilledRef.current) return;

    /* ===== 1. EMAIL DA SESSIONE ===== */
    if (user?.email && !data.email) {
      setField("email", user.email);
    }

    /* ===== 2. DATI COMMERCIALI DA CARRELLO ===== */
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

    /* ===== 3. DATI BUSINESS DA CONFIGURATION ESISTENTE ===== */
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

    prefilledRef.current = true;
  }, [user, configuration, industries, data, setField]);

  /* =========================
     NAVIGAZIONE
  ========================= */
  const next = () =>
    setStepIndex((i) =>
      Math.min(i + 1, STEPS.length - 1)
    );

  const back = () =>
    setStepIndex((i) =>
      Math.max(i - 1, 0)
    );

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
