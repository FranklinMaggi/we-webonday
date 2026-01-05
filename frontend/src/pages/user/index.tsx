// ======================================================
// FE || pages/user/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD
//
// RUOLO:
// - Landing page post-login
// - Punto di continuità dopo checkout o login
//
// INVARIANTI:
// - Nessun fetchUser()
// - Nessun redirect automatico aggressivo
//
// ======================================================

import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { cartStore } from "../../lib/cart/cartStore";

export default function UserDashboardPage() {
  const { user, ready } = useAuthStore();
  const cartItems = cartStore((s) => s.items);

  // ⏳ attesa bootstrap
  if (!ready) {
    return <p>Caricamento…</p>;
  }

  // 🔒 accesso non autorizzato
  if (!user) {
    return <Navigate to="/user/login?redirect=/user" replace />;
  }

  return (
    <div className="user-dashboard">
      {/* ===========================
         HEADER
      =========================== */}
      <header className="user-dashboard-header">
        <h1>Benvenuto</h1>
        <p className="user-email">{user.email}</p>
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
          Sei autenticato in modo sicuro.  
          Puoi continuare il tuo percorso quando vuoi.
        </p>
      </section>
    </div>
  );
}
