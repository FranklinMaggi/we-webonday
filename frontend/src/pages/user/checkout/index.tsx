import "./checkout.css";
import { useCheckout } from "./useCheckout";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

import CartReview from "./steps/CartReview";
import UserData from "./steps/UserData";
import PolicyGate from "./steps/PolicyGate";
import PaymentPayPal from "./steps/PaymentPaypal";

export default function CheckoutPage() {
  const { user, loading } = useCurrentUser();

  if (loading) return <p>Caricamento...</p>;

  if (!user) {
    window.location.href =
      "/user/login?redirect=/user/checkout";
    return null;
  }

  const checkout = useCheckout(user.id, user.email);

  const { step } = checkout.state;

  if (step === "cart") return <CartReview {...checkout} />;
  if (step === "user") return <UserData {...checkout} />;
  if (step === "policy") return <PolicyGate {...checkout} />;
  if (step === "payment") return <PaymentPayPal state={checkout.state} />;

  return null;
}
