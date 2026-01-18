// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP — BUSINESS SETUP (FE ONLY)
//
// RUOLO:
// - Raccolta dati business
// - Scrive SOLO nello store Zustand
//
// INVARIANTI:
// - ❌ Nessuna fetch
// - ❌ Nessuna persistenza backend
// - ❌ Nessun redirect
//
// ======================================================

import BusinessForm from "../../../../../../domains/business/BusinessForm";

export default function StepBusinessInfo({
  onNext,
}: {
  onNext: () => void;
}) {
  return <BusinessForm onComplete={onNext} />;
}
