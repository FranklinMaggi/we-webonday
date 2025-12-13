import { useState, useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "../../../utils/cookieConsent";
import { cartStore } from "../../../lib/cartStore";
import "./checkout.css";

const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ??
  "AflIiDW49-yYddybFt68Vr95D6XaUhPpVWE1VdhebTfoyDgHWd6tMCacWd9wkJg9a6iDYiG2HiPNoTJm";

type PendingAction = "order" | "paypal" | null;

export default function CheckoutPage() {
  const items = cartStore.getState().items;
  const total = items.reduce((s, i) => s + i.total, 0);
  const visitorId = getOrCreateVisitorId();

  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [piva, setPiva] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isAcceptingPolicy, setIsAcceptingPolicy] = useState(false);

  const lastOrderIdRef = useRef<string | null>(null);
  const paypalMountedRef = useRef(false);

  // ===========================
  // INIZIALIZZA userId + email da URL / localStorage
  // ===========================
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const userIdFromUrl = params.get("userId");
      const emailFromUrl = params.get("email");

      const storedUserId = localStorage.getItem("webonday_user_v1");
      let finalUserId = storedUserId;

      if (userIdFromUrl) {
        finalUserId = userIdFromUrl;
        localStorage.setItem("webonday_user_v1", userIdFromUrl);
      }

      if (emailFromUrl) {
        setEmail(emailFromUrl);
      }

      const { origin, pathname } = window.location;
      window.history.replaceState({}, "", origin + pathname);

      setUserId(finalUserId);
    } catch {
      setUserId(null);
    }
  }, []);

  // ===========================
  // PREFILL DATI UTENTE DA /api/user/me
  // ===========================
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          { credentials: "include" }
        );
        const out = await res.json();

        if (out.ok && out.user) {
          const u = out.user as any;
          if (!email && u.email) setEmail(u.email);
          if (u.firstName) setFirstName(u.firstName);
          if (u.lastName) setLastName(u.lastName);
          if (u.phone) setPhone(u.phone);
          // se in futuro salvi billing info lato user, puoi prefillare anche qui
        }
      } catch (err) {
        console.error("Errore recupero utente", err);
      }
    }

    fetchUser();
  }, [userId, email]);

  // ===========================
  // REDIRECT AL LOGIN SE NON AUTENTICATO (Google)
  // ===========================
  useEffect(() => {
    if (userId === undefined) return;

    if (!userId) {
      const redirectUrl = window.location.origin + "/user/checkout";
      const loginUrl =
        `${import.meta.env.VITE_API_URL}/api/user/google/auth?redirect=` +
        encodeURIComponent(redirectUrl);
      window.location.href = loginUrl;
    }
  }, [userId]);

  // ===========================
  // ORDINE CLASSICO (BONIFICO / MANUALE)
  // ===========================
  const doSubmitOrder = async () => {
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
        firstName,
        lastName,
        phone,
        billingAddress,
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
  // ENTRY POINT UNICO PER I BOTTONI DI ACQUISTO
  // ===========================
  const requestPolicyThen = (action: PendingAction) => {
    if (!userId) {
      alert("Devi essere loggato.");
      return;
    }
    if (!email) {
      alert("Inserisci un'email valida.");
      return;
    }

    if (policyAccepted) {
      if (action === "order") {
        void doSubmitOrder();
      } else if (action === "paypal") {
        document
          .getElementById("paypal-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setPendingAction(action);
    setShowPolicyModal(true);
  };

  const handleSubmitOrderClick = () => {
    requestPolicyThen("order");
  };

  const handlePaypalCtaClick = () => {
    requestPolicyThen("paypal");
  };

  // ===========================
  // ACCETTAZIONE POLICY (MODAL)
  // ===========================
  const handleAcceptPolicy = async () => {
    if (!userId) return;
    setIsAcceptingPolicy(true);
    try {
      const latestRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/policy/version/latest`
      );
      const latest = await latestRes.json();

      await fetch(`${import.meta.env.VITE_API_URL}/api/policy/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          policyVersionId: latest.id ?? latest.versionId ?? latest.version?.id,
        }),
      });

      setPolicyAccepted(true);
      setShowPolicyModal(false);

      if (pendingAction === "order") {
        await doSubmitOrder();
      } else if (pendingAction === "paypal") {
        setTimeout(() => {
          document
            .getElementById("paypal-section")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }

      setPendingAction(null);
    } catch (err) {
      console.error("Errore accettazione policy", err);
      alert("Errore durante l'accettazione della policy. Riprova.");
    } finally {
      setIsAcceptingPolicy(false);
    }
  };

  // ===========================
  // PAYPAL CHECKOUT (abilitato SOLO dopo policy)
  // ===========================
  useEffect(() => {
    if (!userId || items.length === 0 || total <= 0) return;
    if (!email) return;
    if (!policyAccepted) return;
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
              firstName,
              lastName,
              phone,
              billingAddress,
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

    // @ts-ignore
    if (window.paypal) {
      mountPaypal();
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
    script.async = true;
    script.onload = mountPaypal;
    document.body.appendChild(script);
  }, [
    userId,
    email,
    firstName,
    lastName,
    phone,
    billingAddress,
    total,
    items.length,
    policyAccepted,
  ]);

  // ===========================
  // RENDER
  // ===========================
  if (userId === undefined) {
    return (
      <div className="checkout-page">
        <div className="checkout-shell">
          <p>Verifica accesso in corso…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="checkout-header">
          <h1>Completa il tuo ordine</h1>
          <p>
            Rivedi il riepilogo, verifica i dati di fatturazione e scegli il
            metodo di pagamento.
          </p>
        </header>

        <div className="checkout-grid">
          {/* SX – RIEPILOGO CARRELLO */}
          <section className="checkout-card checkout-summary">
            <h2>Riepilogo ordine</h2>

            {items.length === 0 ? (
              <p className="empty-cart-text">
                Il carrello è vuoto. Torna alla home per aggiungere un
                prodotto.
              </p>
            ) : (
              <>
                <ul className="checkout-items">
                  {items.map((item, idx) => (
                    <li key={idx} className="checkout-item">
                      <div className="item-main">
                        <span className="item-title">{item.title}</span>
                        <span className="item-price">
                          € {item.total.toFixed(2)}
                        </span>
                      </div>
                      {item.options?.length > 0 && (
                        <ul className="item-options">
                          {item.options.map((opt) => (
                            <li key={opt.id}>
                              {opt.label} · € {opt.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="checkout-total">
                  <span>Totale</span>
                  <span className="checkout-total-value">
                    € {total.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </section>

          {/* DX – DATI & PAGAMENTO */}
          <section className="checkout-card checkout-form">
            <h2>Dati cliente & fatturazione</h2>

            <div className="checkout-form-grid">
              <div className="field">
                <label>Nome</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nome"
                />
              </div>

              <div className="field">
                <label>Cognome</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Cognome"
                />
              </div>

              <div className="field">
                <label>Email (obbligatoria)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@azienda.it"
                />
              </div>

              <div className="field">
                <label>Telefono (opzionale)</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 ..."
                />
              </div>

              <div className="field">
                <label>Indirizzo di fatturazione (opzionale)</label>
                <input
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Via, numero civico, città"
                />
              </div>

              <div className="field">
                <label>Partita IVA (opzionale)</label>
                <input
                  value={piva}
                  onChange={(e) => setPiva(e.target.value)}
                  placeholder="IT00000000000"
                />
              </div>

              <div className="field">
                <label>Nome azienda (opzionale)</label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="La tua azienda"
                />
              </div>
            </div>

            <div className="policy-inline">
              <span>
                Prima del pagamento è necessario accettare{" "}
                <a href="/policy" target="_blank" rel="noreferrer">
                  Privacy &amp; Termini
                </a>{" "}
                e il trattamento dei dati per finalità di fatturazione e
                contatto.
              </span>
              {policyAccepted && (
                <span className="policy-ok">✓ Policy accettata</span>
              )}
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmitOrderClick}
                disabled={items.length === 0}
              >
                Conferma ordine (bonifico / manuale)
              </button>
            </div>

            <div id="paypal-section" className="checkout-paypal-block">
              <div className="paypal-header">
                <h3>Paga con PayPal</h3>
                <p>
                  Paga in modo sicuro con il tuo account PayPal o con una carta
                  collegata.
                </p>
              </div>

              <button
                type="button"
                className="btn-paypal"
                onClick={handlePaypalCtaClick}
                disabled={items.length === 0}
              >
                Procedi con PayPal
              </button>

              {!policyAccepted && (
                <p className="paypal-note">
                  Cliccando su “Procedi con PayPal” ti mostreremo prima Privacy
                  e Termini da accettare.
                </p>
              )}

              <div
                id="paypal-button-container"
                className="paypal-buttons-slot"
              />
            </div>
          </section>
        </div>
      </div>

      {/* MODAL POLICY */}
      {showPolicyModal && (
        <div className="policy-modal-backdrop">
          <div className="policy-modal">
            <h2>Privacy Policy &amp; Termini</h2>
            <p>
              Prima di completare il pagamento è necessario accettare la nostra
              Privacy Policy e i Termini di Servizio, inclusa la gestione dei
              tuoi dati di contatto e fatturazione.
            </p>
            <p className="policy-link-text">
              Puoi leggere il testo completo qui:{" "}
              <a href="/policy" target="_blank" rel="noreferrer">
                apri policy in nuova scheda
              </a>
            </p>

            <div className="policy-modal-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setShowPolicyModal(false);
                  setPendingAction(null);
                }}
                disabled={isAcceptingPolicy}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn-accept"
                onClick={handleAcceptPolicy}
                disabled={isAcceptingPolicy}
              >
                {isAcceptingPolicy
                  ? "Salvo accettazione..."
                  : "Accetto e procedo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
