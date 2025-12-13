import { useState, useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "../../../utils/cookieConsent";
import { cartStore } from "../../../lib/cartStore";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

// Client ID PayPal (NON è segreto, può stare qui)
const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ??
  "AflIiDW49-yYddybFt68Vr95D6XaUhPpVWE1VdhebTfoyDgHWd6tMCacWd9wkJg9a6iDYiG2HiPNoTJm";

export default function CheckoutPage() {
  // ===========================
  // CARRELLO
  // ===========================
  const items = cartStore.getState().items;
  const total = items.reduce((s, i) => s + i.total, 0);
  const visitorId = getOrCreateVisitorId();

  // ===========================
  // UTENTE CORRENTE (sessione Google)
  // ===========================
  const { user, loading } = useCurrentUser();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [piva, setPiva] = useState("");
  const [businessName, setBusinessName] = useState("");

  // Serve per collegare PayPal → ordine interno
  const lastOrderIdRef = useRef<string | null>(null);
  const paypalMountedRef = useRef(false);

  // ===========================
  // STEP 1: forza login con Google e pre‐compila email
  // ===========================
  useEffect(() => {
    if (loading) return;

    // Non loggato → reindirizza verso Google OAuth
    if (!user) {
      const redirectUrl = window.location.origin + "/user/checkout";
      const loginUrl =
        `${import.meta.env.VITE_API_URL}/api/user/google/auth?redirect=` +
        encodeURIComponent(redirectUrl);

      window.location.href = loginUrl;
      return;
    }

    // Loggato → abbiamo user.id + email
    setUserId(user.id);
    try {
      localStorage.setItem("webonday_user_v1", user.id);
    } catch {
      // se localStorage non è disponibile, pazienza
    }

    if (user.email) {
      setEmail(user.email);
    }
  }, [user, loading]);

  // ===========================
  // STEP 2: controllo policy dopo login
  // ===========================
  useEffect(() => {
    if (!userId) return;

    async function checkPolicy() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/policy/status?userId=${userId}`
        );
        const out = await res.json();

        if (!out.accepted) {
          window.location.href =
            "/policy?redirect=" + encodeURIComponent("/user/checkout");
        }
      } catch (err) {
        console.error("Errore policy check", err);
      }
    }

    checkPolicy();
  }, [userId]);

  // ===========================
  // ORDINE CLASSICO (bonifico / manuale)
  // ===========================
  const submitOrder = async () => {
    if (!userId) {
      alert("Devi essere loggato.");
      return;
    }

    if (!email) {
      alert("Inserisci un'email valida.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          userId,
          email,
          piva,
          businessName,
          items,
          total,
        }),
      });

      const out = await res.json();

      if (!out.ok) {
        console.error("Ordine fallito", out);
        alert("Errore nella creazione dell'ordine.");
        return;
      }

      cartStore.getState().clear();
      window.location.href = "/thankyou";
    } catch (err) {
      console.error("Errore submitOrder", err);
      alert("Errore imprevisto nella creazione dell'ordine.");
    }
  };

  // ===========================
  // PAYPAL CHECKOUT (pagamento diretto)
  // ===========================
  useEffect(() => {
    // condizioni minime per montare PayPal
    if (!userId || items.length === 0 || total <= 0) return;
    if (!email) return; // PayPal richiede email
    if (paypalMountedRef.current) return;

    const paypalButtonsConfig = {
      createOrder: async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/paypal/create-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              email,
              piva,
              businessName,
              items,
              total,
            }),
          }
        );

        const out = await res.json();

        if (!out.ok) {
          console.error("PayPal create-order error", out);
          throw new Error("Create order failed");
        }

        lastOrderIdRef.current = out.orderId;
        return out.paypalOrderId;
      },

      onApprove: async (data: any) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/payment/paypal/capture-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paypalOrderId: data.orderID,
                orderId: lastOrderIdRef.current,
              }),
            }
          );

          const out = await res.json();

          if (!out.ok) {
            console.error("PayPal capture error", out);
            alert("Errore durante la conferma del pagamento.");
            return;
          }

          cartStore.getState().clear();
          window.location.href =
            "/thankyou?orderId=" +
            encodeURIComponent(lastOrderIdRef.current ?? "");
        } catch (err) {
          console.error("Errore onApprove PayPal", err);
          alert("Errore imprevisto durante la conferma del pagamento.");
        }
      },

      onError: (err: any) => {
        console.error("PayPal Buttons error", err);
        alert("Errore PayPal.");
      },
    };

    function mountPaypal() {
      // @ts-ignore
      window.paypal.Buttons(paypalButtonsConfig).render(
        "#paypal-button-container"
      );
      paypalMountedRef.current = true;
    }

    // Script già caricato
    // @ts-ignore
    if (window.paypal) {
      mountPaypal();
      return;
    }

    // Carico SDK PayPal
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
    script.async = true;
    script.onload = mountPaypal;
    document.body.appendChild(script);
  }, [userId, email, total, items.length]);

  // ===========================
  // SCHERMATE DI CARICAMENTO
  // ===========================
  if (loading || !userId) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Prepariamo il tuo account…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Il carrello è vuoto.</p>
      </div>
    );
  }

  // ===========================
  // RENDER NORMALE
  // ===========================
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <h3>Totale: € {total.toFixed(2)}</h3>

      <input
        placeholder="Email (obbligatoria)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Partita IVA (opzionale)"
        value={piva}
        onChange={(e) => setPiva(e.target.value)}
      />

      <input
        placeholder="Nome azienda (opzionale)"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />

      <button onClick={submitOrder} style={{ marginTop: 20 }}>
        Conferma ordine (bonifico / manuale)
      </button>

      <div style={{ marginTop: 32 }}>
        <h3>Paga con PayPal</h3>
        <div id="paypal-button-container" />
        {!email && (
          <p style={{ color: "red" }}>
            Inserisci l’email per abilitare PayPal
          </p>
        )}
      </div>
    </div>
  );
}
