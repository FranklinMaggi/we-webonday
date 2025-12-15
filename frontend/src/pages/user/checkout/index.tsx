import "./checkout.css";
import { useCheckout } from "./useCheckout";
import { useEffect } from "react";

import CartReview from "./steps/CartReview";
import UserData from "./steps/UserData";
import PolicyGate from "./steps/PolicyGate";
import PaymentPayPal from "./steps/PaymentPaypal";

export default function CheckoutPage() {
  useEffect(() => {
    const userId = localStorage.getItem("webonday_user_v1");
    if (!userId) {
      window.location.href =
        "/user/login?redirect=" + encodeURIComponent("/user/checkout");
    }
  }, []);
  const checkout = useCheckout();
  const { step } = checkout.state;

  if (step === "cart") return <CartReview {...checkout} />;
  if (step === "user") return <UserData {...checkout} />;
  if (step === "policy") return <PolicyGate {...checkout} />;
  if (step === "payment") return <PaymentPayPal state={checkout.state} />;

  return null;
}
