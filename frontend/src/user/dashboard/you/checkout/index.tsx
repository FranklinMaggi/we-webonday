// ======================================================
// FE || pages/user/checkout/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CHECKOUT ENTRY (ROUTE / PARAM ALIGNMENT)
//
// STATO ATTUALE (INTENZIONALE):
// ------------------------------------------------------
// Questo componente legge:
//   const { configurationId } = useParams<{ configurationId: string }>();
//
// Tuttavia, il router espone attualmente:
//   path: "checkout"
//
// Quindi:
// - configurationId NON è garantito dalla route
// - Il flusso funziona solo se configurationId
//   arriva da redirect controllato o contesto esterno
//
// ------------------------------------------------------
// DECISIONE ARCHITETTURALE:
// - ❌ NON modificare ora la route
// - ❌ NON cambiare la firma del componente
// - ❌ NON introdurre fallback impliciti
//
// ------------------------------------------------------
// MOTIVO:
// - La scelta corretta dipende dal dominio Orders
// - Checkout è una FASE, non una risorsa autonoma
//
// ------------------------------------------------------
// STEP FUTURO DEDICATO (ORDERS):
// - Valutare una delle seguenti:
//   A) /user/checkout/:configurationId
//   B) /user/checkout + configurationId via store
//
// FINO AD ALLORA:
// - Questo file è BLOCCATO STRUTTURALMENTE
// - Qualsiasi refactor qui è VIETATO
//
// ======================================================

import { useParams } from "react-router-dom";

import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../../shared/lib/store/auth.store";
import BusinessForm from "../../../editor/business/form-pages/BusinessForm";
import { useCheckout } from "./useCheckout";
import { useEffect ,useState } from "react";
export default function CheckoutPage() {
  const { user, ready } = useAuthStore();
  const { configurationId } = useParams<{ configurationId: string }>();

  const checkout = useCheckout(configurationId ?? "");

  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/checkout";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;
  if (!configurationId) return <p>Configurazione mancante</p>;

  const [businessDone, setBusinessDone] = useState(false);

  if (!businessDone) {
    return (
      <BusinessForm
      solutionSeed={null}
        onComplete={() => setBusinessDone(true)}
      />
    );
  }
  if (checkout.loading) {
    return <p>Preparazione checkout…</p>;
  }
  
  if (!checkout.configuration || !checkout.pricing) {
    return <p>Dati checkout non disponibili</p>;
  }
  return (
    <CartReview
    submitOrder={checkout.submitCheckout}
    configuration={checkout.configuration}
    pricing={checkout.pricing}
    loading={checkout.loading}
  />
  
  );
  
}
