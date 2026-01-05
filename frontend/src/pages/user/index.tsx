// ======================================================
// FE || pages/user/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD
//
// RUOLO:
// - Landing page post-login per l’utente
//
// OBIETTIVO:
// - Far percepire all’utente che ora è “dentro”
// - Offrire continuità con il flusso di acquisto
//
// INVARIANTI:
// - Nessun redirect automatico
// - Nessuna logica business
// - CTA chiare e poche
//
// ======================================================

import { Link, Navigate} from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { cartStore } from "../../lib/cart/cartStore";
import { useEffect } from "react";
export default function UserDashboardPage() {

  const cartItems = cartStore((s) => s.items);

  // 🔒 Guard minimo
  const { user, ready, explicitLogin, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!ready && explicitLogin) {
      fetchUser();
    }
  }, [ready, explicitLogin, fetchUser]);
  
  if (!ready) {
    return <p>Caricamento…</p>;
  }
  
  if (!user) {
    return <Navigate to="/user/login?redirect=/user" replace />;
  }
  

  if (!ready) {
    return <p>Caricamento…</p>;
  }

  return (
    <div className="user-dashboard">
      {/* ===========================
         HEADER
      =========================== */}
      <header className="user-dashboard-header">
        <h1>Benvenuto</h1>
        <p className="user-email">{user?.email}</p>
        <p className="user-status">Area cliente attiva</p>
      </header>

      {/* ===========================
         AZIONI PRINCIPALI
      =========================== */}
      <section className="user-dashboard-actions">
        <Link to="/" className="user-cta primary">
          Esplora soluzioni
        </Link>

        {cartItems.length > 0 && (
          <Link to="/user/checkout" className="user-cta accent">
            Vai al checkout ({cartItems.length})
          </Link>
        )}
      </section>

      {/* ===========================
         TRUST / REASSURANCE
      =========================== */}
      <section className="user-dashboard-info">
        <p>
          I tuoi dati sono protetti.  
          Potrai configurare il tuo progetto dopo l’ordine.
        </p>
      </section>
    </div>
  );
}
