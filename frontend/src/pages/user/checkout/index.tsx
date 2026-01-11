
import { useParams } from "react-router-dom";

import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../lib/store/auth.store";
import BusinessForm from "../../../components/business/BusinessForm";
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
