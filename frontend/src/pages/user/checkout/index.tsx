import "./checkout.css";
import { useEffect } from "react";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../store/auth.store";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const checkout = useCheckout(user?.email ?? "");

  useEffect(() => {
    if (ready && !user) {
      window.location.href = "/user/login?redirect=/user/checkout";
    }
  }, [ready, user]);

  if (!ready) {
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
