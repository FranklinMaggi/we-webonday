import "./checkout.css";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCheckout } from "./useCheckout";
import CartReview from "./steps/CartReview";
import { MainLayout } from "../../../components/layouts/MainLayout";

export default function CheckoutPage() {
  <MainLayout></MainLayout>
  
  const { user, loading } = useCurrentUser();

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
