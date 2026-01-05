// ======================================================
// FE || pages/user/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD (BUYER SAFE)
//
// RUOLO:
// - Landing privata post-login
// - Punto di orientamento per l’utente autenticato
//
// OBIETTIVO:
// - Far percepire il cambio di stato (visitor → user)
// - Dare sicurezza
// - Indicare UN prossimo passo
//
// NON FA:
// - NON mostra cataloghi
// - NON mostra dati complessi
// - NON sostituisce la home pubblica
//
// ======================================================

import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function UserDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  // ===========================
  // AUTH GUARD
  // ===========================
  if (ready && !user) {
    return <Navigate to="/user/login" replace />;
  }

  if (!ready) {
    return <p style={{ padding: 24 }}>Caricamento…</p>;
  }

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="user-dashboard">
      {/* HEADER STATO */}
      <header className="user-dashboard__header">
        <h1>Area Cliente</h1>
        <p className="user-dashboard__identity">
          Sei connesso come <strong>{user.email}</strong>
        </p>
      </header>

      {/* CARD CENTRALE */}
      <section className="user-dashboard__card">
        <h2>Benvenuto su WebOnDay</h2>

        <p>
          Ora hai uno spazio riservato dove puoi gestire i tuoi ordini
          e continuare il tuo percorso in modo sicuro.
        </p>

        {/* CTA PRIMARIA */}
        <div className="user-dashboard__cta">
          <Link to="/user/orders" className="wd-btn wd-btn--primary">
            Vai ai tuoi ordini
          </Link>
        </div>
      </section>

      {/* AZIONI SECONDARIE */}
      <section className="user-dashboard__actions">
        <Link to="/solutions" className="wd-link">
          Esplora le soluzioni
        </Link>

        <Link to="/user/account" className="wd-link">
          Gestisci il tuo account
        </Link>
      </section>
    </div>
  );
}
