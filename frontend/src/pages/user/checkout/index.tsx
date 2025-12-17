import "./checkout.css";
import { useEffect } from "react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";

export default function CheckoutPage() {
  const { user, loading } = useCurrentUser();
  const checkout = useCheckout(user?.email ?? "");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/user/login?redirect=/user/checkout";
    }
  }, [loading, user]);

  if (loading) {
    return <p>Caricamento…</p>;
  }

  if (!user) {
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
