import "./checkout.css";
import { useCheckout } from "./useCheckout";

import CartReview from "./steps/CartReview";
import UserData from "./steps/UserData";
import PolicyGate from "./steps/PolicyGate";
import PaymentPayPal from "./steps/PaymentPaypal";

export default function CheckoutPage() {
 
  const checkout = useCheckout();
  const { step } = checkout.state;

  if (step === "cart") return <CartReview {...checkout} />;
  if (step === "user") return <UserData {...checkout} />;
  if (step === "policy") return <PolicyGate {...checkout} />;
  if (step === "payment") return <PaymentPayPal state={checkout.state} />;

  return null;
}
