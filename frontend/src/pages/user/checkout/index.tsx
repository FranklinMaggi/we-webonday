import { useState, useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "../../../utils/cookieConsent";
import { cartStore } from "../../../lib/cartStore";

// ===========================
// PAYPAL LIVE CLIENT ID
// ===========================
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// ===========================
// UTILS
// ===========================
const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function CheckoutPage() {
  // ===========================
  // CART
  // ===========================
  const items = cartStore.getState().items;
  const total = items.reduce((s, i) => s + i.total, 0);
  const visitorId = getOrCreateVisitorId();

  // ===========================
  // USER
  // ===========================
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("userId");
      const stored = localStorage.getItem("webonday_user_v1");

      const finalId = fromUrl || stored;

      if (fromUrl) {
        localStorage.setItem("webonday_user_v1", fromUrl);
        window.history.replaceState({}, "", window.location.pathname);
      }

      setUserId(finalId);
    } catch {
      setUserId(null);
    }
  }, []);

  // Redirect login
  useEffect(() => {
    if (userId === undefined) return;
    if (!userId) {
      window.location.href =
        "/user/login?redirect=" +
        encodeURIComponent("/user/checkout");
    }
  }, [userId]);

  // ===========================
  // PREFILL EMAIL DA GOOGLE
  // ===========================
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((out) => {
        if (out.ok && out.user?.email) {
          setEmail(out.user.email);
        }
      })
      .catch(console.error);
  }, [userId]);

  // ===========================
  // POLICY
  // ===========================
  useEffect(() => {
    if (!userId) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/status?userId=${userId}`
    )
      .then((r) => r.json())
      .then((out) => {
        if (!out.accepted) {
          window.location.href =
            "/policy?redirect=" +
            encodeURIComponent("/user/checkout");
        }
      });
  }, [userId]);

  // ===========================
  // FORM
  // ===========================
  const [piva, setPiva] = useState("");
  const [businessName, setBusinessName] = useState("");

  // ===========================
  // PAYPAL REFS
  // ===========================
  const lastOrderIdRef = useRef<string | null>(null);
  const paypalMountedRef = useRef(false);

  // ===========================
  // ORDINE MANUALE
  // ===========================
  const submitManualOrder = async () => {
    if (!userId) return alert("Devi essere loggato.");
    if (!isValidEmail(email)) return alert("Email non valida.");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/order`,
      {
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
      }
    );

    const out = await res.json();
    if (!out.ok) {
      console.error(out);
      return alert("Errore creazione ordine.");
    }

    cartStore.getState().clear();
    window.location.href = "/thankyou";
  };

  // ===========================
  // PAYPAL CHECKOUT (LIVE)
  // ===========================
  useEffect(() => {
    if (
      !userId ||
      items.length === 0 ||
      total <= 0 ||
      !isValidEmail(email) ||
      paypalMountedRef.current
    ) {
      return;
    }

    const config = {
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
          console.error(out);
          throw new Error("Create order failed");
        }

        lastOrderIdRef.current = out.orderId;
        return out.paypalOrderId;
      },

      onApprove: async (data: any) => {
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
          console.error(out);
          return alert("Errore conferma pagamento.");
        }

        cartStore.getState().clear();
        window.location.href =
          "/thankyou?orderId=" +
          encodeURIComponent(lastOrderIdRef.current!);
      },

      onError: (err: any) => {
        console.error("PayPal error", err);
        alert("Errore PayPal.");
      },
    };

    const mount = () => {
      // @ts-ignore
      window.paypal.Buttons(config).render("#paypal-button-container");
      paypalMountedRef.current = true;
    };

    // @ts-ignore
    if (window.paypal) return mount();

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
    script.async = true;
    script.onload = mount;
    document.body.appendChild(script);
  }, [userId, email, total, items.length]);

  // ===========================
  // RENDER
  // ===========================
  if (userId === undefined) {
    return <p>Verifica accesso in corso…</p>;
  }

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

      <button onClick={submitManualOrder} style={{ marginTop: 20 }}>
        Conferma ordine (manuale)
      </button>

      <div style={{ marginTop: 32 }}>
        <h3>Paga con PayPal</h3>

        <div
          style={{
            opacity: isValidEmail(email) ? 1 : 0.4,
            pointerEvents: isValidEmail(email) ? "auto" : "none",
          }}
        >
          <div id="paypal-button-container" />
        </div>

        {!isValidEmail(email) && (
          <p style={{ color: "red" }}>
            Inserisci un’email valida per procedere con PayPal
          </p>
        )}
      </div>
    </div>
  );
}
