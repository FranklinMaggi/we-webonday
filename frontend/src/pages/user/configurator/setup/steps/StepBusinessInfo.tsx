// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP — BUSINESS SETUP (ANAGRAFICA + CONTENUTI)
//
// RUOLO:
// - Raccolta completa dei dati del business
// - Include:
//   • anagrafica
//   • contatti
//   • indirizzo
//   • contenuti testuali
//   • orari di apertura
//
// INVARIANTI CRITICHE:
// - FE ONLY (Zustand store)
// - Nessuna fetch
// - Nessuna persistenza backend
// - Nessuna validazione bloccante
// - Nessuna creazione Business / Configuration
//
// SCOPO:
// - Preparare TUTTI i dati necessari
//   allo step successivo (creazione Business BE)
//
// ======================================================
import BusinessForm from "../../../../../components/business/BusinessForm";

export default function StepBusinessInfo({ onNext }: { onNext: () => void }) {
  return <BusinessForm onComplete={onNext} />;
}
