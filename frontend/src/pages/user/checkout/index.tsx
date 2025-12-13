import { useState, useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "../../../utils/cookieConsent";
import { cartStore } from "../../../lib/cartStore";

// Client ID PayPal (NON è segreto, può stare qui)
const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ??
  "AflIiDW49-yYddybFt68Vr95D6XaUhPpVWE1VdhebTfoyDgHWd6tMCacWd9wkJg9a6iDYiG2HiPNoTJm";

export default function CheckoutPage() {
  const items = cartStore.getState().items;
  const total = items.reduce((s, i) => s + i.total, 0);

  const visitorId = getOrCreateVisitorId();

  // ===========================
  // STATE
  // ===========================
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [piva, setPiva] = useState("");
  const [businessName, setBusinessName] = useState("");

  // Serve per collegare PayPal → ordine interno
  const lastOrderIdRef = useRef<string | null>(null);
  const paypalMountedRef = useRef(false);

  // ===========================
  // INIZIALIZZAZIONE userId + email da URL / localStorage
  // ===========================
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const userIdFromUrl = params.get("userId");
      const emailFromUrl = params.get("email");

      const storedUserId = localStorage.getItem("webonday_user_v1");
      let finalUserId = storedUserId;

      // userId passato da backend dopo login Google → SORGENTE AUTORITARIA
      if (userIdFromUrl) {
        finalUserId = userIdFromUrl;
        localStorage.setItem("webonday_user_v1", userIdFromUrl);
      }

      if (emailFromUrl) {
        setEmail(emailFromUrl);
      }

      // pulizia URL (tolgo query param dalla barra)
      const { origin, pathname } = window.location;
      window.history.replaceState({}, "", origin + pathname);

      setUserId(finalUserId); // può essere string o null
    } catch {
      setUserId(null);
    }
  }, []);

  // ===========================
  // PREFILL EMAIL DA /api/user/me (FALLBACK)
  // ===========================
  useEffect(() => {
    // se non ho userId → niente
    if (!userId) return;
    // se l'email è già stata settata da query → non chiamo l'API
    if (email) return;

    async function fetchUserEmail() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {
            credentials: "include",
          }
        );

        const out = await res.json();

        if (out.ok && out.user?.email) {
          setEmail(out.user.email);
        }
      } catch (err) {
        console.error("Errore recupero utente", err);
      }
    }

    fetchUserEmail();
  }, [userId, email]);

  // ===========================
  // REDIRECT AL LOGIN SE NON AUTENTICATO
  // ===========================
  useEffect(() => {
    if (userId === undefined) return;

    if (!userId) {
      window.location.href =
        "/user/login?redirect=" + encodeURIComponent("/user/checkout");
    }
  }, [userId]);

  // ===========================
  // POLICY CHECK
  // ===========================
  useEffect(() => {
    if (!userId) return;

    async function checkPolicy() {
      const res = await fetch(
        import.meta.env.VITE_API_URL +
          "/api/policy/status?userId=" +
          userId
      );
      const out = await res.json();

      if (!out.accepted) {
        window.location.href =
          "/policy?redirect=" +
          encodeURIComponent("/user/checkout");
      }
    }

    checkPolicy();
  }, [userId]);

  // ===========================
  // ORDINE CLASSICO (BONIFICO / MANUALE)
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

    const res = await fetch(import.meta.env.VITE_API_URL + "/api/order", {
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
  };

  // ===========================
  // PAYPAL CHECKOUT (pagamento diretto)
  // ===========================
  useEffect(() => {
    if (!userId || items.length === 0 || total <= 0) return;
    if (!email) return; // PayPal richiede email
    if (paypalMountedRef.current) return;

    const paypalButtonsConfig = {
      createOrder: async () => {
        const res = await fetch(
          import.meta.env.VITE_API_URL +
            "/api/payment/paypal/create-order",
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
        const res = await fetch(
          import.meta.env.VITE_API_URL +
            "/api/payment/paypal/capture-order",
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
          encodeURIComponent(lastOrderIdRef.current!);
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

    // script già in pagina
    // @ts-ignore
    if (window.paypal) {
      mountPaypal();
      return;
    }

    // carica SDK PayPal
    const script = document.createElement("script");
    script.src =
      `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
    script.async = true;
    script.onload = mountPaypal;
    document.body.appendChild(script);
  }, [userId, email, total, items.length]);

  // ===========================
  // RENDER
  // ===========================
  if (userId === undefined) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Verifica accesso in corso…</p>
      </div>
    );
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
