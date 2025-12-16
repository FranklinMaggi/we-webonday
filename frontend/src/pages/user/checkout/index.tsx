// src/pages/user/checkout/index.tsx
import "./checkout.css";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";

export default function CheckoutPage() {
  const { user, loading } = useCurrentUser();

  // hook SEMPRE chiamato
  const checkout = useCheckout(user?.email ?? "");

  if (loading) {
    return <p>Caricamento…</p>;
  }

  if (!user) {
    window.location.href = "/user/login?redirect=/user/checkout";
    return null;
  }

  return (
    <CartReview
      cart={checkout.cart}
      userId={user.id}
      email={user.email}
      submitOrder={checkout.submitOrder}
    />
  );
}
