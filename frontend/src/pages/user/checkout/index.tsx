import { useEffect, useMemo, useRef, useState } from "react";
import { cartStore, type CartItem } from "../../../lib/cartStore";
import { getCurrentUser, getGoogleLoginUrl, type CurrentUser } from "../../../lib/authApi";
import { createOrder } from "../../../lib/ordersApi";
import { fetchLatestPolicy, acceptPolicyApi } from "../../../lib/policyApi";
import { loadPaypalSdk, mountPaypalButtons } from "../../../lib/payments/paypal";
import "./checkout.css";

const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ??
  "AflIiDW49-yYddybFt68Vr95D6XaUhPpVWE1VdhebTfoyDgHWd6tMCacWd9wkJg9a6iDYiG2HiPNoTJm";

type PendingAction = "order" | "paypal" | null;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function CheckoutPage() {
  // ===========================
  // CARRELLO (reattivo)
  // ===========================
  const [items, setItems] = useState<CartItem[]>(cartStore.getState().items);

  useEffect(() => {
    return cartStore.subscribe((state) => setItems(state.items));
  }, []);

  const total = useMemo(
    () => items.reduce((s, i) => s + (Number(i.total) || 0), 0),
    [items]
  );

  // ===========================
  // AUTH
  // ===========================
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user = await getCurrentUser();
        if (!cancelled) setCurrentUser(user);
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Se non loggato: redirect deterministico
  useEffect(() => {
    if (!authChecked) return;
    if (currentUser) return;

    const redirectAbs = window.location.origin + "/user/checkout";
    window.location.href = getGoogleLoginUrl(redirectAbs);
  }, [authChecked, currentUser]);

  // ===========================
  // FORM
  // ===========================
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [piva, setPiva] = useState("");
  const [businessName, setBusinessName] = useState("");

  // Precompila dai dati utente
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.email) setEmail(currentUser.email);
    if (currentUser.firstName) setFirstName(currentUser.firstName);
    if (currentUser.lastName) setLastName(currentUser.lastName);
  }, [currentUser]);

  // ===========================
  // POLICY GATING (coerente)
  // ===========================
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [policyVersion, setPolicyVersion] = useState<string | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isAcceptingPolicy, setIsAcceptingPolicy] = useState(false);

  async function ensurePolicyVersionLoaded() {
    if (policyVersion) return policyVersion;
    const latest = await fetchLatestPolicy();
    setPolicyVersion(latest.version);
    return latest.version;
  }

  async function handleAcceptPolicy() {
    if (!currentUser?.id) {
      alert("Sessione non valida. Effettua di nuovo l’accesso.");
      return;
    }

    setIsAcceptingPolicy(true);
    try {
      const v = await ensurePolicyVersionLoaded();

      await acceptPolicyApi({
        userId: currentUser.id,
        email: email || currentUser.email,
        policyVersion: v,
      });

      setPolicyAccepted(true);
      setShowPolicyModal(false);

      if (pendingAction === "order") await submitOrder();
      if (pendingAction === "paypal") {
        document.getElementById("paypal-section")?.scrollIntoView({ behavior: "smooth" });
      }

      setPendingAction(null);
    } catch (err) {
      console.error("[Checkout] accept policy error:", err);
      alert("Errore durante l’accettazione della policy.");
    } finally {
      setIsAcceptingPolicy(false);
    }
  }

  function requestPolicyThen(action: PendingAction) {
    if (!isValidEmail(email)) {
      alert("Inserisci un’email valida (obbligatoria).");
      return;
    }
    if (items.length === 0 || total <= 0) {
      alert("Il carrello è vuoto o il totale non è valido.");
      return;
    }

    if (policyAccepted) {
      if (action === "order") void submitOrder();
      if (action === "paypal") {
        document.getElementById("paypal-section")?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setPendingAction(action);
    setShowPolicyModal(true);
    void ensurePolicyVersionLoaded();
  }

  // ===========================
  // ORDINE MANUALE
  // ===========================
  const [submitting, setSubmitting] = useState(false);

  async function submitOrder() {
    if (submitting) return;
    if (!isValidEmail(email)) {
      alert("Inserisci un’email valida.");
      return;
    }
    if (items.length === 0 || total <= 0) {
      alert("Il carrello è vuoto o il totale non è valido.");
      return;
    }
    if (!policyAccepted) {
      requestPolicyThen("order");
      return;
    }

    setSubmitting(true);
    try {
      const out = await createOrder({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        billingAddress: billingAddress || undefined,
        piva: piva || undefined,
        businessName: businessName || undefined,
        items,
        total,
      });

      cartStore.getState().clear();
      window.location.href = "/thankyou?orderId=" + encodeURIComponent(out.orderId);
    } catch (err) {
      console.error("[Checkout] createOrder error:", err);
      alert("Errore durante la creazione dell’ordine.");
    } finally {
      setSubmitting(false);
    }
  }

  // ===========================
  // PAYPAL
  // ===========================
  const lastOrderIdRef = useRef<string | null>(null);
  const paypalMountedRef = useRef(false);

  useEffect(() => {
    if (!policyAccepted) return;
    if (items.length === 0 || total <= 0) return;
    if (!isValidEmail(email)) return;
    if (paypalMountedRef.current) return;

    let cancelled = false;

    async function initPaypal() {
      try {
        await loadPaypalSdk(PAYPAL_CLIENT_ID);
        if (cancelled) return;

        mountPaypalButtons("#paypal-button-container", {
          createOrder: async () => {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payment/paypal/create-order`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
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

            const out = await res.json().catch(() => null);

            if (!res.ok || !out) {
              console.error("[PayPal] create-order HTTP error:", res.status, out);
              throw new Error("Create order failed");
            }

            // Compatibilità: alcuni BE rispondono con { ok, paypalOrderId, orderId }
            const paypalOrderId = out.paypalOrderId ?? out.id ?? out.orderID;
            const orderId = out.orderId ?? out.internalOrderId;

            if (!paypalOrderId) {
              console.error("[PayPal] create-order missing paypalOrderId:", out);
              throw new Error("Missing PayPal order id");
            }

            lastOrderIdRef.current = orderId ?? null;
            return paypalOrderId;
          },

          onApprove: async (data: any) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/payment/paypal/capture-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paypalOrderId: data?.orderID,
                    orderId: lastOrderIdRef.current,
                  }),
                }
              );

              const out = await res.json().catch(() => null);

              if (!res.ok) {
                console.error("[PayPal] capture HTTP error:", res.status, out);
                alert("Errore durante la conferma del pagamento PayPal.");
                return;
              }

              // se BE usa { ok: false } lo intercetti
              if (out && out.ok === false) {
                console.error("[PayPal] capture failed:", out);
                alert("Pagamento non confermato. Riprova o contattaci.");
                return;
              }

              cartStore.getState().clear();

              const orderId = lastOrderIdRef.current ?? out?.orderId ?? "";
              window.location.href = "/thankyou" + (orderId ? `?orderId=${encodeURIComponent(orderId)}` : "");
            } catch (err) {
              console.error("[PayPal] onApprove error:", err);
              alert("Errore imprevisto durante la conferma PayPal.");
            }
          },

          onError: (err: any) => {
            console.error("[PayPal] Buttons error:", err);
            alert("Errore PayPal.");
          },
        });

        paypalMountedRef.current = true;
      } catch (err) {
        console.error("[Checkout] PayPal init error:", err);
      }
    }

    initPaypal();

    return () => {
      cancelled = true;
    };
  }, [policyAccepted, items.length, total, email]);

  // ===========================
  // RENDER: blocchi chiari
  // ===========================
  if (!authChecked) {
    return (
      <div className="checkout-page">
        <div className="checkout-shell">
          <p>Verifica accesso in corso…</p>
        </div>
      </div>
    );
  }

  // Se non loggato stiamo già redirectando
  if (!currentUser) {
    return (
      <div className="checkout-page">
        <div className="checkout-shell">
          <p>Reindirizzamento al login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="checkout-header">
          <h1>Completa il tuo ordine</h1>
          <p>Rivedi il riepilogo, verifica i dati e scegli il pagamento.</p>
        </header>

        <div className="checkout-grid">
          <section className="checkout-card checkout-summary">
            <h2>Riepilogo ordine</h2>

            {items.length === 0 ? (
              <p className="empty-cart-text">
                Il carrello è vuoto. Torna alla home e aggiungi un prodotto.
              </p>
            ) : (
              <>
                <ul className="checkout-items">
                  {items.map((item, idx) => (
                    <li key={idx} className="checkout-item">
                      <div className="item-main">
                        <span className="item-title">{item.title}</span>
                        <span className="item-price">€ {item.total.toFixed(2)}</span>
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
                  <span className="checkout-total-value">€ {total.toFixed(2)}</span>
                </div>
              </>
            )}
          </section>

          <section className="checkout-card checkout-form">
            <h2>Dati cliente & fatturazione</h2>

            <div className="checkout-form-grid">
              <div className="field">
                <label>Nome</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nome" />
              </div>

              <div className="field">
                <label>Cognome</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Cognome" />
              </div>

              <div className="field">
                <label>Email (obbligatoria)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@azienda.it" />
              </div>

              <div className="field">
                <label>Telefono (opzionale)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 ..." />
              </div>

              <div className="field">
                <label>Indirizzo di fatturazione (opzionale)</label>
                <input value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="Via, numero civico, città" />
              </div>

              <div className="field">
                <label>Partita IVA (opzionale)</label>
                <input value={piva} onChange={(e) => setPiva(e.target.value)} placeholder="IT00000000000" />
              </div>

              <div className="field">
                <label>Nome azienda (opzionale)</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="La tua azienda" />
              </div>
            </div>

            <div className="policy-inline">
              <span>
                Prima del pagamento è necessario accettare{" "}
                <a href="/policy" target="_blank" rel="noreferrer">
                  Privacy &amp; Termini
                </a>{" "}
                e il trattamento dati per fatturazione e contatto.
              </span>

              {policyAccepted && <span className="policy-ok">✓ Policy accettata</span>}
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => requestPolicyThen("order")}
                disabled={items.length === 0 || submitting}
              >
                {submitting ? "Invio ordine..." : "Conferma ordine (bonifico / manuale)"}
              </button>
            </div>

            <div id="paypal-section" className="checkout-paypal-block">
              <div className="paypal-header">
                <h3>Paga con PayPal</h3>
                <p>Pagamento sicuro via PayPal o carta collegata.</p>
              </div>

              <button
                type="button"
                className="btn-paypal"
                onClick={() => requestPolicyThen("paypal")}
                disabled={items.length === 0}
              >
                Procedi con PayPal
              </button>

              {!policyAccepted && (
                <p className="paypal-note">
                  Cliccando su “Procedi con PayPal” ti mostreremo prima Privacy e Termini da accettare.
                </p>
              )}

              <div id="paypal-button-container" className="paypal-buttons-slot" />
            </div>
          </section>
        </div>
      </div>

      {showPolicyModal && (
        <div className="policy-modal-backdrop">
          <div className="policy-modal">
            <h2>Privacy Policy &amp; Termini</h2>
            <p>
              Prima di completare il pagamento è necessario accettare la nostra Privacy Policy e i Termini di Servizio.
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
                {isAcceptingPolicy ? "Salvo accettazione..." : "Accetto e procedo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
