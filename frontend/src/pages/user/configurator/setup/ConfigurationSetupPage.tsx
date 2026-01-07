/**
 * ======================================================
 * FE || CONFIGURATION SETUP PAGE
 * ======================================================
 *
 * RUOLO:
 * - Orchestratore UI del wizard
 *
 * INVARIANTI:
 * - Nessun fetch
 * - Nessuna persistenza
 * - Nessuno stato globale
 * ======================================================
 */

import { useState } from "react";

import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepContent from "./steps/StepContent";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

export type ConfigurationSetupPageProps = {
  configuration?: {
    business?: {
      name: string;
      type?: string;
    };
  };
  industries?: string[];
};

const STEPS = ["business", "design", "content", "extra", "review"] as const;

export default function ConfigurationSetupPage({
  configuration,
  industries = [],
}: ConfigurationSetupPageProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const back = () =>
    setStepIndex((i) => Math.max(i - 1, 0));

  switch (STEPS[stepIndex]) {
    case "business":
      return (
        <StepBusinessInfo
          onNext={next}
          configuration={configuration}
          industries={industries}
        />
      );
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
