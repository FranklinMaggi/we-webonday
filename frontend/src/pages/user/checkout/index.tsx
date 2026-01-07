import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../store/auth.store";

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

  return (
    <CartReview
      cart={[]} // ⚠️ TEMP: i prezzi li mostrerà il backend
      submitOrder={checkout.submitCheckout}
    />
  );
}
