import "./checkout.css";
import { useCheckout } from "./useCheckout";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

import CartReview from "./steps/CartReview";
import UserData from "./steps/UserData";
import PolicyGate from "./steps/PolicyGate";
import PaymentPayPal from "./steps/PaymentPaypal";

export default function CheckoutPage() {
  // 🔹 1. Hook SEMPRE chiamato
  const { user, loading } = useCurrentUser();

  // 🔹 2. Hook checkout SEMPRE chiamato (mai condizionale)
  const checkout = useCheckout(
    user?.id ?? "",
    user?.email ?? ""
  );

  // 🔹 3. Stati di guardia DOPO gli hook
  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (!user) {
    window.location.href =
      "/user/login?redirect=/user/checkout";
    return null;
  }

  // 🔹 4. Render step
  const { step } = checkout.state;

  if (step === "cart") {
    return <CartReview {...checkout} />;
  }

  if (step === "user") {
    return <UserData {...checkout} />;
  }

  if (step === "policy") {
    return (
      <PolicyGate
        userId={user.id}
        email={user.email}
        onAccepted={async () => {
          await checkout.submitOrder();
          checkout.next("payment");
        }}
      />
    );
  }

  if (step === "payment") {
    return <PaymentPayPal state={checkout.state} />;
  }

  return null;
}
