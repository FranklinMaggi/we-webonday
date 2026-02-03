francescomaggi@MacBook-Pro user % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/shared'
francescomaggi@MacBook-Pro shared % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/shared
DATE: 2026-01-31T11:10:39Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: LegalLayout.tsx
LANG: tsx
SIZE:     4568 bytes
----------------------------------------
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/Legal/legal.css";

interface LegalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// Mappa pagine legali (immutabile)
export const legalPages = [
  { id: "statuto", title: "Statuto", path: "/legal/statuto" },
  { id: "regolamento", title: "Regolamento Interno", path: "/legal/regolamento" },
  { id: "contrattocliente", title: "Contratto Cliente", path: "/legal/contrattocliente" },
  { id: "termini", title: "Termini di Servizio", path: "/legal/termini" },
  { id: "privacy", title: "Privacy Policy", path: "/legal/privacy" },
  { id: "proprieta", title: "Proprietà Intellettuale", path: "/legal/proprietaintellettuale" },
];

export default function LegalLayout({ children, title, subtitle }: LegalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina pagina corrente (memo: evita findIndex ad ogni render non necessario)
  const currentIndex = useMemo(() => {
    const idx = legalPages.findIndex((p) => p.path === location.pathname);
    return idx === -1 ? 0 : idx; // fallback robusto
  }, [location.pathname]);

  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "none">("none");

  // Gestione timeout: evita setTimeout pendenti se l'utente naviga velocemente
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= legalPages.length) return;

      // Stop eventuali timeout precedenti: previene race di navigazione + slide state incoerente
      clearPendingTimeout();

      setSlideDirection(index > currentIndex ? "right" : "left");

      timeoutRef.current = window.setTimeout(() => {
        navigate(legalPages[index].path);
        setSlideDirection("none");
        timeoutRef.current = null;
      }, 250);
    },
    [currentIndex, navigate, clearPendingTimeout]
  );

  // Cleanup globale su unmount (evita memory leak)
  useEffect(() => {
    return () => clearPendingTimeout();
  }, [clearPendingTimeout]);

  // Frecce tastiera
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPage(currentIndex + 1);
      if (e.key === "ArrowLeft") goToPage(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, goToPage]);

  // Swipe touch per mobile
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;

      if (delta > 80) goToPage(currentIndex - 1);
      if (delta < -80) goToPage(currentIndex + 1);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, goToPage]);

  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">{title || legalPages[currentIndex]?.title}</h1>
        {subtitle && <p className="legal-subtitle">{subtitle}</p>}
      </header>

      {currentIndex > 0 && (
        <button className="legal-arrow left" onClick={() => goToPage(currentIndex - 1)}>
          ❮
        </button>
      )}

      {currentIndex < legalPages.length - 1 && (
        <button className="legal-arrow right" onClick={() => goToPage(currentIndex + 1)}>
          ❯
        </button>
      )}

      <div className="legal-pagination">
        {legalPages.map((p, i) => (
          <span
            key={p.id}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => goToPage(i)}
          />
        ))}
      </div>

      <section className={`legal-content slide-${slideDirection}`}>{children}</section>

      <footer className="legal-footer">© {new Date().getFullYear()} WebOnDay S.r.l. — Documenti Legali</footer>
    </div>
  );
}


=== FILE: Style/css/admin/MainLayout/adminLayout.css
LANG: css
SIZE:     2746 bytes
----------------------------------------
/* ======================================================
   FE||Style/css/admin/MainLayout/adminLayout.css
   ======================================================

   AI-SUPERCOMMENT — ADMIN MAIN LAYOUT

   RUOLO:
   - Layout strutturale della dashboard admin

   RESPONSABILITÀ:
   - Sidebar / header admin
   - Griglia principale dashboard
   - Contenitore delle viste admin

   NON FA:
   - Stile delle singole feature (orders, users, ecc.)
   - Logica permessi
   - Fetch dati

   CONNECT POINT:
   - Admin routing
   - Admin pages

   PERCHÉ ESISTE:
   - Separare completamente UI admin dal frontend pubblico
   - Ridurre il rischio di contaminazioni stilistiche
====================================================== */
.admin-container {
    display: flex;
    min-height: 100vh;
    background: #0e0e0e;
    color: #eee;
    font-family: "Inter", sans-serif;
  }
  
  .admin-sidebar {
    width: 260px;
    padding: 2rem 1rem;
    background: #111;
    border-right: 2px solid #333;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .admin-logo {
    font-size: 1.6rem;
    font-weight: 700;
    color: #0ff0fc;
    text-shadow: 0 0 8px #0ff0fc;
    text-align: center;
  }
  
  .admin-sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .admin-sidebar nav a {
    color: #ddd;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: 0.2s;
  }
  
  .admin-sidebar nav a:hover {
    background: #0ff0fc33;
    color: #0ff0fc;
  }
  
  .logout-btn {
    margin-top: auto;
    padding: 0.6rem 1rem;
    background: #ff3040;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.2s;
  }
  
  .logout-btn:hover {
    background: #ff000f;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  .admin-nav {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.5;
    padding: 0 1rem;
  }
  .admin-sidebar nav a.active {
    background: #0ff0fc33;
    color: #0ff0fc;
    font-weight: 600;
  }
  .nav-badge {
    margin-left: 6px;
    color: orange;
    font-size: 1.2rem;
    line-height: 1;
  }
  /* ======================================================
   ADMIN ISOLATION GUARD
   ====================================================== */

.admin-container {
  background: #0e0e0e;
  color: #eee;
}

.admin-container * {
  box-sizing: border-box;
}
.admin-container {
  position: relative;
  z-index: 10;
}


=== FILE: Style/css/admin/base/admin-card.css
LANG: css
SIZE:     1632 bytes
----------------------------------------
/* ======================================================
   ADMIN — CARD (CANONICAL)
====================================================== */

  
  /* =========================
     CARD GENERICA
  ========================= */
  .admin-card {
    background: #111;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  /* =========================
     CARD TITLES
  ========================= */
  .admin-card h3 {
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: #0ff0fc;
  }
  
  /* =========================
     FORM ELEMENTS
  ========================= */
  .admin-card label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
    font-size: 0.9rem;
    color: #ccc;
  }
  
  .admin-card input,
  .admin-card textarea,
  .admin-card select {
    background: #0e0e0e;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 8px 10px;
    color: #eee;
    font-size: 0.95rem;
  }
  
  .admin-card input:focus,
  .admin-card textarea:focus,
  .admin-card select:focus {
    outline: none;
    border-color: #0ff0fc;
    box-shadow: 0 0 0 2px #0ff0fc33;
  }
  
  /* =========================
     SELECT STATUS
  ========================= */
  .admin-card select {
    cursor: pointer;
  }
  
  /* =========================
     OPTIONS LIST
  ========================= */
  .admin-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .admin-card li {
    padding: 8px 0;
    border-bottom: 1px solid #333;
    font-size: 0.95rem;
  }
  
  .admin-card li:last-child {
    border-bottom: none;
  }
  


=== FILE: Style/css/admin/base/admin-drawer.css
LANG: css
SIZE:      446 bytes
----------------------------------------
/* ======================================================
   ADMIN — DRAWER (ISOLATED)
====================================================== */

.admin-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    height: 100%;
    background: #0e0e0e;
    color: #eee;
    border-left: 1px solid #333;
    box-shadow: -6px 0 20px rgba(0,0,0,.6);
    z-index: 1000;
  }
  
  .admin-drawer * {
    box-sizing: border-box;
  }
  

=== FILE: Style/css/admin/base/admin-table.css
LANG: css
SIZE:      733 bytes
----------------------------------------
/* ======================================================
   ADMIN — TABLE (CANONICAL)
====================================================== */

.admin-table {
    width: 100%;
    border-collapse: collapse;
    background: #0e0e0e;
    color: #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #2a2a2a;
    text-align: left;
    vertical-align: middle;
  }
  
  .admin-table thead {
    background: rgba(15, 240, 252, 0.08);
  }
  
  .admin-table th {
    font-size: 13px;
    font-weight: 600;
    color: #0ff0fc;
    white-space: nowrap;
  }
  
  .admin-table tbody tr:hover {
    background: rgba(255,255,255,0.03);
  }
  

=== FILE: Style/css/admin/login.css
LANG: css
SIZE:     1684 bytes
----------------------------------------
/* ======================================================
   ADMIN LOGIN — ISOLATED
====================================================== */

.admin-login-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #0e0e0e;
    color: #eee;
  }
  
  .admin-login-card {
    width: 100%;
    max-width: 420px;
    padding: 32px;
    background: #111;
    border: 1px solid #333;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }
  
  .admin-login-title {
    margin-bottom: 24px;
    font-size: 1.4rem;
    font-weight: 700;
    color: #0ff0fc;
    text-align: center;
  }
  
  /* ================= FIELD ================= */
  
  .admin-login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }
  
  .admin-login-label {
    font-size: 0.85rem;
    color: #aaa;
  }
  
  .admin-login-input {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #444;
    background: #0e0e0e;
    color: #eee;
    font-size: 0.95rem;
  }
  
  .admin-login-input:focus {
    outline: none;
    border-color: #0ff0fc;
    box-shadow: 0 0 0 2px #0ff0fc33;
  }
  
  /* ================= ERROR ================= */
  
  .admin-login-error {
    margin-bottom: 14px;
    color: #ff4d4f;
    font-size: 0.85rem;
  }
  
  /* ================= ACTION ================= */
  
  .admin-login-submit {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    background: #0ff0fc;
    color: #000;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .admin-login-submit:hover {
    background: #6df7ff;
  }
  

=== FILE: Style/css/admin/orders/orders.css
LANG: css
SIZE:     2429 bytes
----------------------------------------
/* ======================================================
   FE||Style/css/admin/orders/orders.css
   ======================================================

   AI-SUPERCOMMENT — ADMIN ORDERS VIEW

   RUOLO:
   - Styling della sezione ordini in dashboard admin

   RESPONSABILITÀ:
   - Tabelle ordini
   - Dettaglio ordine
   - Evidenziazione stati

   NON FA:
   - Logica di business
   - Transizioni di stato
   - Scrittura dati

   CONNECT POINT:
   - Admin orders FE
   - Admin main layout

   PERCHÉ ESISTE:
   - Isolare uno dei domini admin più critici
   - Mantenere leggibilità e controllo visivo
====================================================== */
.admin-dashboard {
    padding: 20px;
    font-family: sans-serif;
  }
  
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .kpi-card {
    padding: 20px;
    background: #1a1a1a;
    color: #0ff0fc;
    border-radius: 12px;
    border: 1px solid #0ff0fc55;
    text-align: center;
  }
  
  .filters button {
    margin-right: 8px;
  }


  
  .admin-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 10px;
    border-bottom: 1px solid #333;
  }.admin-order-details {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .order-status {
    margin-bottom: 1rem;
  }
  
  .order-section {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #111;
    border-radius: 8px;
  }
  
  .order-items {
    list-style: none;
    padding: 0;
  }
  
  .order-item {
    border-bottom: 1px solid #333;
    padding: 1rem 0;
  }
  
  .order-options {
    margin-left: 1rem;
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .item-total {
    font-weight: 600;
    margin-top: 0.5rem;
  }
  
  .order-total {
    font-size: 1.2rem;
    text-align: right;
    margin-top: 2rem;
  }


.btn-confirm {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-confirm:hover { opacity: 0.9; }
.btn-cancel:hover { opacity: 0.9; }
.admin-product-edit {
  max-width: 900px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
}




.admin-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}


=== FILE: Style/css/admin/products/editProducts.css
LANG: css
SIZE:     2538 bytes
----------------------------------------
/* ======================================================
   FE || Style/admin/products/editProduct.css
   ======================================================

   ADMIN — EDIT PRODUCT PAGE

   RUOLO:
   - Styling pagina dettaglio prodotto admin

   RESPONSABILITÀ:
   - Layout editor prodotto
   - Card sezioni (core / pricing / options)
   - Azioni di salvataggio
   - Stato visivo chiaro

   NON FA:
   - Logica
   - Validazioni
   - Fetch dati

   CONNECT POINT:
   - pages/admin/products/[id].tsx
====================================================== */

/* =========================
   PAGE WRAPPER
========================= */
.admin-product-edit {
    max-width: 960px;
    margin: 0 auto;
  }
  
  /* =========================
     HEADER
  ========================= */
  .admin-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .admin-header h1 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #0ff0fc;
  }
  
  .admin-header button {
    background: transparent;
    border: 1px solid #0ff0fc55;
    color: #0ff0fc;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .admin-header button:hover {
    background: #0ff0fc22;
  }

  /* =========================
     FOOTER ACTIONS
  ========================= */
  .admin-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  
  /* =========================
     SAVE BUTTON
  ========================= */
  .admin-actions button {
    background: #0ff0fc;
    color: #000;
    border: none;
    padding: 10px 18px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .admin-actions button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .admin-actions button:hover:not(:disabled) {
    background: #6df7ff;
  }
  
  /* =========================
     ERROR STATE
  ========================= */
  .admin-product-edit p {
    color: #ff4d4f;
    font-weight: 500;
  }
  .admin-page label {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #6df7ff;
  }
  
  .admin-page input,
  .admin-page textarea,
  .admin-page select {
    margin-top: 6px;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    background: #fff;
    color: #111827;
  }
  
  .admin-page input:disabled {
    background: #f3f4f6;
    color: #6b7280;
  }
  

=== FILE: Style/css/admin/products/products.css
LANG: css
SIZE:     1714 bytes
----------------------------------------
/*style/admin/products/products*/

 /* =========================
   ADMIN DRAWER — DARK
========================= */
.admin-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background: #0e0e0e;          /* 🔥 DARK */
  color: #eee;
  border-left: 1px solid #333;
  box-shadow: -6px 0 20px rgba(0,0,0,.6);
  z-index: 1000;
}

/* HEADER */
.admin-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #333;
}

.admin-drawer__header h3 {
  color: #0ff0fc;
  font-size: 1.1rem;
}

/* CONTENT */
.admin-drawer__content {
  padding: 16px;
  font-size: 0.95rem;
  color: #ccc;
}

.admin-drawer__content p {
  margin-bottom: 12px;
  color: #bbb;
}

.admin-drawer__content ul {
  padding-left: 18px;
}

.admin-drawer__content li {
  margin-bottom: 6px;
}

/* BUTTONS */
.admin-drawer button {
  margin-top: 12px;
  width: 100%;
  background: #0ff0fc;
  color: #000;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.admin-drawer button + button {
  margin-top: 8px;
  background: transparent;
  color: #0ff0fc;
  border: 1px solid #0ff0fc55;
}
.admin-page button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
}

.admin-page button:hover {
  background: #1d4ed8;
}

.admin-page button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-cancel {
  background: #dc2626;
}

.btn-cancel:hover {
  background: #b91c1c;
}

.link-button {
  background: none;
  color: #2563eb;
  padding: 0;
  font-size: 14px;
  border: none;
  text-decoration: underline;
}


=== FILE: Style/css/admin/products/select.css
LANG: css
SIZE:     2010 bytes
----------------------------------------
.wd-select-wrapper {
    position: relative;
    width: 100%;
    display: block;
  }
  
.admin-page select {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  
    background-color: var(--admin-bg);
    color: var(--admin-text);
  
    border: 1.5px solid var(--neon-cyan);
    border-radius: 8px;
  
    padding: 10px 36px 10px 12px;
    font-size: 14px;
    font-weight: 500;
  
    background-image:
      linear-gradient(45deg, transparent 50%, var(--neon-cyan) 50%),
      linear-gradient(135deg, var(--neon-cyan) 50%, transparent 50%),
      linear-gradient(to right, transparent, transparent);
    background-position:
      calc(100% - 20px) calc(50% - 3px),
      calc(100% - 14px) calc(50% - 3px),
      100% 0;
    background-size:
      6px 6px,
      6px 6px,
      2.5em 2.5em;
    background-repeat: no-repeat;
  
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
  }
  .admin-page select:focus {
    outline: none;
    border-color: var(--neon-cyan-strong);
    box-shadow:
      0 0 0 2px var(--neon-cyan-glow),
      0 0 12px rgba(34, 211, 238, 0.25);
  }
  .admin-page select:focus {
    outline: none;
    border-color: var(--neon-cyan-strong);
    box-shadow:
      0 0 0 2px var(--neon-cyan-glow),
      0 0 12px rgba(34, 211, 238, 0.25);
  }
  .admin-page select:hover {
    background-color: #f0fdff;
  }
  .wd-select-wrapper::after {
    content: "";
    position: absolute;
    right: 14px;
    top: 50%;
  
    width: 8px;
    height: 8px;
  
    border-right: 2px solid var(--neon-cyan);
    border-bottom: 2px solid var(--neon-cyan);
  
    transform: translateY(-60%) rotate(45deg);
    pointer-events: none;
  }
  .admin-page select:focus {
    outline: none;
    border-color: var(--neon-cyan-strong);
    box-shadow:
      0 0 0 2px var(--neon-cyan-glow),
      0 0 12px rgba(34, 211, 238, 0.25);
  }
  
  .admin-page select:hover {
    background-color: #f0fdff;
  }
  

=== FILE: Style/css/admin/products/table.css
LANG: css
SIZE:      245 bytes
----------------------------------------



  
 
  .admin-table tr:focus-within {
    outline: 2px solid var(--neon-cyan);
    outline-offset: -2px;
  }
  @media (max-width: 768px) {
    .admin-table th,
    .admin-table td {
      padding: 10px 8px;
      font-size: 13px;
    }
  }
  

=== FILE: Style/css/index.css
LANG: css
SIZE:     2889 bytes
----------------------------------------
/* ======================================================
   FE || STYLE ENTRYPOINT — WebOnDay
   ======================================================

   ORDINE ARCHITETTURALE (NON VIOLARE):

   1️⃣ TOKENS        → verità assoluta (variabili)
   2️⃣ BASE          → reset + typography
   3️⃣ PRIMITIVES    → badge, card, button, ecc.
   4️⃣ LAYOUT        → navbar, footer, shell
   5️⃣ COMPONENTS    → componenti complessi
   6️⃣ PAGES / ADMIN → stili di dominio

   Questo file NON contiene CSS diretto.
   Serve solo a garantire ordine e stabilità.
====================================================== */


/* ======================================================
   1️⃣ TOKENS
====================================================== */
@import "./user/base/tokens/tokens.css";


/* ======================================================
   2️⃣ BASE
====================================================== */
@import "./user/base/typography.css";


/* ======================================================
   3️⃣ PRIMITIVES
====================================================== */
@import "./user/base/primitives/badge.css";
@import "./user/base/primitives/wd-status.css";
@import "./user/base/primitives/wd-card.css";
@import "./user/base/primitives/whatsapp.css";
@import "./user/base/primitives/layout.css";
@import "./user/base/primitives/button.css";

/* ======================================================
   4️⃣ LAYOUT (PUBBLICO)
====================================================== */
@import "./user/components/navbar.css";
@import "./user/components/footer.css";
@import "./user/components/dashboard/dashboard.css";
@import "./user/components/solutions.css";
@import "./user/components/language-selector.css";
@import "./user/components/preform.css";
@import "./user/components/configuration.css";
@import "./user/components/sidebar.css";
@import "./user//pages/profile/profile.css";
@import "./user//pages/profile/you.css";

@import "./user/login.css";

/* ======================================================
   5️⃣ COMPONENTS (PUBBLICO)
======================================================
 @import "./user/components/navbar/languageSelector.css";
@import "./user/components/table/pricing-table.css";
@import "./components/business_page/business_page.css";


======================================================
   6️⃣ ADMIN (ISOLATO)
   ⚠️ l’admin è volutamente in coda
====================================================== */
@import "./admin/MainLayout/adminLayout.css";
@import "./admin/orders/orders.css";
@import "./admin/products/products.css";
@import "./admin/products/editProducts.css";
@import "./admin/products/select.css";
@import "./admin/login.css";
@import "./admin/base/admin-card.css";
@import "./admin/base/admin-table.css";
@import "./admin/base/admin-drawer.css";


=== FILE: Style/css/user/base/primitives/badge.css
LANG: css
SIZE:     2405 bytes
----------------------------------------
/* =====================================================
   PRIMITIVE — BADGE / STATUS
=====================================================

ORDINE ARCHITETTURALE:
1️⃣ TOKENS
2️⃣ BASE
3️⃣ PRIMITIVES  ← QUI
4️⃣ LAYOUT
5️⃣ PAGES

RESPONSABILITÀ:
- badge numerici
- pill
- status (pending, active, ecc.)

UTILIZZO:
- navbar
- cart
- admin
- liste

DIVIETI:
- NESSUN layout
- NESSUNA tabella
- NESSUNA logica di pagina

Uno status visivo = primitive.
===================================================== */

/* =========================
   BASE BADGE
========================= */
.wd-badge {
   display: inline-flex;
   align-items: center;
   justify-content: center;
 
   min-width: 20px;
   height: 20px;
   padding: 0 6px;
 
   font-size: 12px;
   font-weight: 600;
   line-height: 1;
 
   border-radius: 999px;
 
   background: var(--wd-badge-bg, rgba(255, 255, 255, 0.15));
   color: var(--wd-badge-text, #ffffff);
 
   white-space: nowrap;
 }
 
 /* =========================
    BADGE — NUMERIC
 ========================= */
 .wd-badge--count {
   min-width: 18px;
   height: 18px;
   padding: 0 5px;
 
   font-size: 11px;
 }
 
 /* =========================
    PILL (label testuale)
 ========================= */
 .wd-pill {
   display: inline-flex;
   align-items: center;
 
   padding: 4px 10px;
 
   font-size: 12px;
   font-weight: 500;
 
   border-radius: 999px;
 
   background: rgba(255, 255, 255, 0.08);
   color: var(--wd-text-main);
 
   white-space: nowrap;
 }
 
 /* =========================
    STATUS BASE
 ========================= */
 .wd-status {
   display: inline-flex;
   align-items: center;
   gap: 6px;
 
   padding: 4px 10px;
 
   font-size: 12px;
   font-weight: 600;
 
   border-radius: 999px;
   white-space: nowrap;
 }
 
 /* =========================
    STATUS VARIANTS
 ========================= */
 
 /* ACTIVE / OK */
 .wd-status--active {
   background: rgba(34, 197, 94, 0.15);
   color: #22c55e;
 }
 
 /* PENDING / REVIEW */
 .wd-status--pending {
   background: rgba(234, 179, 8, 0.15);
   color: #eab308;
 }
 
 /* DRAFT */
 .wd-status--draft {
   background: rgba(148, 163, 184, 0.15);
   color: #94a3b8;
 }
 
 /* ERROR / REJECTED */
 .wd-status--error {
   background: rgba(220, 38, 38, 0.15);
   color: #dc2626;
 }
 
 /* DISABLED / ARCHIVED */
 .wd-status--disabled {
   background: rgba(100, 116, 139, 0.15);
   color: #64748b;
 }
 

=== FILE: Style/css/user/base/primitives/button.css
LANG: css
SIZE:     1402 bytes
----------------------------------------
/* ======================================================
   PUBLIC — BUTTON SYSTEM (CANONICAL)
====================================================== */

.wd-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  
    padding: 10px 16px;
    border-radius: 10px;
  
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  
    border: none;
    cursor: pointer;
    user-select: none;
  
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.1s ease;
  }
  .wd-btn--primary {
    background: #2563eb;
    color: #ffffff;
  }
  
  .wd-btn--primary:hover {
    background: #1d4ed8;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  }
  
  .wd-btn--primary:active {
    transform: translateY(1px);
  }
  .wd-btn--secondary {
    background: #f1f5f9;
    color: #0f172a;
  }
  
  .wd-btn--secondary:hover {
    background: #e2e8f0;
  }
  .wd-btn--ghost {
    background: transparent;
    color: #2563eb;
    padding: 8px 0;
  }
  
  .wd-btn--ghost:hover {
    text-decoration: underline;
  }
  .wd-btn[disabled],
.wd-btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.wd-btn[disabled]:hover {
  background: inherit;
}
.wd-btn--sm {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .wd-btn--lg {
    padding: 14px 20px;
    font-size: 15px;
  }
  

=== FILE: Style/css/user/base/primitives/layout.css
LANG: css
SIZE:      389 bytes
----------------------------------------
/* ======================================================
   PUBLIC — LAYOUT PRIMITIVES
====================================================== */

.page-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .page-section {
    padding: 80px 0;
  }
  
  .page-section--tight {
    padding: 48px 0;
  }
  
  .page-section--center {
    text-align: center;
  }
  

=== FILE: Style/css/user/base/primitives/wd-card.css
LANG: css
SIZE:     1711 bytes
----------------------------------------
/* =====================================================
   PRIMITIVE — WD CARD (LOCKED)
=====================================================

RUOLO:
- Primitiva visiva universale
- Base per: product, solution, roadmap, widget

INVARIANTI:
- Colori da token
- Nessuna semantica di dominio
- Nessun override inline

NON FARE:
- ❌ layout di pagina
- ❌ testi
- ❌ spacing contestuale
===================================================== */

.wd-card {
    position: relative;
  
    display: flex;
    flex-direction: column;
  
    padding: 18px;
    border-radius: 20px;
  
    background:
      radial-gradient(
        circle at top,
        rgba(34,211,238,0.10),
        transparent 45%
      ),
      rgba(255,255,255,0.04);
  
    border: 1px solid rgba(255,255,255,0.12);
  
    box-shadow:
      0 20px 50px rgba(0,0,0,0.45),
      0 0 25px rgba(34,211,238,0.12);
  
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
  }
  
  /* =========================
     INTERACTION
  ========================= */
  
  .wd-card:hover {
    transform: translateY(-2px);
    border-color: var(--wd-cyan-300);
  
    box-shadow:
      0 25px 60px rgba(0,0,0,0.6),
      0 0 30px rgba(34,211,238,0.35);
  }
  
  /* =========================
     MODIFIERS
  ========================= */
  
  /* Card cliccabile */
  .wd-card--clickable {
    cursor: pointer;
  }
  
  /* Card piatta (no hover) */
  .wd-card--static,
  .wd-card--static:hover {
    transform: none;
    box-shadow:
      0 20px 50px rgba(0,0,0,0.45),
      0 0 25px rgba(34,211,238,0.12);
  }
  
  /* Card compatta */
  .wd-card--compact {
    padding: 14px;
    border-radius: 16px;
  }
  

=== FILE: Style/css/user/base/primitives/wd-status.css
LANG: css
SIZE:     1112 bytes
----------------------------------------
/* ======================================================
   FE || PRIMITIVE — WD STATUS (SINGLE SOURCE OF TRUTH)
   ======================================================

   USO:
   <span class="wd-status wd-status--active">ACTIVE</span>

   CONSUMATORI:
   - Admin
   - Public
====================================================== */

.wd-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .4px;
    line-height: 1;
    border: 1px solid transparent;
  }
  
  /* ===== STATES ===== */
  
  .wd-status--draft {
    background: #e5e7eb;
    color: #374151;
  }
  
  .wd-status--active {
    background: #dcfce7;
    color: #166534;
  }
  
  .wd-status--pending {
    background: #fff7ed;
    color: #9a3412;
  }
  
  .wd-status--archived {
    background: #fee2e2;
    color: #991b1b;
    opacity: .8;
  }
  
  .wd-status--error {
    background: #7f1d1d;
    color: #fff;
  }
  
  .wd-status--disabled {
    background: #1f2937;
    color: #9ca3af;
  }
  

=== FILE: Style/css/user/base/primitives/whatsapp.css
LANG: css
SIZE:     1798 bytes
----------------------------------------
/* =====================================================
   WHATSAPP BUTTON – WebOnDay
   Standalone component (token driven)
===================================================== */

.whatsapp-btn {
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 999;
  
    width: var(--wd-whatsapp-size);
    height: var(--wd-whatsapp-size);
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: var(--wd-whatsapp-bg);
    border-radius: 50%;
  
    cursor: pointer;
  
    transition: transform .25s ease, box-shadow .25s ease;
  }
  
  /* ================= ICON ================= */
  
  .whatsapp-btn img,
  .whatsapp-btn svg {
    width: var(--wd-whatsapp-icon-size);
    height: var(--wd-whatsapp-icon-size);
  }
  
  /* ================= NEON VARIANT ================= */
  
  .wd-whatsapp-neon {
    box-shadow:
      0 0 10px var(--wd-whatsapp-glow-main),
      0 0 22px var(--wd-whatsapp-glow-cyan);
  
    animation: wdWhatsPulse 4.5s infinite ease-in-out;
  }
  
  /* ================= HOVER ================= */
  
  .whatsapp-btn:hover {
    transform: scale(1.12);
    box-shadow:
      0 0 18px var(--wd-whatsapp-glow-main),
      0 0 35px var(--wd-whatsapp-glow-cyan);
  }
  
  /* ================= PULSE ================= */
  
  @keyframes wdWhatsPulse {
    0% {
      transform: scale(1);
      box-shadow:
        0 0 10px var(--wd-whatsapp-glow-main),
        0 0 22px var(--wd-whatsapp-glow-cyan);
    }
    50% {
      transform: scale(1.08);
      box-shadow:
        0 0 18px var(--wd-whatsapp-glow-main),
        0 0 40px var(--wd-whatsapp-glow-cyan);
    }
    100% {
      transform: scale(1);
      box-shadow:
        0 0 10px var(--wd-whatsapp-glow-main),
        0 0 22px var(--wd-whatsapp-glow-cyan);
    }
  }
  

=== FILE: Style/css/user/base/tokens/tokens.css
LANG: css
SIZE:     4329 bytes
----------------------------------------
/* =====================================================
   TOKENS — WebOnDay
=====================================================

ORDINE ARCHITETTURALE:
1️⃣ TOKENS  ← QUI (VERITÀ ASSOLUTA)
2️⃣ BASE
3️⃣ PRIMITIVES
4️⃣ LAYOUT
5️⃣ PAGES

RESPONSABILITÀ:
- Variabili CSS globali
- Colori, radius, shadow, glow
- Token semantici (navbar, footer, buttons, ecc.)
Se serve una classe → NON è un token.
===================================================== */

:root {

    /* =====================================================
       BRAND / ACCENT
    ===================================================== */
    --wd-accent-cyan: #22d3ee;
    --wd-accent-pink: #f472b6;
  
    /* =====================================================
       BASE COLORS
    ===================================================== */
    --wd-bg: #05070a;
    --wd-panel: rgba(255,255,255,0.06);
    --wd-border: rgba(255,255,255,0.12);
  
    --wd-text-main: #e5e7eb;
    --wd-text-muted: #9ca3af;
  
    /* =====================================================
       GRAYSCALE
    ===================================================== */
    --wd-gray-50: #f9fafb;
    --wd-gray-100: #f3f4f6;
    --wd-gray-300: #d1d5db;
    --wd-gray-600: #4b5563;
    --wd-gray-700: #374151;
    --wd-gray-900: #111827;
  
    /* =====================================================
       CYAN / FUCHSIA / BLUE / AMBER
    ===================================================== */
    --wd-cyan-300: #67e8f9;
    --wd-cyan-400: #22d3ee;
    --wd-cyan-500: #06b6d4;
  
    --wd-fuchsia-300: #f9a8d4;
    --wd-fuchsia-400: #f472b6;
    --wd-fuchsia-500: #ec4899;
  
    --wd-blue-300: #93c5fd;
    --wd-blue-600: #2563eb;
    --wd-blue-700: #1d4ed8;
    --wd-blue-800: #1e40af;
  
    --wd-amber-300: #fcd34d;
    --wd-amber-400: #fbbf24;
  
    /* =====================================================
       BACKGROUND VARIANTS
    ===================================================== */
    --wd-dark-1: #050509;
    --wd-dark-2: #090912;
  
    /* =====================================================
       RADIUS
    ===================================================== */
    --wd-radius-sm: 10px;
    --wd-radius-md: 14px;
    --wd-radius-lg: 22px;
    --wd-radius-xl: 24px;
  
    /* =====================================================
       SHADOWS
    ===================================================== */
    --wd-shadow-md: 0 5px 15px rgba(0,0,0,0.15);
    --wd-shadow-lg: 0 10px 30px rgba(0,0,0,0.25);
  
    /* =====================================================
       GLOW PRESETS
    ===================================================== */
    --wd-glow-cyan: 0 0 20px rgba(34,211,238,.7);
    --wd-glow-fuchsia: 0 0 20px rgba(244,114,182,.7);
    --wd-glow-blue: 0 0 20px rgba(37,99,235,.6);
  
    /* =====================================================
       NAVBAR TOKENS
    ===================================================== */
    --wd-navbar-bg: #050816;
    --wd-navbar-border: rgba(255,255,255,0.08);
  
    --wd-navbar-text: #e5e7eb;
    --wd-navbar-text-muted: #a1a1aa;
    --wd-navbar-text-hover: #ffffff;
  
    --wd-navbar-accent-bg: #22c55e;
    --wd-navbar-accent-bg-hover: #16a34a;
    --wd-navbar-accent-text: #020617;
  
    --wd-navbar-badge-bg: #020617;
    --wd-navbar-badge-text: #22c55e;
  
    --wd-navbar-neon-cyan: rgba(34,211,238,.25);
    --wd-navbar-neon-pink: rgba(244,114,182,.18);
  
    /* =====================================================
       FOOTER TOKENS
    ===================================================== */
    --wd-footer-bg: var(--wd-gray-900);
    --wd-footer-text: var(--wd-gray-300);
    --wd-footer-title: #ffffff;
  
    --wd-footer-link: var(--wd-gray-300);
    --wd-footer-link-hover: var(--wd-cyan-300);
  
    --wd-footer-border: rgba(255,255,255,0.08);
  
    --wd-footer-neon-cyan: rgba(34,211,238,0.25);
    --wd-footer-neon-pink: rgba(244,114,182,0.25);
  
    /* =====================================================
       WHATSAPP BUTTON TOKENS
    ===================================================== */
    --wd-whatsapp-bg: #25d366;
    --wd-whatsapp-icon-size: 34px;
    --wd-whatsapp-size: 62px;
  
    --wd-whatsapp-glow-main: rgba(37, 211, 102, 0.7);
    --wd-whatsapp-glow-cyan: rgba(34, 211, 238, 0.25);
  }
  
  




=== FILE: Style/css/user/base/typography.css
LANG: css
SIZE:      931 bytes
----------------------------------------
/* =====================================================
   BASE / TYPOGRAPHY — WebOnDay
=====================================================

ORDINE ARCHITETTURALE:
1️⃣ TOKENS
2️⃣ BASE  ← QUI
3️⃣ PRIMITIVES
4️⃣ LAYOUT
5️⃣ PAGES

RESPONSABILITÀ:
- font-family globale
- dimensioni testo base
- line-height leggibile
- heading neutri

DIVIETI:
- NESSUN colore di sezione
- NESSUN layout
- NESSUN componente
===================================================== */

body {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  
    line-height: 1.5;
    font-size: 16px;
  }
  
  h1 { font-size: 2.25rem; line-height: 1.2; }
  h2 { font-size: 1.875rem; line-height: 1.25; }
  h3 { font-size: 1.5rem; line-height: 1.3; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }
  
  p {
    line-height: 1.6;
  }
  

=== FILE: Style/css/user/components/business_page/business_page.css
LANG: css
SIZE:     2038 bytes
----------------------------------------
/* ======================================================
   BUSINESS PAGE — THEME VARIABLES
   ====================================================== */

   :root {
    /* fallback (light) */
    --color-primary: #2563eb;
    --color-secondary: #93c5fd;
    --color-bg: #ffffff;
    --color-text: #020617;
  
    --font-title: system-ui, -apple-system, BlinkMacSystemFont;
    --font-body: system-ui, -apple-system, BlinkMacSystemFont;
  
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 2rem;
    --space-lg: 3rem;
  }
  /* ======================================================
   BUSINESS PAGE — LAYOUT
   ====================================================== */

   .business-page {
    max-width: 880px;
    margin: 0 auto;
    padding: var(--space-lg) var(--space-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.6;
  }
  
  .business-page__header {
    margin-bottom: var(--space-lg);
  }
  
  .business-page__title {
    font-family: var(--font-title);
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: var(--space-xs);
  }
  
  .business-page__status {
    font-size: 0.85rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    display: inline-block;
  }
  
  .business-page__status.is-complete {
    background: var(--color-secondary);
    color: var(--color-text);
  }
  
  .business-page__status.is-draft {
    background: #fde68a;
    color: #92400e;
  }
  
  .business-page__section {
    margin-bottom: var(--space-lg);
  }
  
  .business-page__section h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    border-left: 4px solid var(--color-primary);
    padding-left: var(--space-sm);
  }
  
  .business-page__hours {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .business-page__hours li {
    padding: 0.25rem 0;
    font-size: 0.95rem;
  }
  
  .business-page__footer {
    margin-top: var(--space-lg);
    font-size: 0.85rem;
    opacity: 0.65;
  }
  

=== FILE: Style/css/user/components/configuration.css
LANG: css
SIZE:     7086 bytes
----------------------------------------
/* =========================
   CONFIGURATOR BASE
========================= */

.configuration-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 20px;
  }
  
  .configuration-header {
    margin-bottom: 32px;
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
  }
  
  .configuration-header h1 {
    font-size: 1.6rem;
    margin: 0 0 4px 0;
  }
  
  .configuration-subtitle {
    opacity: 0.65;
    font-size: 0.95rem;
  }
  
  /* =========================
     BODY / WIZARD
  ========================= */
  
  .configuration-body {
    margin-top: 24px;
  }
  
  /* =========================
     STEPS
  ========================= */
  
  .step {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  
  .step h2 {
    margin-bottom: 8px;
    font-size: 1.2rem;
  }
  
  .step input,
  .step textarea,
  .step select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    background: #fff;
  }
  
  .step textarea {
    min-height: 90px;
    resize: vertical;
  }
  
  /* =========================
     CHECKBOX / EXTRA
  ========================= */
  
  .step label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
  }
  
  .step input[type="checkbox"] {
    transform: scale(1.1);
  }
  
  /* =========================
     ACTIONS
  ========================= */
  
  .actions {
    display: flex;
    gap: 12px;
    margin-top: 12px;
  }
  
  .step button {
    align-self: flex-start;
    padding: 10px 18px;
    border-radius: 6px;
    border: none;
    background: #111;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .step button:hover {
    opacity: 0.9;
  }
  
  .step button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* =========================
     REVIEW
  ========================= */
  
  .step pre {
    background: #f7f7f7;
    border-radius: 6px;
    padding: 12px;
    font-size: 0.85rem;
    overflow-x: auto;
  }
  .step-subtitle {
    font-size: 0.95rem;
    opacity: 0.75;
    margin-bottom: 20px;
  }
  .palette-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px;
  }
  
  .palette-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background: #fff;
    cursor: pointer;
    text-align: left;
  }
  
  .palette-card.active {
    border-color: #111;
  }
  
  .palette-preview {
    height: 60px;
    border-radius: 6px;
    padding: 6px;
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .palette-primary,
  .palette-secondary {
    flex: 1;
    border-radius: 4px;
  }
  
  .style-grid {
    display: grid;
    gap: 14px;
  }
  
  .style-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 14px;
    background: #fff;
    text-align: left;
    cursor: pointer;
  }
  
  .style-card.active {
    border-color: #111;
  }
  
  /* VARIANTI STILE */
  
  .style-modern {
    font-family: system-ui, sans-serif;
    letter-spacing: 0.2px;
  }
  
  .style-elegant {
    font-family: "Georgia", serif;
    letter-spacing: 0.5px;
  }
  
  .style-minimal {
    font-family: system-ui, sans-serif;
    font-weight: 400;
    opacity: 0.85;
  }
  
  .style-bold {
    font-family: system-ui, sans-serif;
    font-weight: 700;
    text-transform: uppercase;
  }
  .opening-day {
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .opening-presets {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  
  .preset {
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #fafafa;
    cursor: pointer;
    font-size: 0.85rem;
  }
  
  .preset.active {
    background: #111;
    color: #fff;
    border-color: #111;
  }
  .wizard-progress {
    margin-bottom: 32px;
  }
  
  .wizard-progress-bar {
    height: 6px;
    background: #e5e5e5;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .wizard-progress-fill {
    height: 100%;
    background: #111;
    transition: width 0.3s ease;
  }
  
  .wizard-steps {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }
  
  .wizard-step {
    background: none;
    border: none;
    text-align: center;
    cursor: default;
    opacity: 0.4;
  }
  
  .wizard-step.clickable {
    cursor: pointer;
    opacity: 1;
  }
  
  .wizard-step.active {
    font-weight: 600;
  }
  
  .wizard-step-index {
    display: block;
    font-size: 12px;
    color: #666;
  }
  
  .wizard-step-label {
    font-size: 12px;
  }
  
  /* ======================================================
   TAG PILLS — BASE
====================================================== */

.tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0 16px;
  }
  
  .tag-pills .pill {
    appearance: none;
    border: 1px solid #d0d5dd;
    background: #ffffff;
    color: #344054;
  
    padding: 6px 12px;
    border-radius: 999px;
  
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  
    pointer-events: auto;
  }
  
  /* ================= HOVER ================= */
  
  .tag-pills .pill:hover {
    background: #f9fafb;
    border-color: #98a2b3;
  }
  
  /* ======================================================
     TAG PILLS — ACTIVE
  ====================================================== */
  
  .tag-pills .pill.active {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
  }
  
  .tag-pills .pill.active:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }
  
  /* ======================================================
     ACCESSIBILITY — FOCUS
  ====================================================== */
  
  .tag-pills .pill:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
  }
  .info-box {
    background: #f7f7f7;
    border-left: 4px solid #4b7bec;
    padding: 12px 16px;
    margin: 16px 0;
    font-size: 14px;
    line-height: 1.5;
  }
  .business-address {
    margin-top: 24px;
  }
  
  .business-address legend {
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .form-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }
  
  .form-field label {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
  
  .form-field .hint {
    font-weight: normal;
    opacity: 0.6;
  }
  
  .city-autocomplete {
    position: relative;
  }
  
  .autocomplete-list {
    position: absolute;
    z-index: 10;
    background: #fff;
    border: 1px solid #ddd;
    width: 100%;
    max-height: 180px;
    overflow-y: auto;
  }
  
  .autocomplete-item {
    padding: 8px;
    cursor: pointer;
  }
  
  .autocomplete-item:hover {
    background: #f5f5f5;
  }
  
  .autocomplete-item .meta {
    display: block;
    font-size: 0.75rem;
    opacity: 0.6;
  }
  

=== FILE: Style/css/user/components/dashboard/dashboard.css
LANG: css
SIZE:      449 bytes
----------------------------------------
/* ===============================
   DASHBOARD SHELL LAYOUT
================================ */

.dashboard-shell {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }
  
  /* SIDEBAR */
  .dashboard-sidebar-wrap {
    width: 260px;          /* fissa, prevedibile */
    flex-shrink: 0;
    border-right: 1px solid #e5e7eb;
  }
  
  /* MAIN CONTENT */
  .dashboard-content {
    flex: 1;
    padding: 24px;
    overflow-x: hidden;
  }
  

=== FILE: Style/css/user/components/footer.css
LANG: css
SIZE:     3808 bytes
----------------------------------------
/* =====================================================
   LAYOUT — FOOTER
=====================================================

ORDINE ARCHITETTURALE:
1️⃣ TOKENS
2️⃣ BASE
3️⃣ PRIMITIVES
4️⃣ LAYOUT  ← QUI
5️⃣ PAGES

RESPONSABILITÀ:
- struttura footer
- grid colonne
- titoli e link
- glow decorativo

DIVIETI:
- logica di pagina
- contenuto specifico
- comportamenti interattivi complessi

Il footer chiude l’esperienza, non la guida.
===================================================== */

/*// ======================================================
// FE || components/footer/footer.classes.ts
// ======================================================
// FOOTER — CLASS REGISTRY (LOCAL)
//
// Responsabilità:
// - Mappare classi semantiche del footer
// - Nessun CSS
// ======================================================

export const footerClasses = {
    /** SHELL 
    footerShell: "page-section page-section--footer footer-shell",
  
    /** LAYOUT 
    footerLayout: "footer-layout footer-layout--grid",
  
    /** SECTIONS 
    footerSection: "footer-section",
  
    /** ELEMENTS 
    sectionTitle: "footer-section-title",
    footerLink: "footer-link",
  
    /** META 
    footerMeta: "footer-meta" 
/* =====================================================
   FOOTER — CANONICAL (CLEAN)
===================================================== */

/* =========================
   SHELL
========================= */
.footer-shell {
  position: relative;
  overflow: hidden;

  padding: 48px 32px 24px;

  background: var(--wd-footer-bg);
  color: var(--wd-footer-text);

  border-top: 1px solid var(--wd-footer-border);
}

/* =========================
   GLOW DECORATIVO
========================= */
.footer-shell::before {
  content: "";
  position: absolute;
  inset: 0;

  background: radial-gradient(
    ellipse at bottom center,
    rgba(34,211,238,0.25),
    rgba(236,72,153,0.18),
    transparent 70%
  );

  filter: blur(22px);
  pointer-events: none;
}

/* =========================
   LAYOUT GRID
========================= */
.footer-layout--grid {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
}

/* =========================
   SECTIONS
========================= */
.footer-section {
  min-width: 0;
}

/* =========================
   TITOLI SEZIONE
========================= */
.footer-section-title {
  margin-bottom: 12px;

  font-size: 1rem;
  font-weight: 600;

  color: var(--wd-footer-title);

  text-shadow:
    0 0 6px rgba(255,255,255,0.6),
    0 0 14px rgba(34,211,238,0.4);
}

/* =========================
   LINK
========================= */
.footer-link {
  display: block;
  margin-bottom: 8px;
  line-height:1.4;

  color: var(--wd-footer-link);
  text-decoration: none;

  position: relative;

  transition:
    color 0.25s ease,
    text-shadow 0.25s ease;
}
.footer-section {
  padding-bottom: 8px;
}
.footer-link:hover {
  color: var(--wd-footer-link-hover);
  text-shadow:
    0 0 8px rgba(34,211,238,0.8),
    0 0 14px rgba(34,211,238,0.6);
}

.footer-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;

  width: 0;
  height: 2px;

  background: var(--wd-footer-link-hover);
  transition: width 0.25s ease;
}

.footer-link:hover::after {
  width: 100%;
}

/* =========================
   META / BOTTOM
========================= */
.footer-meta {
  margin-top: 32px;
  padding-top: 16px;

  text-align: center;
  font-size: 0.8rem;
  opacity: 0.65;

  border-top: 1px solid var(--wd-footer-border);
}


.solution-card__media::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255,255,255,0.0),
    rgba(0,0,0,0.08)
  );
  pointer-events: none;
}


=== FILE: Style/css/user/components/hero.css
LANG: css
SIZE:      546 bytes
----------------------------------------
/* ======================================================
   PUBLIC — HERO
====================================================== */

.hero {
    padding: 120px 0 100px;
  }
  
  .hero-inner {
    display: grid;
    gap: 32px;
    max-width: 720px;
  }
  
  .hero h1 {
    font-size: clamp(2.4rem, 5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    color: #020617;
  }
  
  .hero p {
    font-size: 1.15rem;
    line-height: 1.6;
    color: #475569;
  }
  
  .hero-cta {
    display: flex;
    gap: 16px;
    margin-top: 12px;
  }
  

=== FILE: Style/css/user/components/language-selector.css
LANG: css
SIZE:     8538 bytes
----------------------------------------
/* ======================================================
   LANGUAGE SELECTOR — NAVBAR TRIGGER
====================================================== */

.wd-lang-wrapper {
    position: relative;
  }
  
  .wd-lang-primary {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .wd-lang-btn {
    width: 36px;
    height: 36px;
  
    display: inline-flex;
    align-items: center;
    justify-content: center;
  
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.2);
  
    background: transparent;
    color: #fff;
    font-size: 18px;
  
    cursor: pointer;
    user-select: none;
  
    transition:
      background-color .2s ease,
      border-color .2s ease,
      box-shadow .2s ease,
      transform .1s ease;
  }
  
  .wd-lang-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(34,211,238,0.4);
  }
  
  .wd-lang-btn:active {
    transform: translateY(1px);
  }
  
  .wd-lang-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34,211,238,0.25);
  }
  
  /* Stato lingua attiva */
  .wd-lang-btn.active {
    border-color: rgba(34,211,238,0.7);
    box-shadow: 0 0 0 2px rgba(34,211,238,0.35);
  }
  
  /* Plus button */
  .wd-lang-btn.plus {
    font-weight: 600;
    font-size: 16px;
  }
  
  /* ======================================================
   LANGUAGE SELECTOR — OVERLAY
====================================================== */

.wd-lang-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
  
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
  
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wd-lang-overlay-panel {
    width: min(720px, 92vw);
    max-height: 85vh;
  
    background: #0e0e0e;
    color: #e5e7eb;
  
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.12);
  
    box-shadow:
      0 10px 40px rgba(0,0,0,0.6),
      0 0 0 1px rgba(34,211,238,0.15);
  
    overflow: hidden;
  }
  
  .wd-lang-overlay-panel--full {
    display: flex;
    flex-direction: column;
  }
  .wd-lang-overlay-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  
  .wd-lang-overlay-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .wd-lang-overlay-close {
    width: 32px;
    height: 32px;
  
    display: inline-flex;
    align-items: center;
    justify-content: center;
  
    border-radius: 999px;
    border: none;
  
    background: transparent;
    color: #aaa;
    font-size: 18px;
  
    cursor: pointer;
  }
  
  .wd-lang-overlay-close:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }
  
  .wd-lang-overlay-close:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34,211,238,0.25);
  }
  /* ======================================================
   LANGUAGE GRID
====================================================== */

.wd-lang-grid {
    padding: 20px;
  
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  
    overflow-y: auto;
  }
/* =====================================================
   LANGUAGE SELECTOR — CANONICAL (FULL)
===================================================== */

/* =========================
   TRIGGER (navbar)
========================= */

.wd-lang-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .wd-lang-primary {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .wd-lang-btn {
    width: 38px;
    height: 38px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
  
    font-size: 18px;
    cursor: pointer;
    color: var(--wd-navbar-text);
  
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease;
  }
  
  .wd-lang-btn:hover {
    border-color: var(--wd-neon);
    transform: translateY(-1px);
  }
  
  .wd-lang-btn.active {
    background: rgba(0, 255, 255, 0.15);
    border-color: var(--wd-neon);
  }
  
  .wd-lang-btn.plus {
    font-weight: 700;
  }
  
  /* =====================================================
     OVERLAY (desktop + mobile unified)
  ===================================================== */
  
  .wd-lang-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: rgba(5,5,15,0.75);
  
  }
  
  /* =========================
     PANEL
  ========================= */
  
  .wd-lang-overlay-panel {
    width: min(1100px, 92vw);
    max-height: 85vh;
  
    display: flex;
    flex-direction: column;
  
    padding: 24px;
    border-radius: 24px;
  
    background: rgba(5,5,15,0.75);
    border: 1px solid rgba(0, 255, 255, 0.25);
  
 
    box-shadow: 0 24px 60px rgba(0,0,0,0.55);
    
  
      animation: wd-lang-fade-in 0.18s ease-out;
  }
  
  /* =========================
     HEADER
  ========================= */
  
  .wd-lang-overlay-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .wd-lang-overlay-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--wd-navbar-text);
  }
  
  .wd-lang-overlay-close {
    width: 38px;
    height: 38px;
  
    border-radius: 999px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
  
    cursor: pointer;
    font-size: 18px;
    color: var(--wd-navbar-text);
  
    transition:
      border-color 0.2s ease,
      color 0.2s ease;
  }
  
  .wd-lang-overlay-close:hover {
    border-color: var(--wd-neon);
    color: var(--wd-neon);
  }
  
  /* =========================
     GRID
  ========================= */
  
  .wd-lang-grid {
    margin-top: 24px;
  
    display: grid;
    gap: 18px;
  
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  
    overflow-y: auto;
    padding-right: 6px;
  }
  
  /* =========================
     LANGUAGE ITEM
  ========================= */
  
  .wd-lang-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    gap: 10px;
    padding: 18px;
  
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
  
    cursor: pointer;
    color: var(--wd-navbar-text);
  
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease;
  }
  
  .wd-lang-item:hover {
    background: rgba(0, 255, 255, 0.12);
    border-color: var(--wd-neon);
    transform: translateY(-2px);
  }
  
  /* =========================
     FLAG
  ========================= */
  
  .wd-lang-item .flag {
    width: 44px;
    height: 44px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    font-size: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* =========================
     LABEL
  ========================= */
  
  .wd-lang-item .label {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    line-height: 1.2;
  }
  
  /* =====================================================
     ANIMATION
  ===================================================== */
  
  @keyframes wd-lang-fade-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
    
  }

  /* =====================================================
     RESPONSIVE
  ===================================================== */
  
  @media (max-width: 768px) {
    .wd-lang-overlay-panel {
      width: 100%;
      height: 100%;
      max-height: none;
      border-radius: 0;
      padding: 20px;
    }
  
    .wd-lang-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  
    .wd-lang-item {
      padding: 16px;
    }
  
    .wd-lang-item .label {
      font-size: 14px;
    }
  }
  @media (hover: hover) {
  .wd-lang-item:hover {
    transform: translateY(-2px);
  }
}
.wd-lang-btn:focus-visible,
.wd-lang-item:focus-visible,
.wd-lang-overlay-close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.35);
}
.wd-lang-grid::-webkit-scrollbar {
    width: 6px;
  }
  
  .wd-lang-grid::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.3);
    border-radius: 6px;
  }
  .wd-lang-overlay {
    z-index: 9999;
  }
  

=== FILE: Style/css/user/components/navbar.css
LANG: css
SIZE:     5054 bytes
----------------------------------------
/* =====================================================
   NAVBAR — CANONICAL (CLEAN)
===================================================== */

/* =========================
   SHELL
========================= */
.navbar-shell {
    position: sticky;
    top: 0;
    z-index: 1000;
  
    width: 100%;
    background: var(--wd-footer-bg);
    color: var(--wd-footer-text);
  }
  
  /* =========================
     LAYOUT
  ========================= */
  .navbar-layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
  
    padding: 12px 20px;
  }
  
  /* =========================
     ZONES
  ========================= */
  .navbar-zone {
    display: flex;
    align-items: center;
  }
  
  .navbar-zone--left {
    justify-content: flex-start;
  }
  
  .navbar-zone--center {
    justify-content: center;
    gap: 18px;
  }
  
  .navbar-zone--right {
    justify-content: flex-end;
    gap: 12px;
  }
  
  /* =========================
     BRAND
  ========================= */
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
  
    text-decoration: none;
    color: inherit;
  }
  
  .navbar-brand-icon {
    width: 32px;
    height: 32px;
  }
  
  .navbar-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  
  .navbar-brand-we {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--wd-navbar-text-muted);
  }
  
  .navbar-brand-name {
    font-size: 17px;
    font-weight: 700;
  }
  
  /* =========================
     NAV LINKS
  ========================= */
  .navbar-link {
    position: relative;
  
    padding: 6px 10px;
    min-height: 40px;
  
    font-size: 14px;
    font-weight: 500;
  
    color: var(--wd-footer-link);
    text-decoration: none;
    border-radius: 10px;
  
    transition:
      color 0.2s ease,
      background 0.2s ease,
      text-shadow 0.2s ease;
  }
  
  .navbar-link:hover {
    color: var(--wd-footer-link-hover);
    background: rgba(255,255,255,0.04);
    text-shadow:
      0 0 6px rgba(34,211,238,0.6),
      0 0 12px rgba(34,211,238,0.4);
  }
  
  .navbar-link::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 4px;
  
    height: 2px;
    width: 0;
  
    background: var(--wd-footer-link-hover);
    transition: width 0.2s ease;
  }
  
  .navbar-link:hover::after {
    width: calc(100% - 20px);
  }
  
  /* =========================
     LOGOUT BUTTON (CYAN / BLUE)
  ========================= */
  .navbar-action {
    width: 38px;
    height: 38px;
  
    display: inline-flex;
    align-items: center;
    justify-content: center;
  
    background: transparent;
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 999px;
  
    cursor: pointer;
    font-size: 18px;
    color: var(--wd-footer-link);
  
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.15s ease;
  }
  
  /* 🔵 CYAN HOVER */
  .navbar-action--logout:hover {
    color: var(--wd-footer-neon-cyan);
    border-color: var(--wd-footer-neon-cyan);
  
    background: rgba(34,211,238,0.08);
    box-shadow:
      0 0 8px rgba(34,211,238,0.6),
      0 0 16px rgba(34,211,238,0.35);
  }
  
  .navbar-action--logout:active {
    transform: scale(0.95);
  }
  
  /* =========================
     RESPONSIVE
  ========================= */
  @media (max-width: 768px) {
    .navbar-zone--center {
      display: none;
    }
  
    .navbar-brand-text {
      display: none;
    }
  }
  .page-section--navbar {
    padding: 0 !important;
    text-align: left !important;
  }
  /* ======================================================
   NAVBAR — ACTION BUTTONS (WD SYSTEM ALIGNMENT)
====================================================== */

/* Base icon button */
.navbar-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);

  background: transparent;
  color: var(--wd-navbar-text, #e5e7eb);

  cursor: pointer;
  user-select: none;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease,
    box-shadow 0.2s ease;
}

/* Hover: ghost neon light */
.navbar-action:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(34,211,238,0.35);
  box-shadow: 0 0 0 3px rgba(34,211,238,0.12);
}

/* Active press */
.navbar-action:active {
  transform: translateY(1px);
}

/* Focus (accessibilità) */
.navbar-action:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(34,211,238,0.18),
    0 0 0 1px rgba(34,211,238,0.45);
}
/* ======================================================
   NAVBAR — LINKS (ACCESSIBLE)
====================================================== */

.navbar-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34,211,238,0.16);
  background: rgba(255,255,255,0.05);
}


=== FILE: Style/css/user/components/navbar/languageSelector.css
LANG: css
SIZE:     5018 bytes
----------------------------------------
/* =====================================================
   LANGUAGE SELECTOR — CANONICAL (FULL)
===================================================== */

/* =========================
   TRIGGER (navbar)
========================= */

.wd-lang-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .wd-lang-primary {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .wd-lang-btn {
    width: 38px;
    height: 38px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
  
    font-size: 18px;
    cursor: pointer;
    color: var(--wd-navbar-text);
  
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease;
  }
  
  .wd-lang-btn:hover {
    border-color: var(--wd-neon);
    transform: translateY(-1px);
  }
  
  .wd-lang-btn.active {
    background: rgba(0, 255, 255, 0.15);
    border-color: var(--wd-neon);
  }
  
  .wd-lang-btn.plus {
    font-weight: 700;
  }
  
  /* =====================================================
     OVERLAY (desktop + mobile unified)
  ===================================================== */
  
  .wd-lang-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: rgba(5,5,15,0.75);
  
  }
  
  /* =========================
     PANEL
  ========================= */
  
  .wd-lang-overlay-panel {
    width: min(1100px, 92vw);
    max-height: 85vh;
  
    display: flex;
    flex-direction: column;
  
    padding: 24px;
    border-radius: 24px;
  
    background: rgba(5,5,15,0.75);
    border: 1px solid rgba(0, 255, 255, 0.25);
  
 
    box-shadow: 0 24px 60px rgba(0,0,0,0.55);
    
  
      animation: wd-lang-fade-in 0.18s ease-out;
  }
  
  /* =========================
     HEADER
  ========================= */
  
  .wd-lang-overlay-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .wd-lang-overlay-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--wd-navbar-text);
  }
  
  .wd-lang-overlay-close {
    width: 38px;
    height: 38px;
  
    border-radius: 999px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
  
    cursor: pointer;
    font-size: 18px;
    color: var(--wd-navbar-text);
  
    transition:
      border-color 0.2s ease,
      color 0.2s ease;
  }
  
  .wd-lang-overlay-close:hover {
    border-color: var(--wd-neon);
    color: var(--wd-neon);
  }
  
  /* =========================
     GRID
  ========================= */
  
  .wd-lang-grid {
    margin-top: 24px;
  
    display: grid;
    gap: 18px;
  
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  
    overflow-y: auto;
    padding-right: 6px;
  }
  
  /* =========================
     LANGUAGE ITEM
  ========================= */
  
  .wd-lang-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    gap: 10px;
    padding: 18px;
  
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
  
    cursor: pointer;
    color: var(--wd-navbar-text);
  
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease;
  }
  
  .wd-lang-item:hover {
    background: rgba(0, 255, 255, 0.12);
    border-color: var(--wd-neon);
    transform: translateY(-2px);
  }
  
  /* =========================
     FLAG
  ========================= */
  
  .wd-lang-item .flag {
    width: 44px;
    height: 44px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    font-size: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* =========================
     LABEL
  ========================= */
  
  .wd-lang-item .label {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    line-height: 1.2;
  }
  
  /* =====================================================
     ANIMATION
  ===================================================== */
  
  @keyframes wd-lang-fade-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
    
  }

  /* =====================================================
     RESPONSIVE
  ===================================================== */
  
  @media (max-width: 768px) {
    .wd-lang-overlay-panel {
      width: 100%;
      height: 100%;
      max-height: none;
      border-radius: 0;
      padding: 20px;
    }
  
    .wd-lang-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  
    .wd-lang-item {
      padding: 16px;
    }
  
    .wd-lang-item .label {
      font-size: 14px;
    }
  }
  @media (hover: hover) {
  .wd-lang-item:hover {
    transform: translateY(-2px);
  }
}

=== FILE: Style/css/user/components/preform.css
LANG: css
SIZE:     2922 bytes
----------------------------------------
/* ======================================================
   BUYFLOW PREFORM — STEP 0
====================================================== */

.buyflow-preform {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
  
    padding: 24px;
    margin-top: 32px;
  
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* ================= HEADER ================= */
  
  .buyflow-preform__step {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  
  .buyflow-preform__title {
    margin: 6px 0 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f172a;
  }
  
  .buyflow-preform__hint {
    margin: 6px 0 0;
    font-size: 0.9rem;
    color: #475569;
  }
  
  /* ================= BODY ================= */
  
  .buyflow-preform__body {
    margin-top: 8px;
  }
  
  /* ================= FOOTER ================= */
  
  .buyflow-preform__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  
  .buyflow-preform__next {
    font-size: 0.85rem;
    color: #64748b;
  }
  
  /* AZIONE DISCRETA, NON CTA */
  .buyflow-preform__action {
    background: transparent;
    border: none;
  
    font-size: 0.95rem;
    font-weight: 600;
    color: #2563eb;
  
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
  
    transition: background 0.2s ease;
  }
  
  .buyflow-preform__action:hover:not(:disabled) {
    background: rgba(37, 99, 235, 0.08);
  }
  
  .buyflow-preform__action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  /* ======================================================
   WD FIELD — CANONICAL FORM PRIMITIVE
====================================================== */

.wd-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  /* ================= LABEL ================= */
  
  .wd-field__label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  
    color: #475569;
    text-transform: uppercase;
  }
  
  /* ================= INPUT ================= */
  
  .wd-input {
    appearance: none;
    border: none;
    outline: none;
  
    padding: 12px 14px;
    border-radius: 10px;
  
    font-size: 0.95rem;
    line-height: 1.3;
  
    background: #f8fafc;
    color: #0f172a;
  
    border: 1px solid #e5e7eb;
  
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
  }
  
  .wd-input::placeholder {
    color: #94a3b8;
  }
  
  /* ================= FOCUS ================= */
  
  .wd-input:focus {
    border-color: #38bdf8;
    background: #ffffff;
  
    box-shadow:
      0 0 0 3px rgba(56, 189, 248, 0.25);
  }
  
  /* ================= DISABLED ================= */
  
  .wd-input:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
  

=== FILE: Style/css/user/components/product.css
LANG: css
SIZE:     1974 bytes
----------------------------------------
/* ======================================================
   PUBLIC — PRODUCT CARD
====================================================== */

.product-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 14px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    transition: 
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  
  .product-card__header {
    margin-bottom: 12px;
  }
  
  .product-card__title {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
  }
  .product-card__badge {
    display: inline-block;
    margin-top: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 999px;
    background: #dcfce7;
    color: #166534;
  }
  .product-card__description {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.5;
    margin-bottom: auto; /* 🔒 spinge CTA in basso */
  }
  .product-card__price {
    margin-top: 16px;
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .product-card__price--free {
    color: #16a34a;
  }
  
  .product-card__price--locked {
    color: #6b7280;
    font-size: 0.95rem;
  }
  .product-card__cta {
    margin-top: 16px;
  }
  
  .product-card__cta button {
    width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: #2563eb;
    color: #fff;
  }
  
  .product-card__cta button:hover {
    background: #1d4ed8;
  }
  
  
  .product-card__cta--locked button {
    background: #e5e7eb;
    color: #374151;
    cursor: not-allowed;
  }
  .product-card.is-free {
    border-color: #86efac;
  }
  .product-card.is-free {
    border-color: #86efac;
  }
  .you-option-description {
    margin: 4px 0 0;
    font-size: 0.9rem;
    color: var(--wd-color-text-muted);
    line-height: 1.4;
  }
  

=== FILE: Style/css/user/components/sidebar.css
LANG: css
SIZE:     2663 bytes
----------------------------------------
/* ======================================================
   SIDEBAR — CANONICAL (NAVBAR-ALIGNED)
====================================================== */

/* =========================
   SHELL
========================= */
.dashboard-sidebar {
    background: var(--wd-footer-bg, #0e0e11);
    color: var(--wd-footer-text, #e5e7eb);
  
    padding: 16px;
    width: 240px;
  
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* =========================
     SECTION
  ========================= */
  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  /* =========================
     SECTION TITLE
  ========================= */
  .sidebar-title,
  .sidebar-title-link {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  
    color: var(--wd-navbar-text-muted, rgba(255,255,255,0.55));
    margin-bottom: 6px;
  
    text-decoration: none;
  }
  
  /* =========================
     LIST
  ========================= */
  .sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
  
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  /* =========================
     ITEM
  ========================= */
  .sidebar-item {
    display: block;
  }
  
  /* =========================
     LINK (BASE)
  ========================= */
  .sidebar-link {
    position: relative;
  
    display: block;
    padding: 8px 10px;
    border-radius: 10px;
  
    font-size: 14px;
    font-weight: 500;
  
    color: var(--wd-footer-link, #e5e7eb);
    text-decoration: none;
  
    transition:
      background 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }
  
  /* =========================
     LINK — HOVER (NEON)
  ========================= */
  .sidebar-link:hover {
    background: rgba(255,255,255,0.05);
    color: var(--wd-footer-link-hover, #22d3ee);
  
    box-shadow:
      0 0 0 3px rgba(34,211,238,0.12);
  }
  
  /* =========================
     LINK — ACTIVE
  ========================= */
  .sidebar-link.active {
    background: rgba(34,211,238,0.12);
    color: #ffffff;
  
    box-shadow:
      inset 0 0 0 1px rgba(34,211,238,0.45),
      0 0 8px rgba(34,211,238,0.25);
  }
  
  /* =========================
     LINK — DISABLED
  ========================= */
  .sidebar-link.disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  /* =========================
     ACCESSIBILITY — FOCUS
  ========================= */
  .sidebar-link:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(34,211,238,0.18),
      0 0 0 1px rgba(34,211,238,0.45);
  }
  

=== FILE: Style/css/user/components/solutions.css
LANG: css
SIZE:     4269 bytes
----------------------------------------
/* ======================================================
   PUBLIC — SOLUTIONS SECTION (CANONICAL)
====================================================== */

.solutions-section {
  background: linear-gradient(
    to bottom,
    #ffffff,
    #fafafa
  );
  padding: 4rem 0;
}

/* ======================================================
   SOLUTIONS GRID
====================================================== */

.solutions-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  align-items: stretch;
}

/* ======================================================
   SOLUTION CARD
====================================================== */

.solution-card {
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #f9fafb 100%
    );
    border-radius: 18px;
    overflow: hidden;
  
    /* WebOnDay shadow */
    box-shadow:
      0 12px 30px rgba(15, 23, 42, 0.08),
      0 4px 12px rgba(15, 23, 42, 0.06);
  
    transition:
      transform 0.28s ease,
      box-shadow 0.28s ease;
  }
  
  

  .solution-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 22px 48px rgba(15, 23, 42, 0.14),
      0 10px 24px rgba(15, 23, 42, 0.10);
  }

/* ======================================================
   SOLUTION CARD — MEDIA (IMMAGINI)
====================================================== */

.solution-card__media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  
    background:
      radial-gradient(
        circle at top,
        #f8fafc,
        #e5e7eb
      );
  }

  .solution-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  
    /* WebOnDay look */
    filter:
      contrast(1.02)
      saturate(1.05);
  
    transition:
      transform 0.4s ease,
      filter 0.3s ease;
  }
  
  /* Hover elegante */
  .solution-card:hover .solution-card__img {
    transform: scale(1.06);
    filter:
      contrast(1.05)
      saturate(1.1);
  }
  

/* ======================================================
   SOLUTION CARD — CONTENT
====================================================== */

.solution-card__content {
  padding: 20px 20px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.solution-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f172a;
}

.solution-card__description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #475569;
  flex: 1;
}

/* ======================================================
   SOLUTION CARD — ACTIONS
====================================================== */

.solution-card__actions {
  margin-top: 16px;
}

.solution-card__button {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 10px;
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s ease;
}

.solution-card__button:hover {
  background: #1e40af;
}

/* ======================================================
   SOLUTION HERO (DETAIL PAGE)
====================================================== */

.solution-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0 0 24px 24px;
  overflow: hidden;
}

.solution-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.55)
  );
  pointer-events: none;
}

.solution-hero__overlay {
  position: relative;
  padding: 48px 24px;
  max-width: 960px;
  margin: 0 auto;
  color: #ffffff;
}

.solution-hero__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 12px;
}

.solution-hero__subtitle {
  max-width: 720px;
  font-size: 1.1rem;
  opacity: 0.95;
}

/* ======================================================
   RESPONSIVE
====================================================== */

@media (max-width: 768px) {
  .solution-hero {
    min-height: 320px;
  }

  .solution-hero__overlay {
    padding: 32px 20px;
  }
}


=== FILE: Style/css/user/components/table/pricing-table.css
LANG: css
SIZE:     1678 bytes
----------------------------------------
/* FE || components/pricing/pricing-table.css */
/* ======================================================
   PRICING TABLE — STILE ISOLATO
   ====================================================== */

   .pricing-wrapper {
    margin-top: 6rem;
  }
  
  .pricing-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 800;
    color: #1e40af;
    margin-bottom: 2.5rem;
  }
  
  /* Scroll mobile */
  .pricing-scroll {
    overflow-x: auto;
  }
  
  /* TABELLA */
  .pricing-table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  }
  
  /* HEADER */
  .pricing-table thead {
    background: linear-gradient(90deg, #1e40af, #1d4ed8);
    color: white;
  }
  
  .pricing-table th {
    padding: 1.4rem;
    font-size: 1.05rem;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .pricing-table th:first-child {
    text-align: left;
  }
  
  /* PREZZI */
  .price-note {
    display: block;
    font-size: 0.8rem;
    font-weight: 400;
    opacity: 0.9;
    margin-top: 4px;
  }
  
  /* BODY */
  .pricing-table td {
    padding: 1rem;
    font-size: 0.95rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .pricing-table td:not(:first-child) {
    text-align: center;
    font-weight: 500;
  }
  
  /* ZEBRA */
  .pricing-table tbody tr:nth-child(even) {
    background-color: #f9fafb;
  }
  
  /* HOVER */
  .pricing-table tbody tr:hover {
    background-color: #eef2ff;
    transition: background-color 0.2s ease-in-out;
  }
  
  /* ANCORA */
  #tabella-servizi {
    scroll-margin-top: 120px;
  }
  

=== FILE: Style/css/user/components/whatsapp.css
LANG: css
SIZE:     3049 bytes
----------------------------------------
/* ======================================================
   FE||Style/css/components/whatsapp.css
   ======================================================

   AI-SUPERCOMMENT — WHATSAPP FLOATING ACTION

   RUOLO:
   - Pulsante WhatsApp flottante globale
   - Entry-point rapido al contatto business

   RESPONSABILITÀ:
   - Posizionamento fixed
   - Visibilità e accessibilità
   - Stile coerente con il brand

   NON FA:
   - Logica JS
   - Gestione link o numeri (FE logic)
   - Decisioni di business

   CONNECT POINT:
   - App root / layout globale
   - Component montato a livello top

   PERCHÉ ESISTE:
   - Centralizzare uno strumento di contatto ricorrente
   - Evitare duplicazioni page-level
====================================================== */
/* =====================================================
   WHATSAPP BUTTON – WebOnDay
   Standalone component (token driven)
===================================================== */

.whatsapp-btn {
    position: fixed;
    right: 22px;
    bottom: 75px;
    z-index: 200;
  
    width: var(--wd-whatsapp-size);
    height: var(--wd-whatsapp-size);
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background: var(--wd-whatsapp-bg);
    border-radius: 50%;
  
    cursor: pointer;
  
    transition: transform .25s ease, box-shadow .25s ease;
  }
  
  /* ================= ICON ================= */
  
  .whatsapp-btn img,
  .whatsapp-btn svg {
    width: var(--wd-whatsapp-icon-size);
    height: var(--wd-whatsapp-icon-size);
  }
  
  /* ================= NEON VARIANT ================= */
  
  .wd-whatsapp-neon {
    box-shadow:
      0 0 10px var(--wd-whatsapp-glow-main),
      0 0 22px var(--wd-whatsapp-glow-cyan);
  
    animation: wdWhatsPulse 4.5s infinite ease-in-out;
  }
  
  /* ================= HOVER ================= */
  
  .whatsapp-btn:hover {
    transform: scale(1.12);
    box-shadow:
      0 0 18px var(--wd-whatsapp-glow-main),
      0 0 35px var(--wd-whatsapp-glow-cyan);
  }
  
  /* ================= PULSE ================= */
  
  @keyframes wdWhatsPulse {
    0% {
      transform: scale(1);
      box-shadow:
        0 0 10px var(--wd-whatsapp-glow-main),
        0 0 22px var(--wd-whatsapp-glow-cyan);
    }
    50% {
      transform: scale(1.08);
      box-shadow:
        0 0 18px var(--wd-whatsapp-glow-main),
        0 0 40px var(--wd-whatsapp-glow-cyan);
    }
    100% {
      transform: scale(1);
      box-shadow:
        0 0 10px var(--wd-whatsapp-glow-main),
        0 0 22px var(--wd-whatsapp-glow-cyan);
    }
  }
  @media (max-width: 640px) {
    .whatsapp-btn {
      left: 12px;
      bottom: 20px;
    }
  
    .cart-sticker {
      right: 12px;
      bottom: 20px;
    }
  }
  /* =========================
   VISIBILITY STATE
========================= */

/*
  Stato controllato via JS (uiBus / scroll watcher)
  - non rimuove dal DOM
  - non rompe layout
  - evita overlap con cart
*/
.whatsapp-btn.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px) scale(0.9);
}


=== FILE: Style/css/user/login.css
LANG: css
SIZE:     2116 bytes
----------------------------------------
/* ======================================================
   USER AUTH — LOGIN / REGISTER
====================================================== */

.user-auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #f8fafc;
    color: #111;
  }
  
  .user-auth-card {
    width: 100%;
    max-width: 420px;
    padding: 32px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  }
  
  .user-auth-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 6px;
  }
  
  .user-auth-subtitle {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 24px;
  }
  
  /* ================= GOOGLE ================= */
  
  .user-auth-google-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: #fff;
    font-weight: 600;
    cursor: pointer;
  }
  
  .user-auth-google-btn:hover {
    background: #f3f4f6;
  }
  
  /* ================= FORM ================= */
  
  .user-auth-divider {
    margin: 18px 0;
    text-align: center;
    font-size: 0.85rem;
    color: #999;
  }
  
  .user-auth-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .user-auth-input {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
  }
  
  .user-auth-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #2563eb22;
  }
  
  /* ================= BUTTONS ================= */
  
  .user-auth-btn {
    padding: 12px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    border: none;
  }
  
  .user-auth-btn--primary {
    background: #2563eb;
    color: #fff;
  }
  
  .user-auth-btn--primary:hover {
    background: #1d4ed8;
  }
  
  .user-auth-btn--secondary {
    background: transparent;
    color: #2563eb;
  }
  
  /* ================= STATES ================= */
  
  .user-auth-error {
    color: #dc2626;
    font-size: 0.85rem;
  }
  
  .user-auth-hint {
    margin-top: 18px;
    font-size: 0.8rem;
    color: #666;
    text-align: center;
  }
  

=== FILE: Style/css/user/pages/profile/profile.css
LANG: css
SIZE:     7149 bytes
----------------------------------------
/* ======================================================
   PROFILE — BASE (Aligned with Configurator)
====================================================== */

.profile-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 20px;
  }
  
  /* ======================================================
     HEADER (same as configuration-header)
  ====================================================== */
  
  .profile-header {
    margin-bottom: 32px;
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
  }
  
  .profile-header h1 {
    font-size: 1.6rem;
    margin: 0 0 4px 0;
  }
  
  .profile-header p {
    opacity: 0.65;
    font-size: 0.95rem;
  }
  
  /* ======================================================
     CARD = STEP (same rhythm as .step)
  ====================================================== */
  
  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    background: #fff;
  
    margin-bottom: 24px;
  }
  
  .profile-card h3 {
    font-size: 1.2rem; /* same as .step h2 */
    margin-bottom: 8px;
  }
  
  /* ======================================================
     ROWS (read-only fields)
  ====================================================== */
  
  .profile-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  
    font-size: 0.95rem;
  }
  
  .profile-label {
    font-size: 0.85rem;
    opacity: 0.75;
  }
  
  /* ======================================================
     STATUS (neutral, wizard-like)
  ====================================================== */
  
  .status-complete {
    font-weight: 500;
    color: #16a34a;
  }
  
  .status-verified {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ccc;
  }
  
  .status-dot.is-active {
    background: #16a34a;
  }
  
  /* ======================================================
     VERIFY CTA (same spacing as .actions)
  ====================================================== */
  
  .profile-verify-cta {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
  
  /* ======================================================
     VERIFY FORM (same as .step form)
  ====================================================== */
  
  .profile-verify-hint {
    font-size: 0.95rem;
    opacity: 0.75;
    margin-bottom: 12px;
  }
  
  .profile-verify-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  
  /* inputs IDENTICI al configurator */
  .profile-verify-form input[type="text"],
  .profile-verify-form input[type="email"],
  .profile-verify-form input[type="file"] {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    background: #fff;
  }
  
  .profile-verify-form label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.95rem;
  }
  
  /* ======================================================
     VERIFY ACTIONS = .actions
  ====================================================== */
  
  .profile-verify-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 12px;
  }
  
  /* ======================================================
     CTA BOTTOM (same as wizard end)
  ====================================================== */
  
  .profile-cta {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  /* ======================================================
   PROFILE — STEPS (Wizard-like)
====================================================== */

.profile-step-indicator {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.profile-step-indicator span {
  font-size: 0.85rem;
  opacity: 0.6;
}

.profile-step-active {
  font-weight: 600;
  opacity: 1;
}

.profile-step-completed {
  text-decoration: line-through;
  opacity: 0.5;
}

/* ======================================================
   PROFILE — FORM (EDIT MODE, same as configurator)
====================================================== */

.profile-form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-form-label {
  font-size: 0.85rem;
  opacity: 0.75;
}

.profile-form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #fff;
}

/* ======================================================
   PROFILE — PRIVACY (READ ONLY)
====================================================== */

.profile-privacy-hint {
  font-size: 0.9rem;
  opacity: 0.75;
}

.profile-privacy-link {
  color: #2563eb;
  text-decoration: underline;
  font-size: 0.9rem;
}
.profile-upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}
.profile-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  padding: 0.75rem;
  border: 2px dashed var(--wd-border-muted, #d0d5dd);
  border-radius: 12px;

  background: var(--wd-bg-soft, #fafafa);
  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.15s ease;
}

.profile-upload-box:hover {
  border-color: var(--wd-primary, #4f46e5);
  background-color: #f5f7ff;
  transform: translateY(-2px);
}
.profile-upload-image {
  width: 100%;
  max-width: 180px;
  aspect-ratio: 3 / 4; /* documento realistico */
  object-fit: contain;

  border-radius: 8px;
  background: white;

  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04);
}
.profile-upload-box span {
  font-size: 0.85rem;
  color: var(--wd-text-muted, #667085);
  text-align: center;
}
@media (max-width: 480px) {
  .profile-upload-grid {
    gap: 0.75rem;
  }

  .profile-upload-image {
    max-width: 140px;
  }
}
.profile-upload-box {
  position: relative;
}

.upload-delete,
.upload-rotate {
  position: absolute;
  top: 8px;
  z-index: 10;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.upload-delete {
  right: 8px;
}

.upload-rotate {
  right: 48px;
}
.upload-rotate {
  position: absolute;
  top: 8px;
  right: 48px;
  z-index: 10;
  background: rgba(0,0,0,0.65);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
/* =========================
   STATUS DOT
========================= */
.profile-status-dot,
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

/* 🟠 IN VERIFICA */
.status-pending {
  background-color: #ff9800;
}

/* 🟢 VERIFICATO */
.status-verified {
  background-color: #4caf50;
}

/* 🔴 RESPINTO */
.status-rejected {
  background-color: #f44336;
}

/* =========================
   STATUS TEXT
========================= */
.profile-value {
  display: flex;
  align-items: center;
  gap: 6px;
}


=== FILE: Style/css/user/pages/profile/you.css
LANG: css
SIZE:      796 bytes
----------------------------------------
.you-business-row {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  /* CARD */
  .you-card {
    background: var(--wd-card-bg);
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: var(--wd-shadow-sm);
  }
  
  /* PREVIEW */
  .you-preview {
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 1.25rem;
    font-size: 0.9rem;
  }
  
  .you-preview-title {
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    opacity: 0.8;
  }
  
  .you-preview-block {
    margin-bottom: 0.75rem;
  }
  
  .you-preview-block p {
    margin: 0.15rem 0;
    opacity: 0.85;
  }
  
  /* Responsive */
  @media (max-width: 900px) {
    .you-business-row {
      grid-template-columns: 1fr;
    }
  }
  

=== FILE: aiTranslateGenerator/core/translate.ts
LANG: ts
SIZE:      712 bytes
----------------------------------------
import { FALLBACK_BY_LOCALE } from "../fallback";
import type { CopyMap, Locale } from "./types";

let BE_COPY: CopyMap = {};
let CURRENT_LOCALE: Locale = "it";

export function initFeTranslations(
  copyFromBe: CopyMap,
  locale: Locale = "it"
) {
  BE_COPY = copyFromBe ?? {};
  CURRENT_LOCALE = locale;
}

export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const fallback =
    FALLBACK_BY_LOCALE[CURRENT_LOCALE] ??
    FALLBACK_BY_LOCALE.it;

  let text =
    BE_COPY[key] ??
    fallback[key] ??
    key; // debug visivo

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{{${k}}}`, String(v));
    }
  }

  return text;
}


=== FILE: aiTranslateGenerator/core/types.ts
LANG: ts
SIZE:      102 bytes
----------------------------------------
export type CopyMap = Record<string, string>;
export type Locale = "it" | "en" | "fr" | "de" | "ru" ;


=== FILE: aiTranslateGenerator/fallback/index.ts
LANG: ts
SIZE:      188 bytes
----------------------------------------
import type { CopyMap, Locale } from "../core/types";
import it from "./it";

export const FALLBACK_BY_LOCALE: Record<Locale, CopyMap> = {
  it,
  en: {},
  fr: {},
  de: {},
  ru: {},
};


=== FILE: aiTranslateGenerator/fallback/it/index.ts
LANG: ts
SIZE:      872 bytes
----------------------------------------
import type { CopyMap } from "../../core/types";
import marketingHomeIt from "./marketing/home";
import commonIt from "./marketing/common";
import marketingMissionIt from "./marketing/mission";
import marketingSolutionsIt from "./marketing/solutions";
import marketingSolutionDetailIt from "./marketing/solution";
import marketingVisionIt from "./marketing/vision";
import sidebarCopyIt from "./user/sidebar";
import youCopyIt from "./user/you";
import marketingFounderIt from "./marketing/founder";
import accountCopy from "./user/account";
import profileCopy from "./user/profile";

const it: CopyMap = {
  ...commonIt,
  ...marketingHomeIt,
  ...marketingMissionIt,
  ...marketingSolutionsIt,
  ...marketingFounderIt,
  ...marketingSolutionDetailIt,
  ...marketingVisionIt,
  ...sidebarCopyIt,
  ...youCopyIt,
  ...accountCopy,
  ...profileCopy,
};

export default it;


=== FILE: aiTranslateGenerator/fallback/it/marketing/common.ts
LANG: ts
SIZE:     1317 bytes
----------------------------------------
import type { CopyMap } from "../../../core/types";

const commonIt: CopyMap = {
  "common.cta.start_free": "Inizia gratuitamente",

  /* ================= NAVBAR ================= */
  "navbar.dashboard": "Dashboard",
  "navbar.solutions": "Soluzioni",
  "navbar.mission": "Mission",
  "navbar.vision": "Vision",
  "navbar.login": "Accedi",
  "navbar.logout": "Logout",
  "navbar.dashboard.active_business": "Dashboard attività",
  "navbar.menu.open": "Apri menu",

  /* ================= FOOTER — POLICY ================= */
  "footer.policy.title": "Policy",
  "footer.policy.terms": "Termini e condizioni",
  "footer.policy.general": "Policy generale",
  "footer.policy.privacy": "Privacy",
  "footer.policy.cookies": "Cookie",

  /* ================= FOOTER — ABOUT ================= */
  "footer.about.title": "Chi siamo",
  "footer.about.founder": "Founder",
  "footer.about.mission": "Mission",
  "footer.about.vision": "Vision",

  /* ================= FOOTER — ACCESS ================= */
  "footer.access.title": "Accesso",
  "footer.access.dashboard": "Vai alla dashboard",
  "footer.access.login": "Accedi",
  "footer.access.explore": "Esplora le soluzioni",

  /* ================= FOOTER — META ================= */
  "footer.rights": "Tutti i diritti riservati",
};

export default commonIt;


=== FILE: aiTranslateGenerator/fallback/it/marketing/founder.ts
LANG: ts
SIZE:     1562 bytes
----------------------------------------
// ======================================================
// FE || aiTranslateGenerator/fallback/it/marketing/founder.ts
// ======================================================

import type { CopyMap } from "../../../core/types";

const marketingFounderIt: CopyMap = {
  "founder.hero.h1": "WebOnDay 2025",

  "founder.hero.subtitle":
    "Proiettati nel futuro, abbiamo percorso il web come pionieri. Oggi siamo una realtà cyber-digitale che trasforma aziende in leggende.",

  "founder.founder.name": "Francesco Maggi",
  "founder.founder.role": "Creator & Cyber-Founder",

  "founder.founder.quote":
    "Nel 2025, il digitale non è più solo tecnologia: è coscienza collettiva. WebOnDay non crea solo siti, ma portali verso realtà parallele.",

  "founder.mission.title": "La Missione 2026",

  "founder.mission.text":
    "Non digitalizziamo più aziende: le proiettiamo nel metaverso. Creiamo mondi immersivi dove brand e clienti interagiscono in modo naturale, etico e sostenibile.",

  "founder.team.coder.title": "Coders Synth",
  "founder.team.coder.text":
    "Programmiamo con AI avanzata. I nostri codici sono progettati per evolvere nel tempo.",

  "founder.team.design.title": "Creativi Digitali",
  "founder.team.design.text":
    "Il design non è solo estetica, ma esperienza. Costruiamo interfacce chiare, accessibili e coerenti.",

  "founder.team.comm.title": "Comunicazione Intelligente",
  "founder.team.comm.text":
    "Aiutiamo i brand a comunicare in modo efficace, continuo e misurabile.",
};

export default marketingFounderIt;


=== FILE: aiTranslateGenerator/fallback/it/marketing/home.ts
LANG: ts
SIZE:     1609 bytes
----------------------------------------
import type { CopyMap } from "../../../core/types";

const marketingHomeIt: CopyMap = {
  "home.hero.h1": "La tua idea diventa un sito che lavora per te.",
  "home.hero.subtitle":
    "WebOnDay ti permette di creare landing page, e-commerce e soluzioni SaaS partendo da modelli intelligenti, personalizzati e pronti a vendere. Tu scegli la solution. La piattaforma fa il resto.",

  "home.why.h2": "Perché WebOnDay",

  "home.why.p1":
    "WebOnDay nasce come progetto artigianale digitale. Non vendiamo semplicemente siti web: aiutiamo le attività a farsi conoscere online senza dover affrontare subito costi, complessità o scelte irreversibili.",

  "home.why.p2":
    "Oggi esistono molte soluzioni gratuite per creare un sito. Il vero problema, però, non è lo strumento, ma il tempo, l’esperienza e l’energia necessari per usarlo davvero nel modo giusto.",

  "home.why.p3":
    "Per questo abbiamo scelto un approccio diverso: partire dall’essenziale, accompagnarti passo dopo passo e lasciarti il tempo di capire cosa ti serve davvero.",

  "home.why.list.1": "Struttura pronta, senza configurazioni tecniche",
  "home.why.list.2": "Anteprime reali, non promesse",
  "home.why.list.3": "Nessun obbligo immediato di acquisto",
  "home.why.list.4": "Servizi aggiuntivi solo se e quando servono",

  "home.why.footer":
    "WebOnDay non è una scorciatoia. È un punto di partenza semplice, pensato per crescere insieme alla tua attività.",

  "home.why.link.pricing": "Scopri i servizi disponibili",
  "home.why.link.referral": "Come funziona il referral",
};

export default marketingHomeIt;


=== FILE: aiTranslateGenerator/fallback/it/marketing/mission.ts
LANG: ts
SIZE:     2926 bytes
----------------------------------------
// ======================================================
// FE || aiTranslateGenerator/fallback/it/marketing/mission.ts
// ======================================================

import type { CopyMap } from "../../../core/types";

const marketingMissionIt: CopyMap = {
  "mission.hero.h1": "La nostra missione",
  "mission.hero.subtitle":
    "Costruire una piattaforma digitale sostenibile, accessibile e orientata alla crescita reale delle aziende.",

  "mission.core.p1":
    "WebOnDay nasce con l’obiettivo di semplificare l’accesso al digitale, riducendo complessità tecniche e barriere economiche.",

  "mission.core.p2":
    "Crediamo in un percorso progressivo, dove ogni attività può crescere nel tempo senza pressioni o vincoli prematuri.",

  "mission.referral.h2": "Un modello collaborativo",
  "mission.referral.p1":
    "Il sistema di referral è pensato per creare valore condiviso tra utenti, partner e piattaforma.",
  "mission.referral.p2":
    "Ogni collaborazione rafforza l’ecosistema e contribuisce allo sviluppo comune.",

  "mission.archive.h2": "Archivi digitali",
  "mission.archive.p1":
    "Stiamo lavorando a un sistema di archiviazione privata e pubblica basato su identificativi univoci.",
  "mission.archive.p2":
    "Questo permetterà tracciabilità, trasparenza e valorizzazione dei contenuti.",
  "mission.archive.p3":
    "L’archivio sarà uno strumento centrale dell’ecosistema WebOnDay.",

  "mission.roadmap.h2": "Roadmap del progetto",
  "mission.roadmap.intro":
    "Una visione progressiva dello sviluppo della piattaforma.",

  "mission.roadmap.1.text":
    "Fondamenta del progetto: creazione della piattaforma WebOnDay come base dei servizi digitali.",
  "mission.roadmap.1.status": "done",

  "mission.roadmap.2.text":
    "Digitalizzazione iniziale e primi partner nei livelli Essential, Worker, Industrial e Governor.",
  "mission.roadmap.2.status": "in-progress",

  "mission.roadmap.3.text":
    "Sviluppo del Portale WebOnDay per aziende e servizi.",
  "mission.roadmap.3.status": "pending",

  "mission.roadmap.4.text":
    "Implementazione Archivio Privato e Pubblico con hashID.",
  "mission.roadmap.4.status": "pending",

  "mission.roadmap.5.text":
    "Creazione Directory Partners pubblica.",
  "mission.roadmap.5.status": "pending",

  "mission.roadmap.6.text":
    "WebOnDay Health Dashboard.",
  "mission.roadmap.6.status": "pending",

  "mission.roadmap.7.text":
    "Scalabilità a 500 aziende partner.",
  "mission.roadmap.7.status": "pending",

  "mission.roadmap.8.text":
    "Automazioni avanzate e AI assistita.",
  "mission.roadmap.8.status": "pending",

  "mission.roadmap.9.text":
    "Supporto alla creazione di nuovi posti di lavoro.",
  "mission.roadmap.9.status": "pending",

  "mission.roadmap.10.text":
    "Miglioramento continuo della piattaforma.",
  "mission.roadmap.10.status": "pending",
};

export default marketingMissionIt;


=== FILE: aiTranslateGenerator/fallback/it/marketing/solution.ts
LANG: ts
SIZE:     2070 bytes
----------------------------------------
// ======================================================
// IT FALLBACK — MARKETING / SOLUTION DETAIL (PUBLIC)
// ======================================================

const marketingSolutionDetailIt = {
    "solution.detail.hero.title":
      "La nostra offerta per {{solution}}",
  
    "solution.detail.hero.subtitle.fallback":
      "Scopri come WebOnDay può aiutarti a costruire una presenza online efficace e professionale.",
  
    "solution.detail.explanation.h2":
      "Cos’è la solution {{solution}}",
  
    "solution.detail.explanation.fallback":
      "La solution {{solution}} è un modello di sito WebOnDay progettato per rispondere a esigenze specifiche di un determinato tipo di attività. Fornisce una struttura già pensata, pronta per essere personalizzata e messa online rapidamente.",
  
    "solution.detail.overview.h2":
      "La soluzione pensata per il tuo business",
  
    "solution.detail.overview.p":
      "WebOnDay ti fornisce una struttura pronta: landing page, e-commerce e strumenti di gestione progettati per convertire.",
  
    "solution.detail.how.h2":
      "Come funziona",
  
    "solution.detail.how.step1.title":
      "Scegli un prodotto",
    "solution.detail.how.step1.text":
      "Seleziona il prodotto più adatto alle tue esigenze in base al livello di personalizzazione e supporto.",
  
    "solution.detail.how.step2.title":
      "Configura le informazioni principali",
    "solution.detail.how.step2.text":
      "Dopo l’accesso, ti guideremo nella raccolta dei dati necessari per costruire il sito.",
  
    "solution.detail.how.step3.title":
      "Realizziamo il tuo sito",
    "solution.detail.how.step3.text":
      "Utilizziamo le informazioni fornite per creare la tua soluzione WebOnDay pronta all’uso.",
  
    "solution.detail.products.h3":
      "Scegli il prodotto",
  
    "solution.detail.loading":
      "Caricamento…",
  
    "solution.detail.error.generic":
      "Si è verificato un errore nel caricamento della soluzione.",
  };
  
  export default marketingSolutionDetailIt;
  

=== FILE: aiTranslateGenerator/fallback/it/marketing/solutions.ts
LANG: ts
SIZE:      784 bytes
----------------------------------------
// ======================================================
// IT FALLBACK — MARKETING / SOLUTIONS PAGE
// ======================================================

const marketingSolutionsIt = {
    "solutions.h1": "Le nostre soluzioni",
  
    "solutions.intro.p1":
      "Le Solutions WebOnDay sono modelli di sito pensati per rispondere a esigenze specifiche di attività diverse. Ogni solution fornisce una base strutturata, pronta per essere adattata e realizzata attraverso i prodotti disponibili.",
      "solutions.section.title": "Osserva , sceglia e vai on line !",
    "solutions.intro.p2":
      "Scegli la solution più vicina alla tua attività per capire come possiamo costruire il tuo sito in modo semplice e guidato.",
  };
  
  export default marketingSolutionsIt;
  

=== FILE: aiTranslateGenerator/fallback/it/marketing/vision.ts
LANG: ts
SIZE:     1547 bytes
----------------------------------------
// ======================================================
// IT FALLBACK — MARKETING / VISION
// ======================================================

const marketingVisionIt = {
    "vision.hero.h1":
      "La nostra visione",
  
    "vision.hero.subtitle":
      "WebOnDay nasce con l’obiettivo di costruire un ecosistema digitale condiviso, in cui le piccole e medie imprese possano collaborare, crescere e rendere misurabile il proprio valore nel tempo.",
  
    "vision.section.voice.h2":
      "Un’unica voce per le PMI",
  
    "vision.section.voice.p":
      "L’obiettivo non è solo realizzare siti web, ma creare relazioni reali con commercianti, produttori e professionisti, unendo le loro attività sotto un’identità digitale chiara, verificabile e rappresentabile.",
  
    "vision.section.registry.h2":
      "Registro pubblico e archivio dei progressi",
  
    "vision.section.registry.p1":
      "La crescita dell’ecosistema WebOnDay viene tracciata nel tempo attraverso un registro pubblico aggregato e un archivio consultabile, progettati per garantire trasparenza, continuità e visione d’insieme.",
  
    "vision.section.registry.p2":
      "Ogni attività contribuisce a un quadro comune che rende visibile l’evoluzione del progetto, senza esporre dati sensibili o informazioni riservate.",
  
    "vision.section.registry.link.registry":
      "Vai al registro pubblico",
  
    "vision.section.registry.link.archive":
      "Consulta l’archivio pubblico",
  };
  
  export default marketingVisionIt;
  

=== FILE: aiTranslateGenerator/fallback/it/user/account.ts
LANG: ts
SIZE:      677 bytes
----------------------------------------
import type { CopyMap } from "../../../core/types";

const accountCopy: CopyMap = {
  // ======================================================
// I18N — ACCOUNT (IT FALLBACK)
// ======================================================

"account.title": "Account",
"account.subtitle": "Dettagli tecnici e sicurezza dell’account",

"account.not_logged": "Devi effettuare l’accesso per visualizzare l’account",

"account.email": "Email",
"account.provider": "Metodo di accesso",
"account.createdAt": "Account creato il",

"account.security_hint":
  "La gestione di password, provider e sicurezza avanzata sarà disponibile prossimamente.",

};

export default accountCopy;


=== FILE: aiTranslateGenerator/fallback/it/user/index.ts
LANG: ts
SIZE:      572 bytes
----------------------------------------
import type { CopyMap } from "../../../core/types";

const dashboardIt: CopyMap = {
  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Le tue configurazioni attive",
  "dashboard.loading": "Caricamento dashboard…",
  "dashboard.error.load":
    "Errore nel caricamento delle configurazioni",

  "dashboard.empty.title": "Nessuna configurazione",
  "dashboard.empty.text":
    "Non hai ancora creato nessuna attività.",
  "dashboard.cta.start":
    "Inizia da una soluzione →",

  "dashboard.config.default": "Nuova attività",
};

export default dashboardIt;


=== FILE: aiTranslateGenerator/fallback/it/user/profile.ts
LANG: ts
SIZE:     2796 bytes
----------------------------------------
// ======================================================
// I18N — PROFILE (IT FALLBACK)
// ======================================================

import type { CopyMap } from "../../../core/types";

const profileCopy: CopyMap = {
  /* ================= BASE ================= */
  "profile.title": "Profilo",
  "profile.subtitle": "Informazioni personali associate al tuo account",

  "profile.not_available": "Profilo non disponibile",
  "profile.not_logged": "Devi effettuare l’accesso per visualizzare il profilo",

  /* ================= IDENTITY ================= */
  "profile.section.identity": "Dati anagrafici",
  "profile.firstName": "Nome",
  "profile.lastName": "Cognome",
  "profile.birthDate": "Data di nascita",
  "profile.address": "Indirizzo di residenza",

  /* ================= STATUS ================= */
  "profile.section.status": "Stato profilo",
  "profile.status": "Completezza",
  "profile.status.complete": "Profilo completo",
  "profile.status.incomplete": "Profilo incompleto",

  "profile.verified": "Verifica identità",
  "profile.verified.yes": "Verificato",
  "profile.verified.no": "Non verificato",

  /* ================= VERIFY — FLOW ================= */
  "profile.verify.cta": "Verifica identità",
  "profile.verify.title": "Verifica identità",
  "profile.verify.subtitle":
    "Controlla e modifica i tuoi dati. La verifica avverrà in due passaggi.",

  /* STEP 1 */
  "profile.verify.step1.title": "Dati del titolare",
  "profile.verify.step1.subtitle":
    "Verifica che i dati anagrafici siano corretti e carica il documento di identità.",

  "profile.verify.idFront": "Documento di identità (fronte)",
  "profile.verify.idBack": "Documento di identità (retro)",

  "profile.verify.confirmOwner":
    "Confermo che i dati del titolare sono corretti",

  /* STEP 2 */
  "profile.verify.step2.title": "Dati dell’attività",
  "profile.verify.step2.subtitle":
    "Inserisci i dati fiscali e i documenti dell’attività.",

  "profile.verify.vat": "Partita IVA",
  "profile.verify.chamber": "Visura camerale",
  "profile.verify.pec": "PEC dell’attività",

  /* ACTIONS */
  "profile.verify.next": "Continua",
  "profile.verify.back": "Indietro",
  "profile.verify.submit": "Invia richiesta di verifica",

  /* ================= PRIVACY ================= */
  "profile.section.privacy": "Privacy",
  "profile.privacy.accepted":
    "Hai già accettato l’informativa privacy",
  "profile.privacy.link": "Leggi l’informativa",

  /* ================= CONTACTS ================= */
  "profile.section.contacts": "Contatti",
  "profile.secondaryMail": "Email secondaria",

  /* ================= COMMON ================= */
  "common.cancel": "Annulla",
  "common.loading": "Caricamento in corso…",
};

export default profileCopy;


=== FILE: aiTranslateGenerator/fallback/it/user/sidebar.ts
LANG: ts
SIZE:     1283 bytes
----------------------------------------
/* ======================================================
   FE || USER DASHBOARD || SIDEBAR COPY (IT)
   ====================================================== */

   import type { CopyMap } from "../../../core/types";

   const sidebarCopyIt: CopyMap = {
     /* SECTIONS */
     "sidebar.section.you": "You On",
     "sidebar.section.configurations": "Configurations",
     "sidebar.section.business": "Business",
     "sidebar.section.plans": "Plans",
     "sidebar.section.workspace": "Workspace",
     "sidebar.section.settings": "Settings",
   
     /* YOU */
     "sidebar.you.profile": "Profilo",
     "sidebar.you.account": "Account",
     "sidebar.you.settings": "Settings",
   
     /* CONFIGURATIONS */
     "sidebar.config.start": "Inizia una configurazione →",
     "sidebar.config.default": "Configurazione",
   
     /* BUSINESS */
     "sidebar.business.default": "Attività",
     "sidebar.business.empty": "Nessun business attivo",
   
     /* PLANS */
     "sidebar.plans.empty": "Nessun piano disponibile",
   
     /* WORKSPACE */

  "sidebar.workspace.empty": "Nessun workspace attivo",
  "sidebar.workspace.active": "Workspace attivo",
   
     /* SETTINGS */
     "sidebar.settings.disabled": "Impostazioni",
   };
   
   export default sidebarCopyIt;
   

=== FILE: aiTranslateGenerator/fallback/it/user/you.ts
LANG: ts
SIZE:     1200 bytes
----------------------------------------
import type { CopyMap } from "../../../core/types";

const youCopyIt: CopyMap = {
  /* ================= YOU PAGE ================= */
  "you.title": "Il tuo spazio WebOnDay",
  "you.subtitle":
    "Panoramica del tuo account e delle attività collegate",

  /* ================= SUMMARY ================= */
  "you.summary.title": "Riepilogo",
  "you.summary.configurations": "Configurazioni",
  "you.summary.businesses": "Business",
  "you.summary.plans": "Piani attivi",

  /* ================= CONFIGURATIONS ================= */
  "you.configurations.title": "Configurazioni",
  "you.configurations.empty":
    "Non hai ancora creato nessuna configurazione.",
  "you.configurations.default": "Nuova attività",
  "you.configurations.view_all":
    "Vedi tutte le configurazioni",

  /* ================= BUSINESS ================= */
  "you.business.title": "Business attivi",
  "you.business.plans": "Piani attivi",
  "you.business.empty": "Non hai ancora creato un business",
"you.business.no_plan": "Nessun piano attivo (FREE)",
  "you.business.plans_empty":
    "Nessun piano attivo al momento",
  "you.business.active_count":
    "{{count}} attività attive",
};

export default youCopyIt;


=== FILE: aiTranslateGenerator/generator/aiPromptBuilder.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: aiTranslateGenerator/generator/normalizeCopy.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: aiTranslateGenerator/index.ts
LANG: ts
SIZE:      151 bytes
----------------------------------------
export { t, initFeTranslations } from "./core/translate";
export type { Locale } from "./core/types";
export { FALLBACK_BY_LOCALE } from "./fallback";


=== FILE: aiTranslateGenerator/lib/storeVisitorLanguage.store.ts
LANG: ts
SIZE:      362 bytes
----------------------------------------
import { create } from "zustand";

type LanguageState = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: localStorage.getItem("webonday:lang") ?? "it",

  setLanguage: (lang) => {
    localStorage.setItem("webonday:lang", lang);
    set({ language: lang });
  },
}));


=== FILE: aiTranslateGenerator/translateFe/helper/i18n.ts
LANG: ts
SIZE:     2162 bytes
----------------------------------------
/* ======================================================
   FE || TRANSLATE HELPER (AI-READY, BE OVERRIDE)
======================================================
@@@@@@  DEPRECATED   @@@@@@@@
AI-SUPERCOMMENT

RUOLO:
- Risolvere stringhe FE tramite key semantiche
- Usare copy dinamico fornito dal BE (se presente)
- Garantire fallback immediato in italiano

PRIORITÀ RISOLUZIONE:
1. Copy caricato dal BE (override)
2. Fallback IT hardcoded
3. Key stessa (debug visivo)

DECISIONI:
- Nessuna dipendenza esterna
- Nessun async nei componenti
- BE copy caricato UNA VOLTA (bootstrap)

====================================================== */

/* =========================
   FALLBACK ITALIANO (SAFE)
========================= */
const IT_FALLBACK: Record<string, string> = {
    // OPTION — PRODUCT
    "option.product.title.monthly_addons": "Servizi aggiuntivi mensili",
    "option.product.label.price_monthly": "+ {{price}} / mese",
    "option.product.aria.group": "Servizi aggiuntivi selezionabili",
    "option.product.aria.option_monthly": "{{label}} {{price}} al mese",
  };
  
  /* =========================
     BE COPY OVERRIDE (RUNTIME)
  ========================= */
  let BE_COPY: Record<string, string> = {};
  
  /* ======================================================
     INIT — LOAD COPY FROM BE
  ======================================================
  
  DA CHIAMARE:
  - una sola volta
  - all’avvio dell’app
  - oppure nel layout root
  
  Il BE deve rispondere con:
  {
    ok: true,
    copy: {
      "key": "value"
    }
  }
  
  ====================================================== */
  export function initFeTranslations(copyFromBe: Record<string, string>) {
    BE_COPY = copyFromBe ?? {};
  }
  
  /* =========================
     TRANSLATE FUNCTION
  ========================= */
  export function t(
    key: string,
    params?: Record<string, string | number>
  ): string {
    let text =
      BE_COPY[key] ??
      IT_FALLBACK[key] ??
      key;
  
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
  
    return text;
  }
  

=== FILE: cookie/CookieBanner.tsx
LANG: tsx
SIZE:     3517 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT — COOKIE BANNER
 *
 * RUOLO:
 * - Raccogliere consenso cookie lato FE
 *
 * INVARIANTI:
 * - NON usa visitorId
 * - NON usa userId
 * - NON persiste stato lato backend
 *
 * MOTIVO:
 * - Consenso = evento GDPR, non identità
 * - Backend salva solo statistiche aggregate
 */
// src/components/cookie/CookieBanner.tsx

import { useEffect, useState } from "react";
import {
  getLocalConsent,
  saveLocalConsent,
} from "../utils/cookieConsent";
import { acceptCookies } from "../lib/api";

/**
 * CookieBanner
 * - Mostrato solo se NON esiste consenso locale
 * - Salva consenso in localStorage
 * - Invia consenso al backend (COOKIES_KV)
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     CHECK INIZIALE
  ========================= */
  useEffect(() => {
    const consent = getLocalConsent();
    if (!consent) setVisible(true);
  }, []);

  /* =========================
     SYNC BACKEND
  ========================= */
  async function syncBackend(
    analytics: boolean,
    marketing: boolean
  ) {
    try {
      setLoading(true);

     
      await acceptCookies(
       
        analytics,
        marketing
        
      );
    } catch (err) {
      console.error("[CookieBanner] sync error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     HANDLERS
  ========================= */
  async function handleAcceptAll() {
    saveLocalConsent({
      analytics: true,
      marketing: true,
    });

    await syncBackend(true, true);
    setVisible(false);
  }

  async function handleRejectAll() {
    saveLocalConsent({
      analytics: false,
      marketing: false,
    });

    await syncBackend(false, false);
    setVisible(false);
  }

  if (!visible) return null;

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "1rem",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        zIndex: 9999,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        <strong>Cookie WebOnDay</strong>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Utilizziamo cookie tecnici necessari e, previo consenso,
          cookie analitici e marketing per migliorare l’esperienza.
          Puoi modificare le preferenze in qualsiasi momento.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          disabled={loading}
          onClick={handleRejectAll}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 999,
            border: "1px solid #555",
            background: "#222",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Solo necessari
        </button>

        <button
          disabled={loading}
          onClick={handleAcceptAll}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 999,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}


=== FILE: domain/business/buseinssRead.types.ts
LANG: ts
SIZE:     1507 bytes
----------------------------------------
// ======================================================
// SHARED || DOMAIN || BUSINESS || READ TYPES (FE)
// ======================================================
//
// RUOLO:
// - DTO di LETTURA dal BE
// - Seed FE per configurazione
//
// NOTE:
// - READ ONLY
// - NON usato in scrittura
// - Allineato 1:1 con BusinessDraftSchema (BE)
// ======================================================

import type { OpeningHoursFE } from "./openingHours.types";

/* ======================================================
   BUSINESS DRAFT — READ DTO
====================================================== */

export type BusinessDraftReadDTO = {
  businessDraftId: string;

  businessName: string;

  /* DOMAIN */
  openingHours: OpeningHoursFE | null;

  /* CONTACT (MINIMO) */
  contact?: {
    mail?: string;
    phoneNumber?: string;
    pec?: string;
  };

  /* ADDRESS (TOP LEVEL — CANONICAL) */
  address?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    zip?: string;
  };

  /* PRIVACY */
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* CLASSIFICATION */
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};

/* ======================================================
   SOLUTION SEED (READ ONLY)
====================================================== */

export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHours: OpeningHoursFE | null;
};


=== FILE: domain/business/openingHours.constants.ts
LANG: ts
SIZE:     1066 bytes
----------------------------------------
import { type OpeningHoursFE } from "./openingHours.types";
export const EMPTY_OPENING_HOURS: OpeningHoursFE = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
  // ======================================================
// SHARED || DOMAIN || BUSINESS || OPENING HOURS CONSTANTS
// ======================================================
//
// RUOLO:
// - Costanti canoniche per OpeningHours (FE)
// - Ordine giorni, label, default
// ======================================================

import type { DayKey } from "./openingHours.types";

/**
 * Ordine canonico dei giorni (UI / FE)
 */
export const DAYS_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * Label UI per giorni della settimana
 */
export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",
};


=== FILE: domain/business/openingHours.types.ts
LANG: ts
SIZE:      816 bytes
----------------------------------------
/**
 * ======================================================
 * DOMAIN || OPENING HOURS — FE CANONICAL TYPES
 * ======================================================
 *
 * RUOLO:
 * - Modello FE canonico per orari di apertura
 * - Usato in:
 *   • Configurator
 *   • Business preview
 *   • Dashboard / You
 *
 * INVARIANTI:
 * - NO stringhe libere
 * - Chiavi giorni tipizzate
 * ======================================================
 */

export type TimeRangeFE = {
    from: string; // "HH:mm"
    to: string;   // "HH:mm"
  };
  
  export const DAYS_ORDER = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;
  
  export type DayKey = typeof DAYS_ORDER[number];
  
  export type OpeningHoursFE = Record<DayKey, TimeRangeFE[]>;
  

=== FILE: domain/business/openingHours.utils.ts
LANG: ts
SIZE:      392 bytes
----------------------------------------
import type { OpeningHoursFE } from "./openingHours.types";

/**
 * Ritorna TRUE se tutti i giorni hanno zero time range
 */
export function isOpeningHoursEmpty(
  openingHours: OpeningHoursFE | null | undefined
): boolean {
  if (!openingHours) return true;

  return Object.values(openingHours).every((dayRanges) => {
    return !Array.isArray(dayRanges) || dayRanges.length === 0;
  });
}


=== FILE: domain/owner/owner.read.types.ts
LANG: ts
SIZE:     1217 bytes
----------------------------------------
// ======================================================
// SHARED || DOMAIN || OWNER || READ TYPES (FE)
// ======================================================
//
// RUOLO:
// - DTO di sola lettura per OwnerDraft
// - Mirror fedele del dominio BE
//
// INVARIANTI:
// - Nessuna logica
// - Nessun default
// - Tutti i campi opzionali come da BE
// ======================================================

export type OwnerDraftReadDTO = {
  /* ================= ID ================= */
  id: string;
  configurationId?:string; 
  /* ================= ANAGRAFICA ================= */
  firstName?: string;
  lastName?: string;
  birthDate?: string;

  address?: {
    street?: string;
    number?:string; 
    city?: string;
    province?: string;
    region?:string; 
    zip?: string;
    country?: string;
  };

  /* ================= CONTATTI ================= */
  contact?: {
    secondaryMail?: string;
    phoneNumber?: string;
  };

  /* ================= PRIVACY ================= */
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* ================= META ================= */
  source?: "google" | "manual";
  verified?: boolean;
  complete: boolean;
};


=== FILE: domain/owner/owner.write.types.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: domain/owner/ownerPrivacy.types.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: domain/site-preview/businessSitePreview.dto.ts
LANG: ts
SIZE:      380 bytes
----------------------------------------
import { type OpeningHoursFE } from "../business/openingHours.types";


export type BusinessPreviewDTO = {
    id: string;
    publicId: string;
  
    name: string;
    sector?: string;
    address?: string;
  
    layoutId: string;
    style: string;
    palette: string;
  
    coverImageUrl: string;
    galleryImageUrls: string[];
  
    openingHours: OpeningHoursFE;
  };
  

=== FILE: domain/user/configurator/configurationSetup.store.ts
LANG: ts
SIZE:     1856 bytes
----------------------------------------
import { create } from "zustand";
import type { ConfigurationSetupDTO } from "./configurationSetup.types";
import {
  EMPTY_OPENING_HOURS,
} from "@shared/domain/business/openingHours.constants";

/* =========================
   INITIAL STATE
========================= */
const initialState: ConfigurationSetupDTO = {
  configurationId: undefined,
  businessDraftId: undefined,

  solutionId: "",
  productId: "",
  optionIds: [],

  businessName: "",
  sector: "",

  email: "",
  phone: undefined,

  businessAddress: {
    street: "",
    number: "",
    city: "",
    province: "",
    region: "",
    country: "",
    zip: "",
  },

  openingHours: EMPTY_OPENING_HOURS,

  businessServiceTags: [],
  businessDescriptionTags: [],

  privacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },

  ownerFirstName: "",
  ownerLastName: "",
  ownerBirthDate: undefined,
  ownerSecondaryMail: undefined,
  
  ownerAddress: {
    street: "",
    number: "",
    city: "",
    province: "",
    region: "",
    zip: "",
    country: "Italia",
  },

  
  ownerPrivacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },
  ownerStepCompleted: false,
  layoutId: undefined,
  style: undefined,
  colorPreset: undefined,

  visibility: undefined,
};

/* =========================
   STORE
========================= */
type ConfigurationSetupState = {
  data: ConfigurationSetupDTO;

  setField<K extends keyof ConfigurationSetupDTO>(
    key: K,
    value: ConfigurationSetupDTO[K]
  ): void;

  reset(): void;
};

export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    data: initialState,

    setField: (key, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: value,
        },
      })),

    reset: () => set({ data: initialState }),
  }));


=== FILE: domain/user/configurator/configurationSetup.types.ts
LANG: ts
SIZE:     1949 bytes
----------------------------------------
import type { OpeningHoursFE } from
  "@shared/domain/business/openingHours.types";

/**
 * ======================================================
 * FE || ConfigurationSetupDTO (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE completo del configurator
 * - DTO neutro (NO store, NO logica)
 *
 * SOURCE OF TRUTH:
 * - Backend → id / solutionId / productId / optionIds
 * - FE → resto
 * ======================================================
 */

export type ConfigurationSetupDTO = {
  /* ================= CORE ================= */
  configurationId?: string;
  businessDraftId?: string;

  solutionId: string;
  productId: string;
  optionIds: string[];

  /* ================= BUSINESS ================= */
  businessName: string;
  sector: string;

  email: string;
  phone?: string;

  businessAddress?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    region?: string;   // FE-only
    country?: string;  // FE-only
    zip?: string;
  };
  openingHours: OpeningHoursFE;

  businessServiceTags: string[];
  businessDescriptionTags: string[];

  privacy: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* ================= OWNER ================= */
  ownerFirstName: string;
  ownerLastName: string;
  ownerBirthDate?: string;
  ownerSecondaryMail?: string;
  ownerPhone?: string;
  
  ownerAddress?: {
    street?: string;
    city?: string;
    number?:string; 
    province?: string;
    region?:string; 
    zip?: string;
    country?: string;
  };
  
  ownerPrivacy: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };
 /* ================= VERIFICATION (FE ONLY) ================= */
 ownerStepCompleted?: boolean;
  /* ================= WORKSPACE ================= */
  layoutId?: string;
  style?: string;
  colorPreset?: string;

  visibility?: Record<string, boolean>;
};


=== FILE: domain/verification/verificationPrompts.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: lib/api/client.ts
LANG: ts
SIZE:     2909 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT — API CLIENT
 *
 * RUOLO:
 * - Unico wrapper FE → BE
 *
 * INVARIANTI:
 * - Non gestisce auth
 * - Non persiste stato
 * - Non assume presenza di cookie
 */
/**
 * ======================================================
 * FE || src/lib/client.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Wrapper fetch GENERICO per FE → Backend
 *
 * RESPONSABILITÀ:
 * - Costruire richieste HTTP verso API_BASE
 * - Impostare header JSON di default
 * - Gestire credentials (session cookie)
 * - Normalizzare errori HTTP in Error JS
 *
 * NON FA:
 * - NON gestisce autenticazione (user o admin)
 * - NON persiste stato
 * - NON interpreta risposte di dominio
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/api/client.ts
 * - Motivo:
 *   Questo file diventerà l’UNICO entry point fetch
 *   per TUTTE le API FE (admin, user, object).
 *   Le varianti (adminFetch, userFetch, ecc.)
 *   saranno adapter sopra questo client.
 * * ⚠️ NOTA DI CONTRATTO:
 * - apiFetch può restituire null
 * - Le API di dominio DEVONO assorbire il null
 *   e NON propagarlo alla UI, salvo casi espliciti
 * NOTE:
 * - Backend = source of truth
 * - Questo file NON deve contenere logica di dominio
 * ======================================================
 */

import { API_BASE } from "../config";

if (!API_BASE) {
  console.warn("ATTENZIONE: API_BASE non definita");
}

/* =========================
   FETCH WRAPPER
========================= */

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (networkError) {
    // errore di rete (offline, DNS, ecc.)
    console.error("[apiFetch] NETWORK_ERROR", networkError);
    throw new Error("NETWORK_ERROR");
  }

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ❗️CASO API OK MA ok:false (DOMINIO)
  if (res.ok && data?.ok === false) {
    const err = data.error ?? "DOMAIN_ERROR";
    throw new Error(err);
  }

  // ❗️CASO HTTP ERROR
  if (!res.ok) {
    const err =
      data?.error ??
      `HTTP_${res.status}`;
    throw new Error(err);
  }

  return data as T;
}

export async function acceptCookies(
  analytics: boolean,
  marketing: boolean
) {
  try {
    return await apiFetch("/api/cookies/accept", {
      method: "POST",
      body: JSON.stringify({ analytics, marketing }),
    });
  } catch (err) {
    console.warn("[cookies] accept failed (ignored)", err);
    return null;
  }
}

export function getCookieStatus() {
  return apiFetch("/api/cookies/status");
}


=== FILE: lib/api/index.ts
LANG: ts
SIZE:       25 bytes
----------------------------------------
export * from "./client";

=== FILE: lib/apiModels/admin/Option.api-model.ts
LANG: ts
SIZE:      590 bytes
----------------------------------------
/**
 * ======================================================
 * FE || AdminOptionApiModel
 * ======================================================
 *
 * RUOLO:
 * - Shape OPTION lato ADMIN (backend)
 *
 * SOURCE:
 * - Backend /api/admin/option*
 *
 * NOTE:
 * - Monthly only (hard domain rule)
 * ======================================================
 */
export interface AdminOptionApiModel {
    id: string;
    name: string;
    description: string;
    price: number;
    payment: {
      mode: "recurring";
      interval: "monthly";
    };
    status: "ACTIVE" | "ARCHIVED";
  }
  

=== FILE: lib/apiModels/admin/Product.api-model.ts
LANG: ts
SIZE:      848 bytes
----------------------------------------
/**
 * ======================================================
 * FE || AdminProductApiModel
 * ======================================================
 *
 * RUOLO:
 * - Shape dati PRODOTTO in contesto ADMIN
 *
 * USATO DA:
 * - adminApi (read)
 * - editor admin (via normalizer)
 *
 * ORIGINE:
 * - Backend CORE (source of truth)
 *
 * NOTE:
 * - Questo NON è un modello UI
 * - Rappresenta fedelmente il dominio backend
 * ======================================================
 */

export interface AdminProductApiModel {
    id: string;
    name: string;
    nameKey?:string; 
    description: string;
    descriptionKey?:string ; 
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    startupFee: number;
    pricing: {
      yearly: number;
      monthly: number;
    };
   optionIds : string[];
    
   requiresConfiguration:boolean ; 

 
  }
 
  

=== FILE: lib/apiModels/admin/Solution.api-model.ts
LANG: ts
SIZE:      717 bytes
----------------------------------------
/**
 * ======================================================
 * FE || AdminSolution — API MODEL
 * ======================================================
 *
 * RUOLO:
 * - Shape Solution lato ADMIN (backend-aligned)
 *
 * USATO DA:
 * - admin.solutions.api
 * - admin.solution.editor.api (list)
 *
 * SOURCE:
 * - Backend (source of truth)
 * ======================================================
 */

export type SolutionStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

export type AdminSolution = {
  id: string;
  name: string;
  description: string;
  status: SolutionStatus;
  createdAt: string;
  updatedAt?: string;
};

export type AdminSolutionsResponse = {
  ok: true;
  solutions: AdminSolution[];
};


=== FILE: lib/apiModels/public/SolutionConfiguratorSeed.api-model.ts
LANG: ts
SIZE:      625 bytes
----------------------------------------
// ======================================================
// FE || SolutionConfiguratorSeedApiModel
// ======================================================
//
// RUOLO:
// - DTO pubblico Solution per CONFIGURATOR
// - READ ONLY
//
// USATO DA:
// - StepBusinessInfo
//
// SOURCE:
// - Backend Solution_KV (subset pubblico)
//
// ======================================================

import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
export interface SolutionConfiguratorSeedApiModel {
  id: string;

  descriptionTags: string[];
  serviceTags: string[];

  openingHours?: OpeningHoursFE;
}

=== FILE: lib/cart/CartItem.store-model.ts
LANG: ts
SIZE:      527 bytes
----------------------------------------
/**
 * ======================================================
 * FE || CartItem — STORE MODEL (ALIGNED BE)
 * ======================================================
 *
 * RUOLO:
 * - Riflesso ESATTO del Cart BE
 * - Intento di acquisto (slot unico)
 *
 * CONTIENE:
 * - productId
 * - configurationId
 *
 * NON CONTIENE:
 * - pricing
 * - label
 * - title
 * - options
 * ======================================================
 */

export interface CartItem {
  productId: string;
  configurationId: string;
  quantity: 1;
}


=== FILE: lib/cart/cart.api.ts
LANG: ts
SIZE:     1902 bytes
----------------------------------------
/**
 * ======================================================
 * FE || Cart API (POINTER-ONLY)
 * ======================================================
 *
 * SOURCE OF TRUTH:
 * - BE: /api/cart
 *
 * NOTE:
 * - Cart = pointer ONLY (configurationId)
 * - Nessun item, nessun pricing
 * ======================================================
 */
import { useIdentityStore } from "../store/identity.store";

export type CartPointer = {
    configurationId: string;
  };
  
  /* =========================
     GET CART
  ========================= */
  export async function fetchCart(): Promise<CartPointer | null> {
    const res = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
    });
  
    if (!res.ok) return null;
  
    const json = await res.json();
    return json.cart ?? null;
  }
  
  /* =========================
     PUT CART (SET POINTER)
  ========================= */
  export async function putCart(
    payload: CartPointer
  ): Promise<void> {
    const { identityId } = useIdentityStore.getState();
    const res = await fetch("/api/cart", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" ,
        // ======================================================
      // 🆔 IDENTITY — SHADOW HEADER
      // ======================================================
      // Header informativo (non usato dal backend).
      // Serve per debug, audit e futura identity-first API.

        "X-WOD-Identity": identityId,
      },
      
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      console.error("[CART] PUT failed", res.status);
    }
  }
  
  /* =========================
     DELETE CART
  ========================= */
  export async function clearCart(): Promise<void> {
    await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
    });
  }
  

=== FILE: lib/cart/cart.store.ts
LANG: ts
SIZE:      845 bytes
----------------------------------------
import { create } from "zustand";
import {type CartPointer } from "./cart.api";
/**
 * ======================================================
 * FE || Cart Store
 * ======================================================
 *
 * RUOLO:
 * - Stato locale FE
 * - Slot unico
 *
 * NOTE:
 * - NO pricing
 * - NO preview
 * - NO localStorage
 * ======================================================
 */
/**
 * NOTA ARCHITETTURALE:
 * - Questo store NON conosce identity né auth
 * - Il carrello è identity-scoped a livello BE
 * - Lo stato FE è solo una proiezione temporanea
 */


interface CartState {
  item?: CartPointer;

  setItem: (item: CartPointer) => void;
  clear: () => void;
}

export const cartStore = create<CartState>((set) => ({
  item: undefined,

  setItem: (item) => set({ item }),
  clear: () => set({ item: undefined }),
}));


=== FILE: lib/cart/cart.sync.ts
LANG: ts
SIZE:      549 bytes
----------------------------------------
import { cartStore } from "./cart.store";
import { fetchCart } from "./cart.api";

/**
 * ======================================================
 * FE || Cart Sync
 * ======================================================
 *
 * RUOLO:
 * - Restore carrello da BE
 * - Usato post-login / bootstrap app
 * ======================================================
 */

export async function syncCartFromBackend() {
  const item = await fetchCart();
  if (item) {
    cartStore.getState().setItem(item);
  } else {
    cartStore.getState().clear();
  }
}


=== FILE: lib/config.ts
LANG: ts
SIZE:      797 bytes
----------------------------------------
// ======================================================
// FE || src/lib/config.ts
// ======================================================
//
// CONFIG — API BASE (FE)
// ------------------------------------------------------
// RUOLO:
// - Fornire API_BASE al client FE
//
// INVARIANTE ARCHITETTURALE:
// - Backend = source of truth
// - FE NON gestisce sicurezza, cookie o CORS
//
// DEV MODE:
// - Auth funziona via cookie cross-site
// - Gestito dal backend (SameSite / Secure)
//
// ======================================================

const FALLBACK_API_BASE = "https://api.webonday.it";

/**
 * API base URL
 *
 * - VITE_API_BASE → build-time (DEV / preview)
 * - fallback → produzione stabile
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? FALLBACK_API_BASE;


=== FILE: lib/dto/AdminProductUpdatePayload.ts
LANG: ts
SIZE:      776 bytes
----------------------------------------
/**
 * ======================================================
 * FE || AdminProductUpdatePayload
 * ======================================================
 *
 * RUOLO:
 * - Payload FE → BE per aggiornamento prodotto
 *
 * USATO DA:
 * - adminApi (PUT /api/products/register)
 *
 * ORIGINE:
 * - Mapper / normalizer FE
 *
 * NOTE:
 * - Contiene SOLO i campi accettati dal backend
 * - Nessun campo UI-only
 * ======================================================
 */

export interface AdminUpdateProductDTO {
  id: string;
  name: string;
  nameKey?:string; 
  description: string;
  descriptionKey?:string; 
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  startupFee: number;
  pricing: {
    yearly: number;
    monthly: number;
  };


  requiresConfiguration: boolean; 

}


=== FILE: lib/env.ts
LANG: ts
SIZE:      569 bytes
----------------------------------------
// ======================================================
// FE || src/lib/env.ts
// ======================================================
//
// SINGLE SOURCE OF TRUTH — ENVIRONMENT
//
// - Decide DEV vs PROD
// - Evita redirect cross-domain
// - Centralizza API_BASE
// ======================================================

const isDev = import.meta.env.MODE === "development";

export const ENV = {
  isDev,
  isProd: !isDev,

  API_BASE: import.meta.env.VITE_API_BASE,

  FRONTEND_ORIGIN: isDev
    ? "http://localhost:5173"
    : "https://www.webonday.it",
};


=== FILE: lib/geo/italyCapoluoghi.data.ts
LANG: ts
SIZE:    72706 bytes
----------------------------------------
export type ItalyCapoluogo = {
    city: string;
    province: string;
    region: string;
    state: "Italia";
  };
  
  
  export const ITALY_CAPOLUOGHI: ItalyCapoluogo[] = [
    { city: "Roma", province: "RM", region: "Lazio", state: "Italia" },
    { city: "Milano", province: "MI", region: "Lombardia", state: "Italia" },
    { city: "Napoli", province: "NA", region: "Campania", state: "Italia" },
    { city: "Torino", province: "TO", region: "Piemonte", state: "Italia" },
    { city: "Palermo", province: "PA", region: "Sicilia", state: "Italia" },
    { city: "Bologna", province: "BO", region: "Emilia-Romagna", state: "Italia" },
    { city: "Firenze", province: "FI", region: "Toscana", state: "Italia" },
    { city: "Venezia", province: "VE", region: "Veneto", state: "Italia" },
    { city: "Bari", province: "BA", region: "Puglia", state: "Italia" },
  { city: "Brindisi", province: "BR", region: "Puglia", state: "Italia" },
{ city: "Altamura", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Bitonto", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Bitritto", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Capurso", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Casamassima", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Conversano", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Corato", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Gioia del Colle", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Gravina in Puglia", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Locorotondo", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Mola di Bari", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Monopoli", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Noicattaro", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Palo del Colle", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Putignano", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Rutigliano", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Sammichele di Bari", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Turi", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Valenzano", province: "Bari", region: "Puglia", state: "Italia" },
  { city: "Barletta", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Andria", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Trani", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Bisceglie", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Canosa di Puglia", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Margherita di Savoia", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Minervino Murge", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "San Ferdinando di Puglia", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Spinazzola", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Trinitapoli", province: "BAT", region: "Puglia", state: "Italia" },
  { city: "Carovigno", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Ceglie Messapica", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Fasano", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Francavilla Fontana", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Mesagne", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Ostuni", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "San Donaci", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "San Michele Salentino", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "San Pancrazio Salentino", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Torchiarolo", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Villa Castelli", province: "Brindisi", region: "Puglia", state: "Italia" },
  { city: "Foggia", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Manfredonia", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "San Severo", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Cerignola", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Lucera", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Vieste", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Peschici", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Monte Sant'Angelo", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Apricena", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Lesina", province: "Foggia", region: "Puglia", state: "Italia" },
  { city: "Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Acquarica del Capo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Alessano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Alezio", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Alliste", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Andrano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Aradeo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Arnesano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Bagnolo del Salento", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Botrugno", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Calimera", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Campi Salentina", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Cannole", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Caprarica di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Carmiano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Carpignano Salentino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Casarano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Castri di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Castrignano de' Greci", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Castrignano del Capo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Cavallino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Collepasso", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Copertino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Corigliano d'Otranto", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Corsano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Cursi", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Cutrofiano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Diso", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Gagliano del Capo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Galatina", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Galatone", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Gallipoli", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Giuggianello", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Giurdignano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Guagnano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Lizzanello", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Maglie", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Martano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Martignano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Matino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Melendugno", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Melissano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Miggiano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Minervino di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Monteroni di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Montesano Salentino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Morciano di Leuca", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Muro Leccese", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Nardò", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Neviano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Nociglia", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Novoli", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Ortelle", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Otranto", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Palmariggi", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Parabita", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Patù", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Poggiardo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Porto Cesareo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Presicce-Acquarica", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Racale", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Ruffano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Salice Salentino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Salve", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "San Cassiano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "San Cesario di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "San Donato di Lecce", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Sannicola", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Scorrano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Sogliano Cavour", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Soleto", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Specchia", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Spongano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Squinzano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Sternatia", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Supersano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Surano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Surbo", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Taurisano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Taviano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Tiggiano", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Trepuzzi", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Tricase", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Tuglie", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Ugento", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Uggiano la Chiesa", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Veglie", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Vernole", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Zollino", province: "Lecce", region: "Puglia", state: "Italia" },
  { city: "Taranto", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Avetrana", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Carosino", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Castellaneta", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Crispiano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Faggiano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Fragagnano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Ginosa", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Grottaglie", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Laterza", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Leporano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Lizzano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Manduria", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Martina Franca", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Maruggio", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Massafra", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Monteiasi", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Montemesola", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Monteparano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Mottola", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Palagianello", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Palagiano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Pulsano", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Roccaforzata", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "San Giorgio Ionico", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "San Marzano di San Giuseppe", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Sava", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Statte", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Torricella", province: "Taranto", region: "Puglia", state: "Italia" },
  { city: "Potenza", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Abriola", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Acerenza", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Albano di Lucania", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Anzi", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Armento", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Atella", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Avigliano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Balvano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Banzi", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Baragiano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Bella", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Brienza", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Brindisi Montagna", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Calvello", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Calvera", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Campomaggiore", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Cancellara", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Carbone", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castelgrande", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castelluccio Inferiore", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castelluccio Superiore", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castelmezzano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castelsaraceno", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Castronuovo di Sant'Andrea", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Cersosimo", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Chiaromonte", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Corleto Perticara", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Episcopia", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Fardella", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Filiano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Forenza", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Francavilla in Sinni", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Gallicchio", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Genzano di Lucania", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Grumento Nova", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Guardia Perticara", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Lagonegro", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Latronico", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Laurenzana", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Lauria", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Lavello", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Maratea", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Marsico Nuovo", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Marsicovetere", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Maschito", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Melfi", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Missanello", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Molterno", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Montemilone", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Montemurro", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Muro Lucano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Nemoli", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Noepoli", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Oppido Lucano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Palazzo San Gervasio", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Pescopagano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Picerno", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Pietragalla", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Pietrapertosa", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Pignola", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Rapolla", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Rapone", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Rionero in Vulture", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Ripacandida", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Rivello", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Roccanova", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Rotonda", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Ruoti", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Ruvo del Monte", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Chirico Nuovo", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Chirico Raparo", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Costantino Albanese", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Fele", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Martino d'Agri", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "San Severino Lucano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Sant'Angelo Le Fratte", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Sant'Arcangelo", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Sarconi", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Sasso di Castalda", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Satriano di Lucania", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Savoia di Lucania", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Senise", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Spinoso", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Teana", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Terranova di Pollino", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Tito", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Tolve", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Tramutola", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Trecchina", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Trivigno", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Vaglio Basilicata", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Venosa", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Vietri di Potenza", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Viggianello", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Viggiano", province: "Potenza", region: "Basilicata", state: "Italia" },
  { city: "Matera", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Accettura", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Aliano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Bernalda", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Calciano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Cirigliano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Colobraro", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Craco", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Ferrandina", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Garaguso", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Gorgoglione", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Grassano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Grottole", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Irsina", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Miglionico", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Montalbano Jonico", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Montescaglioso", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Nova Siri", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Oliveto Lucano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Pisticci", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Policoro", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Pomarico", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Rotondella", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Salandra", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "San Giorgio Lucano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "San Mauro Forte", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Scanzano Jonico", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Stigliano", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Tricarico", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Tursi", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Valsinni", province: "Matera", region: "Basilicata", state: "Italia" },
  { city: "Campobasso", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Acquaviva Collecroce", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Baranello", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Bojano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Bonefro", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Busso", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Campochiaro", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Campodipietra", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Campolieto", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Campomarino", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Casacalenda", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Casalciprano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Castelbottaccio", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Castellino del Biferno", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Castelmauro", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Castropignano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Cercemaggiore", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Cercepiccola", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Civitacampomarano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Colle d’Anchise", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Colletorto", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Duronia", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Ferrazzano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Fossalto", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Gambatesa", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Gildone", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Guardialfiera", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Guardiaregia", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Guglionesi", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Jelsi", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Larino", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Limosano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Lucito", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Lupara", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Macchia Valfortore", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Mafalda", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Matrice", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Mirabello Sannitico", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Molise", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Monacilioni", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montagano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montecilfone", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montefalcone nel Sannio", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montelongo", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montemitro", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montenero di Bisaccia", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Montorio nei Frentani", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Morrone del Sannio", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Oratino", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Palata", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Petacciato", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Petrella Tifernina", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Pietracatella", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Pietracupa", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Portocannone", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Provvidenti", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Riccia", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Ripabottoni", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Ripalimosani", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Roccavivara", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Rotello", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Salcito", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Biase", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Felice del Molise", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Giacomo degli Schiavoni", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Giovanni in Galdo", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Giuliano del Sannio", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "San Giuliano di Puglia", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Santa Croce di Magliano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Sant’Angelo Limosano", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Sepino", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Spinete", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Tavenna", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Termoli", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Torella del Sannio", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Toro", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Trivento", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Ururi", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Vinchiaturo", province: "Campobasso", region: "Molise", state: "Italia" },
  { city: "Isernia", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Agnone", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Bagnoli del Trigno", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Belmonte del Sannio", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Cantalupo nel Sannio", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Capracotta", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Carovilli", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Carpinone", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Castel del Giudice", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Castel San Vincenzo", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Castelpetroso", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Castelpizzuto", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Castelverrino", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Cerro al Volturno", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Chiauci", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Civitanova del Sannio", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Colli a Volturno", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Conca Casale", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Filignano", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Forlì del Sannio", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Fornelli", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Frosolone", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Longano", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Macchia d’Isernia", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Macchiagodena", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Miranda", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Montaquila", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Montenero Val Cocchiara", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Monteroduni", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pesche", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pescolanciano", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pescopennataro", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pettoranello del Molise", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pietrabbondante", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pizzone", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Poggio Sannita", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Pozzilli", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Rionero Sannitico", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Roccamandolfi", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Roccasicura", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Rocchetta a Volturno", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "San Pietro Avellana", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Sant’Agapito", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Santa Maria del Molise", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Sant’Elena Sannita", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Scapoli", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Sessano del Molise", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Sesto Campano", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Vastogirardi", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Venafro", province: "Isernia", region: "Molise", state: "Italia" },
  { city: "Catanzaro", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Albi", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Amaroni", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Amato", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Andali", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Argusto", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Badolato", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Belcastro", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Borgia", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Botricello", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Caraffa di Catanzaro", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cardinale", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Carlopoli", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cenadi", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Centrache", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cerva", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Chiaravalle Centrale", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cicala", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Conflenti", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cortale", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Cropani", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Curinga", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Davoli", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Decollatura", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Falerna", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Feroleto Antico", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Fossato Serralta", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Gagliato", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Gasperina", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Gimigliano", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Girifalco", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Guardavalle", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Isca sullo Ionio", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Jacurso", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Lamezia Terme", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Magisano", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Maida", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Marcedusa", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Marcellinara", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Martirano", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Martirano Lombardo", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Miglierina", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Montauro", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Montepaone", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Motta Santa Lucia", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Nocera Terinese", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Olivadi", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Palermiti", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Pentone", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Petrizzi", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Petronà", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Pianopoli", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Platania", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "San Floro", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "San Mango d’Aquino", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "San Pietro a Maida", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "San Pietro Apostolo", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "San Sostene", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Sant’Andrea Apostolo dello Ionio", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Santa Caterina dello Ionio", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Serrastretta", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Settingiano", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Simeri Crichi", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Sorbo San Basile", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Soverato", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Soveria Mannelli", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Soveria Simeri", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Squillace", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Stalettì", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Taverna", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Tiriolo", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Torre di Ruggiero", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Vallefiorita", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Zagarise", province: "Catanzaro", region: "Calabria", state: "Italia" },
  { city: "Crotone", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Belvedere di Spinello", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Caccuri", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Carfizzi", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Casabona", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Castelsilano", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Cerenzia", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Cirò", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Cirò Marina", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Crucoli", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Cutro", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Isola di Capo Rizzuto", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Melissa", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Mesoraca", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Pallagorio", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Petilia Policastro", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Roccabernarda", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Rocca di Neto", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "San Mauro Marchesato", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "San Nicola dell'Alto", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Santa Severina", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Savelli", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Scandale", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Strongoli", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Umbriatico", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Verzino", province: "Crotone", region: "Calabria", state: "Italia" },
  { city: "Vibo Valentia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Acquaro", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Arena", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Briatico", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Brognaturo", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Capistrano", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Cessaniti", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Dasà", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Dinami", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Drapia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Fabrizia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Filadelfia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Filandari", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Filogaso", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Francavilla Angitola", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Ionadi", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Joppolo", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Limbadi", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Maierato", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Mileto", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Mongiana", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Monterosso Calabro", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Nardodipace", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Nicotera", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Parghelia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Pizzo", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Pizzoni", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Polia", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Ricadi", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Rombiolo", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "San Calogero", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "San Costantino Calabro", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "San Gregorio d'Ippona", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "San Nicola da Crissa", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Sant'Onofrio", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Serra San Bruno", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Simbario", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Sorianello", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Soriano Calabro", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Spadola", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Spilinga", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Stefanaconi", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Tropea", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Vallelonga", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Vazzano", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Zaccanopoli", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Zambrone", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Zungri", province: "Vibo Valentia", region: "Calabria", state: "Italia" },
  { city: "Reggio Calabria", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Africo", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Agnana Calabra", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Anoia", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Antonimina", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Ardore", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bagaladi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bagnara Calabra", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Benestare", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bianco", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bivongi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bova", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bova Marina", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Brancaleone", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Bruzzano Zeffirio", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Calanna", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Camini", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Campo Calabro", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Candidoni", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Canolo", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Caraffa del Bianco", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Cardeto", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Careri", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Casignana", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Caulonia", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Ciminà", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Cinquefrondi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Cittanova", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Condofuri", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Cosoleto", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Delianuova", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Feroleto della Chiesa", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Ferruzzano", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Fiumara", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Galatro", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Gerace", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Giffone", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Gioia Tauro", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Gioiosa Ionica", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Grotteria", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Laganadi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Laureana di Borrello", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Locri", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Mammola", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Marina di Gioiosa Ionica", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Maropati", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Martone", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Melicuccà", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Melicucco", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Molochio", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Monasterace", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Montebello Ionico", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Motta San Giovanni", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Oppido Mamertina", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Palizzi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Palmi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Pazzano", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Placanica", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Platì", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Polistena", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Portigliola", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Riace", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Rizziconi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Roccaforte del Greco", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Roccella Ionica", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Roghudi", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Rosarno", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Ferdinando", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Giorgio Morgeto", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Giovanni di Gerace", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Lorenzo", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Luca", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Pietro di Caridà", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "San Procopio", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Sant'Agata del Bianco", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Sant'Alessio in Aspromonte", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Sant'Eufemia d'Aspromonte", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Scido", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Scilla", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Seminara", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Siderno", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Sinopoli", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Staiti", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Stignano", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Stilo", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Taurianova", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Terranova Sappo Minulio", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Varapodio", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Villa San Giovanni", province: "Reggio Calabria", region: "Calabria", state: "Italia" },
  { city: "Cosenza", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Acquaformosa", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Acquappesa", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Acri", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Aiello Calabro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Aieta", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Albidona", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Alessandria del Carretto", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Altilia", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Altomonte", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Amantea", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Amendolara", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Aprigliano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Belmonte Calabro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Belsito", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Belvedere Marittimo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Bianchi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Bisignano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Bocchigliero", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Bonifati", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Buonvicino", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Calopezzati", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Caloveto", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Campana", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Canna", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cariati", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Carolei", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Carpanzano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cassano all'Ionio", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Castiglione Cosentino", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Castrolibero", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Castroregio", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Castrovillari", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Celico", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cellara", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cerchiara di Calabria", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cerisano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cervicati", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cerzeto", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cetraro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Civita", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cleto", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Colosimi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Corigliano-Rossano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Crosia", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Diamante", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Dipignano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Domanico", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Fagnano Castello", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Falconara Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Figline Vegliaturo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Firmo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Fiumefreddo Bruzio", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Francavilla Marittima", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Frascineto", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Fuscaldo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Grimaldi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Grisolia", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Guardia Piemontese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Laino Borgo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Laino Castello", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Lappano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Lattarico", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Longobardi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Longobucco", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Lungro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Luzzi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Maierà", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Malito", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Mangone", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Marano Marchesato", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Marano Principato", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Marzi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Mendicino", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Mongrassano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Montalto Uffugo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Montegiordano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Morano Calabro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Mormanno", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Mottafollone", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Nocara", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Oriolo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Orsomarso", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Paola", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Papasidero", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Pedivigliano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Piane Crati", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Pietrafitta", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Pietrapaola", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Plataci", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Praia a Mare", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Rende", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Rocca Imperiale", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Roggiano Gravina", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Rose", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Roseto Capo Spulico", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Rota Greca", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Rovito", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Basile", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Benedetto Ullano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Cosmo Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Demetrio Corone", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Donato di Ninea", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Fili", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Giorgio Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Giovanni in Fiore", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Lorenzo Bellizzi", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Lorenzo del Vallo", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Lucido", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Marco Argentano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Martino di Finita", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Nicola Arcella", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Pietro in Amantea", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "San Sosti", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Santa Caterina Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Santa Domenica Talao", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Sant'Agata di Esaro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Santo Stefano di Rogliano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Scalea", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Serra d'Aiello", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Spezzano Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Spezzano della Sila", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Tarsia", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Terranova da Sibari", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Terravecchia", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Torano Castello", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Tortora", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Trebisacce", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Vaccarizzo Albanese", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Verbicaro", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Villapiana", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Zumpano", province: "Cosenza", region: "Calabria", state: "Italia" },
  { city: "Cagliari", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Assemini", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Capoterra", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Decimomannu", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Elmas", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Monserrato", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Pula", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Quartu Sant'Elena", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Quartucciu", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Selargius", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Sestu", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Uta", province: "Cagliari", region: "Sardegna", state: "Italia" },
  { city: "Villa San Pietro", province: "Cagliari", region: "Sardegna", state: "Italia" },
   { city: "Sassari", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Alghero", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Porto Torres", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Ozieri", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Tempio Pausania", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Castelsardo", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Arzachena", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "La Maddalena", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Santa Teresa Gallura", province: "Sassari", region: "Sardegna", state: "Italia" },
  { city: "Nuoro", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Macomer", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Siniscola", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Orosei", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Dorgali", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Orgosolo", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Mamoiada", province: "Nuoro", region: "Sardegna", state: "Italia" },
  { city: "Oristano", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Cabras", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Ghilarza", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Bosa", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Terralba", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Arborea", province: "Oristano", region: "Sardegna", state: "Italia" },
  { city: "Carbonia", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Iglesias", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Sanluri", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Villacidro", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Guspini", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Muravera", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Sant'Antioco", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
  { city: "Carloforte", province: "Sud Sardegna", region: "Sardegna", state: "Italia" },
];


=== FILE: lib/geo/italyCapoluoghi.utils.ts
LANG: ts
SIZE:      840 bytes
----------------------------------------
import { ITALY_CAPOLUOGHI, type ItalyCapoluogo } from "./italyCapoluoghi.data";

/* ======================================================
   NORMALIZER (UX FRIENDLY)
====================================================== */
function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ======================================================
   SEARCH — CITY AUTOCOMPLETE
====================================================== */
export function searchCapoluoghi(
  query: string,
  limit = 6
): ItalyCapoluogo[] {
  if (!query || query.trim().length < 2) return [];

  const q = normalize(query);

  return ITALY_CAPOLUOGHI
    .filter((c) => normalize(c.city).startsWith(q))
    .sort((a, b) => a.city.length - b.city.length)
    .slice(0, limit);
}


=== FILE: lib/geo/italyPrefill.ts
LANG: ts
SIZE:      695 bytes
----------------------------------------
// ======================================================
// FE || GEO || ITALY PREFILL (HELPER)
// ======================================================
//
// RUOLO:
// - Fornire valori di default NON vincolanti
// - Usato solo per UX / prefill iniziale
//
// INVARIANTI:
// - FE ONLY
// - Sempre sovrascrivibile
// - Nessuna persistenza
// ======================================================

export type ItalyAddressPrefill = {
    country: "IT";
    city: string;
    province: string;
  };
  
  export function getItalyAddressPrefill(): ItalyAddressPrefill {
    return {
      country: "IT",
      city: "Bari",        // ← puoi cambiare in futuro
      province: "BA",
    };
  }
  

=== FILE: lib/geo/useCityAutocomplete.ts
LANG: ts
SIZE:      328 bytes
----------------------------------------
import { useMemo } from "react";
import { searchCapoluoghi } from "./italyCapoluoghi.utils";

export function useCityAutocomplete(cityInput: string) {
  const suggestions = useMemo(() => {
    return searchCapoluoghi(cityInput);
  }, [cityInput]);

  return {
    suggestions,
    hasSuggestions: suggestions.length > 0,
  };
}


=== FILE: lib/normalizers/mapAdminProductToUpdatePayload.ts
LANG: ts
SIZE:     1024 bytes
----------------------------------------
// ======================================================
// FE || lib/normalizers/mapamdinProductToUpdatePayload.ts
// ======================================================
// ADAPTER ADMIN FE → BACKEND CORE
//
// NOTA:
// - Le opzioni NON transitano più da qui
// - Questo normalizer gestisce SOLO dati prodotto
// ======================================================

import type { AdminProductApiModel } from "../apiModels/admin/Product.api-model";
import type { AdminUpdateProductDTO } from "../dto/AdminProductUpdatePayload";

export function adminProductToBE(
  product: AdminProductApiModel
): AdminUpdateProductDTO {
  return {
    id: product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    status: product.status,

    startupFee: Number(product.startupFee) || 0,

    pricing: {
      yearly: Number(product.pricing?.yearly) || 0,
      monthly: Number(product.pricing?.monthly) || 0,
    },

    requiresConfiguration: product.requiresConfiguration ?? false,

   
  };
}


=== FILE: lib/normalizers/product.admin-to-public.ts
LANG: ts
SIZE:     1709 bytes
----------------------------------------
/**
 * ======================================================
 * FE || NORMALIZER — PRODUCT (ADMIN → PUBLIC)
 * ======================================================
 *
 * RUOLO:
 * - Adattare il dominio backend al modello UI pubblico
 *
 * NOTE:
 * - Punto UNICO di traduzione
 * - Nessuna fetch qui
 * ======================================================
 */

import type { AdminProductApiModel } from "../apiModels/admin/Product.api-model";
import type {
  ProductVM,
  ProductOptionVM,
} from "../viewModels/product/Product.view-model";

/* =========================
   OPTION NORMALIZER
========================= */
export function normalizeAdminOption(raw: any): ProductOptionVM {
  return {
    id: raw.id,

    // 👇 UI usa label, BE usa name
    label: raw.label ?? raw.name ?? "Opzione",

    // 👇 description passa SOLO se BE la espone
    description: raw.description ?? "",

    price: Number(raw.price) || 0,

    // 👇 NON hardcodare
    type:
      raw.type === "yearly"
        ? "yearly"
        : raw.type === "one_time"
        ? "one_time"
        : "monthly",
  };
}

/* =========================
   PRODUCT NORMALIZER
========================= */
export function normalizeAdminProductToPublic(
  raw: AdminProductApiModel & { options?: any[] }
): ProductVM {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",

    startupFee: Number(raw.startupFee) || 0,

    pricing: {
      yearly: Number(raw.pricing?.yearly) || 0,
      monthly: Number(raw.pricing?.monthly) || 0,
    },

    requiresConfiguration: Boolean(raw.requiresConfiguration),

    // 👇 QUI PASSA TUTTO
    options: raw.options?.map(normalizeAdminOption) ?? [],
  };
}


=== FILE: lib/payments/paypal.ts
LANG: ts
SIZE:      993 bytes
----------------------------------------
// src/lib/payments/paypal.ts
declare global {
    interface Window {
      paypal: any;
    }
  }
 
  export async function loadPaypalSdk(clientId: string): Promise<void> {
    if (typeof window === "undefined") return;
    
    if (window.paypal) return;
  
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("PayPal SDK load error"));
      document.body.appendChild(script);
    });
  }
  
  export function mountPaypalButtons(
    containerId: string,
    config: any
  ): void {
    const el =
      typeof containerId === "string"
        ? document.querySelector(containerId)
        : containerId;
  
    if (!el) {
      throw new Error("PayPal container not found");
    }
  
    window.paypal.Buttons(config).render(el);
  }
  

=== FILE: lib/payments/paypalEnv.ts
LANG: ts
SIZE:      254 bytes
----------------------------------------
export function getPaypalClientId(): string {
    const env = import.meta.env.VITE_PAYPAL_ENV;
  
    if (env === "live") {
      return import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE;
    }
  
    return import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;
  }
  

=== FILE: lib/publicApi/solutions/solutions.public.api.ts
LANG: ts
SIZE:     3209 bytes
----------------------------------------
/**
 * ======================================================
 * FE || PUBLIC API — SOLUTIONS
 * File: src/lib/publicApi/solutions/solutions.public.api.ts
 * ======================================================
 *
 * RUOLO:
 * - Accesso pubblico alle Solutions
 *
 * USATO DA:
 * - Landing
 * - Catalogo
 * - Configuratore
 *
 * INVARIANTI:
 * - READ ONLY
 * - Nessuna auth
 * - Backend = source of truth
 *
 * NOTA:
 * - NON usare per admin
 * ======================================================
 */

import { apiFetch } from "../../api";
import { API_BASE } from "../../config";

import { type PublicSolutionDTO } from "@src/marketing/pages/buyflow/api/DataTransferObject/solution.public.dto";
/* ======================================================
   DTO — SOLUTION (LIST)
   → usato per catalogo / cards
====================================================== */
import { type OpeningHoursFE } from "@shared/domain/business/openingHours.types";
/* ======================================================
   DTO — SOLUTION (DETAIL)
   → usato da configuratore / pagina solution
====================================================== */
export type PublicSolutionDetailDTO = {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;

  icon?: string;

  image?: {
    hero: string;
    card: string;
    fallback?: string;
  };

  industries?: string[];

  descriptionTags: string[];
  serviceTags: string[];

  openingHours : OpeningHoursFE;
};

/* ======================================================
   RESPONSE TYPES
====================================================== */
type PublicSolutionsResponse = {
  ok: true;
  solutions: PublicSolutionDTO[];
};

type PublicSolutionDetailResponse = {
  ok: true;
  solution: PublicSolutionDetailDTO;
  products: unknown[];
};

/* ======================================================
   FETCH — SOLUTIONS LIST
====================================================== */
export async function fetchPublicSolutions(): Promise<
  PublicSolutionDTO[]
> {
  const res = await fetch(`${API_BASE}/api/solution/list`);
  if (!res.ok) throw new Error("FAILED_TO_FETCH_SOLUTIONS");

  const data: PublicSolutionsResponse = await res.json();
  return data.solutions ?? [];
}

/* ======================================================
   FETCH — SOLUTION DETAIL
====================================================== */
export async function fetchPublicSolutionById(
  id: string
): Promise<PublicSolutionDetailDTO> {
  const res = await fetch(
    `${API_BASE}/api/solution?id=${encodeURIComponent(id)}`
  );
  if (!res.ok) throw new Error("FAILED_TO_FETCH_SOLUTION");

  const data: PublicSolutionDetailResponse = await res.json();
  if (!data?.ok || !data.solution) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return data.solution;
}

export async function getSolutionById(solutionId: string) {
  const res = await apiFetch<{
    ok: true;
    solution: {
      tags?: string[];
      userGeneratedTags?: string[];
    };
  }>(`/api/solution?id=${solutionId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res) {
    throw new Error("API /api/solution returned null");
  }

  return res;

}



=== FILE: lib/store/adminSolutions.store.ts
LANG: ts
SIZE:      892 bytes
----------------------------------------
// frontend/src/stores/adminSolutions.store.ts

import { create } from "zustand";
import type { AdminSolution } from "../apiModels/admin/Solution.api-model";
import { fetchAdminSolutions } from "../../../admin/adminApi/admin.solutions.api";

type AdminSolutionsState = {
  solutions: AdminSolution[];
  loading: boolean;
  error: string | null;
  loadSolutions: () => Promise<void>;
};

export const useAdminSolutionsStore =
  create<AdminSolutionsState>((set) => ({
    solutions: [],
    loading: false,
    error: null,

    loadSolutions: async () => {
      set({ loading: true, error: null });

      try {
        const res = await fetchAdminSolutions();
        set({
          solutions: res.solutions,
          loading: false,
        });
      } catch (err) {
        set({
          error: "IMPOSSIBLE_LOAD_SOLUTIONS",
          loading: false,
        });
      }
    },
  }));


=== FILE: lib/store/auth.store.ts
LANG: ts
SIZE:     2352 bytes
----------------------------------------
// ======================================================
// AUTH STORE — FE
// ======================================================
//
// RUOLO (INVARIANTE):
// - Gestisce ESCLUSIVAMENTE lo stato di autenticazione
// - Determina se l’utente è loggato oppure no
//
// NON È RESPONSABILE DI:
// - Identità applicativa (visitor / identity)
// - Persistenza multi-device
// - Carrello o configuration
//
// NOTA ARCHITETTURALE:
// - `user === null` ≠ assenza di identità
// - L’identità applicativa è gestita altrove (IdentityStore)
//
// Questo store NON va esteso oltre auth.
//
// ======================================================

import { create } from "zustand";
import { API_BASE } from "../config";
import { cartStore } from "../cart/cart.store";
import { useIdentityStore } from "./identity.store";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  ready: boolean;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,

  async fetchUser() {
    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, ready: true });
        return;
      }

      const data = await res.json();

      if (data && data.user && typeof data.user === "object") {
        set({ user: data.user, ready: true });

        // ======================================================
        // 🔗 IDENTITY ATTACH (SOFT)
        // ======================================================
        // Collega l'identità applicativa FE allo user autenticato.
        // NON crea sessioni
        // NON migra dati
        // NON tocca il carrello
        useIdentityStore.getState().attachUser(data.user.id);
      } else {
        set({ user: null, ready: true });
      }
    } catch {
      set({ user: null, ready: true });
    }
  },

  clearUser() {
    set({ user: null, ready: true });

    // ======================================================
    // 🔗 IDENTITY DETACH (SOFT)
    // ======================================================
    // Torna in modalità visitor mantenendo identityId
    useIdentityStore.getState().detachUser();

    cartStore.getState().clear();
  },
}));


=== FILE: lib/store/identity.store.ts
LANG: ts
SIZE:     3029 bytes
----------------------------------------
// ======================================================
// FE || store/identity.store.ts
// ======================================================
//
// IDENTITY STORE — SOFT / SHADOW MODE
//
// RUOLO:
// - Gestire l’identità applicativa FE
// - Precedere l’autenticazione
// - Sopravvivere al login / logout
//
// QUESTA IDENTITY:
// - NON è una sessione
// - NON è un user
// - NON sostituisce auth.store
//
// È un perno stabile per:
// - visitor
// - device
// - future multi-device
//
// ======================================================
/**
 * NOTA TERMINOLOGICA (VINCOLANTE):
 *
 * - Identity ≠ User
 * - Identity ≠ Auth
 * - Identity è un concetto applicativo FE
 * - User esiste SOLO se autenticato
 *
 * Vietato usare `identityId` come `userId`.
 */
// ======================================================
// IDENTITY — PERSISTED SHAPE (NO METHODS)
// ======================================================
interface PersistedIdentity {
    identityId: string;
    mode: IdentityMode;
    userId?: string;
  }
  
import { create } from "zustand";

const IDENTITY_STORAGE_KEY = "WOD_IDENTITY_V1";

export type IdentityMode = "visitor" | "user";

export interface IdentityState {
  /** Identità applicativa stabile (per device) */
  identityId: string;

  /** Stato logico */
  mode: IdentityMode;

  /** UserId associato (se loggato) */
  userId?: string;

  /** Azioni */
  attachUser: (userId: string) => void;
  detachUser: () => void;
}

/**
 * Utility — genera identityId
 * Usa crypto se disponibile, fallback sicuro
 */
function generateIdentityId(): string {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `identity_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

/**
 * Bootstrap identity dal localStorage
 */
function loadInitialIdentity(): PersistedIdentity {
    try {
      const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PersistedIdentity;
      }
    } catch {
      // ignore
    }
  
    const identity: PersistedIdentity = {
      identityId: generateIdentityId(),
      mode: "visitor",
    };
  
    localStorage.setItem(
      IDENTITY_STORAGE_KEY,
      JSON.stringify(identity)
    );
  
    return identity;
  }
  

export const useIdentityStore = create<IdentityState>((set) => {
  const initial = loadInitialIdentity();

  return {
    ...initial,

    attachUser(userId: string) {
      set((state) => {
        const next = {
          ...state,
          mode: "user" as const,
          userId,
        };

        localStorage.setItem(
          IDENTITY_STORAGE_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    },

    detachUser() {
      set((state) => {
        const next = {
          identityId: state.identityId,
          mode: "visitor" as const,
        };

        localStorage.setItem(
          IDENTITY_STORAGE_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    },
  };
});


=== FILE: lib/ui/scrollWatcher.ts
LANG: ts
SIZE:      565 bytes
----------------------------------------
import { uiBus } from "./uiBus";

let isVisible = false;

export function initWhatsAppScrollWatcher() {
  function onScroll() {
    const atTop = window.scrollY < 40;

    if (atTop && !isVisible) {
      uiBus.emit("whatsapp:show");
      isVisible = true;
    }

    if (!atTop && isVisible) {
      uiBus.emit("whatsapp:hide");
      isVisible = false;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // init immediato

  return () => {
    window.removeEventListener("scroll", onScroll);
    isVisible = false;
  };
}


=== FILE: lib/ui/uiBus.ts
LANG: ts
SIZE:      553 bytes
----------------------------------------
type Handler = (...args: any[]) => void;

class UIBus {
  private listeners = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((h) => h(...args));
  }
}

export const uiBus = new UIBus();


=== FILE: lib/userApi/auth.user.api.ts
LANG: ts
SIZE:     2344 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/authApi.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PRE-MIGRAZIONE)
 *
 * RUOLO:
 * - API FE per l’AUTENTICAZIONE USER (buyer / partner)
 * - Punto di accesso allo stato utente corrente
 *
 * RESPONSABILITÀ:
 * - Recuperare l’utente autenticato via sessione
 * - Fornire URL di login Google OAuth
 * - Eseguire logout user
 *
 * NON FA:
 * - NON gestisce token manuali
 * - NON persiste stato utente
 * - NON decide ruoli o permessi
 * - NON gestisce modalità (buyer / business)
 *
 * INVARIANTI:
 * - L’identità utente deriva ESCLUSIVAMENTE dalla sessione backend
 * - Tutte le richieste user passano da apiFetch
 * - credentials: "include" è obbligatorio
 *
 * RELAZIONE CON BACKEND:
 * - GET  /api/user/me
 * - GET  /api/user/google/auth
 * - POST /api/user/logout
 *
 * RELAZIONE CON UI:
 * - La UI riceve:
 *   • CurrentUser | null
 * - Nessuna normalizzazione UI in questo file
 * - Nessuna assunzione sulla presenza dell’utente
 *
 * RELAZIONE CON api.ts:
 * - Usa apiFetch come client HTTP base
 * - authApi NON conosce API_BASE direttamente
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/auth.user.api.ts
 * - Motivo:
 *   Separare chiaramente:
 *   • API USER
 *   • API ADMIN
 *   • API OBJECT
 *
 * NOTE:
 * - File volutamente minimale
 * - Ogni estensione (refresh, scope, roles)
 *   deve essere guidata dal backend
 * ======================================================
 */

import { apiFetch } from "../api/client";
import { API_BASE } from "../config";

export type CurrentUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiFetch("/api/user/me", {
      credentials: "include",
    });
  } catch (err) {
    console.warn("[authApi] getCurrentUser fallback:", err);
    return null;
  }
}

export function getGoogleLoginUrl(redirect?: string): string {
  const url = new URL(`${API_BASE}/api/user/google/auth`);
  if (redirect) url.searchParams.set("redirect", redirect);
  return url.toString();
}
export async function logout() {
  await apiFetch("/api/user/logout", { method: "POST" });
}




=== FILE: lib/userApi/layout.user.api.ts
LANG: ts
SIZE:     1500 bytes
----------------------------------------
// ======================================================
// FE || src/lib/userApi/layout.user.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — USER LAYOUT API
//
// RUOLO:
// - Recuperare dal backend i layout disponibili (KV)
// - Usato da StepReview per mostrare preview e selezione
//
// INVARIANTI:
// - Backend = source of truth
// - NO logica layout qui (solo fetch + typing)
// - Usa apiFetch come unico client HTTP
//
// ENDPOINT ATTESO (BE):
// - GET /api/layouts/available?solutionId=...&productId=...
//   (se il tuo BE usa un path diverso, cambiamo SOLO la stringa qui)
// ======================================================

import { apiFetch } from "../api/client";
import type { LayoutKVDTO } from "../../../user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";

export type FetchAvailableLayoutsParams = {
  solutionId: string;
  productId: string;
};

export type FetchAvailableLayoutsResponse = {
  ok: true;
  layouts: LayoutKVDTO[];
};

export async function fetchAvailableLayouts(
  params: FetchAvailableLayoutsParams
): Promise<FetchAvailableLayoutsResponse> {
  const { solutionId, productId } = params;

  const qs = new URLSearchParams({
    solutionId,
    productId,
  });

  const res = await apiFetch<FetchAvailableLayoutsResponse>(
    `/api/layouts/available?${qs.toString()}`
  );

  if (!res || !res.ok || !Array.isArray(res.layouts)) {
    throw new Error("Invalid layouts response");
  }

  return res;
}


=== FILE: lib/userApi/order.setup.user.api.ts
LANG: ts
SIZE:     1665 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/orders/order.setup.user.api.ts/lib/userAPi
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (POST-ORDER)
 *
 * RUOLO:
 * - API FE per salvare i dati di setup ordine
 *
 * CONTESTO:
 * - Chiamata DOPO la creazione dell’ordine
 * - Prima del pagamento
 *
 * RESPONSABILITÀ:
 * - Inviare al backend i dati di configurazione finale
 * - Associare i dati all’orderId esistente
 *
 * NON FA:
 * - NON crea ordini
 * - NON calcola prezzi
 * - NON valida i dati di setup
 *
 * INVARIANTI:
 * - orderId è SEMPRE generato dal backend
 * - credentials: include (visitor / user)
 * - Backend = source of truth
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 * - Import path fragile verso pagine UI
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/orders.setup.user.api.ts
 * - Refactor:
 *   • sostituire fetch con apiFetch
 *   • isolare DTO dal layer UI
 *
 * NOTE:
 * - File volutamente minimale
 * - Da NON estendere senza audit di flusso checkout
 * ======================================================
 */

import { apiFetch } from "../api";

/**
 * POST /api/order/setup?orderId=XXX
 */

type OrderSetupPayload = Record<string, unknown>;
export async function saveOrderSetup(
  orderId: string,
  data: OrderSetupPayload
): Promise<unknown> {
  const res = await apiFetch<unknown>(
    `/api/order/setup?orderId=${orderId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (res === null) {
    throw new Error("Invalid order setup response");
  }

  return res;
}


=== FILE: lib/userApi/orders.user.api.ts
LANG: ts
SIZE:     1982 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/orders.user.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - API FE per la creazione ORDINI lato USER / VISITOR
 *
 * RESPONSABILITÀ:
 * - Inviare al backend la richiesta di creazione ordine
 * - Trasmettere i dati minimi necessari (visitor / policy)
 * - Restituire l’identificativo ordine generato dal BE
 *
 * NON FA:
 * - NON calcola prezzi
 * - NON valida contenuti del carrello
 * - NON gestisce pagamenti
 * - NON gestisce stato ordine (delegato al backend)
 *
 * INVARIANTI:
 * - Usa session cookie (credentials: include)
 * - Nessun token admin
 * - Nessun userId deciso dal FE (backend source of truth)
 *
 * RELAZIONE CON BACKEND:
 * - Endpoint: POST /api/order
 * - Il backend:
 *   • genera orderId
 *   • valida policyVersion
 *   • associa visitor / user se presente
 *
 * RELAZIONE CON UI:
 * - La UI riceve solo { orderId }
 * - Ogni step successivo (setup, pagamento, stato)
 *   usa l’orderId come riferimento
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/orders.user.api.ts
 * - Evoluzione prevista:
 *   • supporto a payload più ricchi (configurationId)
 *   • distinzione visitor / user loggato
 *
 * NOTE:
 * - File volutamente minimale
 * - Backend = source of truth
 * ======================================================
 */

import { apiFetch } from "../api";

export type CreateOrderPayload = {
  visitorId: string;
  email: string;
  policyVersion: string;
};

/**
 * POST /api/order
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<{ orderId: string }> {
  const res = await apiFetch<{ orderId: string }>(
    "/api/order",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res || !res.orderId) {
    throw new Error("Invalid order creation response");
  }

  return res;
}



=== FILE: lib/userApi/policy.user.api.ts
LANG: ts
SIZE:     1885 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/policy/policyApi.ts-> /lib/userApi/policy.user.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - API FE per il dominio POLICY
 *
 * RESPONSABILITÀ:
 * - Recuperare l’ultima versione della policy
 * - Distinguere scope (general / checkout)
 *
 * NON FA:
 * - NON accetta policy
 * - NON persiste consenso
 * - NON interpreta il contenuto legale
 *
 * INVARIANTI:
 * - Il backend decide:
 *   • versione valida
 *   • contenuto
 *   • scope
 * - credentials: include
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/policy.user.api.ts
 * - Refactor:
 *   • uso apiFetch
 *   • allineamento error handling
 *
 * NOTE:
 * - File read-only per design
 * - Backend = source of truth legale
 * ======================================================
 */
// ======================================================
// FE || lib/policy/policyApi.ts
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - API FE per dominio Policy
//
// INVARIANTI:
// - Fetch solo per scope
// - NO accettazione
//
// ======================================================

import { apiFetch } from "../api";
export type PolicyScope = "general" | "checkout";

export type PolicyDTO = {
  scope: PolicyScope;
  version: string;
  content: {
    title: string;
    body: string;
    updatedAt: string;
  };
};

/**
 * GET /api/policy/version/latest?scope=...
 */
export async function fetchLatestPolicy(
  scope: PolicyScope
): Promise<PolicyDTO> {
  const res = await apiFetch<PolicyDTO>(
    `/api/policy/version/latest?scope=${scope}`
  );

  if (!res) {
    throw new Error("Invalid policy response");
  }

  return res;
}

=== FILE: lib/userModeStore.ts
LANG: ts
SIZE:     2040 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/userModeStore.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v0.9 (legacy)
 *
 * STATO:
 * - DEPRECATED (soft)
 *
 * RUOLO:
 * - Gestione locale del "modo utente" (client / partner)
 *
 * CONTESTO STORICO:
 * - Introdotto per simulare un cambio di contesto UI
 *   tra cliente finale e partner/business
 * - Basato su persistenza locale (localStorage)
 *
 * RESPONSABILITÀ:
 * - Esporre lo stato UI "mode"
 * - Persistenza locale della scelta utente
 *
 * NON FA:
 * - NON gestisce autenticazione
 * - NON rappresenta ruoli reali
 * - NON riflette permessi backend
 * - NON influenza API o sicurezza
 *
 * MOTIVO DEPRECATION:
 * - Il progetto ha adottato un modello più chiaro:
 *   • User = identità unica
 *   • Buyer / Business = stato derivato dal backend
 * - Il mode corretto deve arrivare da:
 *   • sessione
 *   • business associato
 *   • stato attività (DRAFT / ACTIVE)
 *
 * RISCHI SE USATO:
 * - Incoerenza UI
 * - Stato non allineato con backend
 * - Bug di permessi percepiti
 *
 * INVARIANTI ATTUALI:
 * - Non influisce su sicurezza
 * - Usato solo per UI / prototipi
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: RIMOZIONE
 * - Sostituzione con:
 *   • stato derivato da /api/user/me
 *   • oppure da business associato
 *
 * AZIONE CONSIGLIATA:
 * - NON estendere
 * - NON usare in nuove feature
 * - Rimuovere solo dopo audit UI completo
 *
 * NOTE:
 * - File mantenuto per backward compatibility
 * - Backend = source of truth
 * ======================================================
 */

import { create } from "zustand";

export type UserMode = "client" | "partner";

interface UserModeState {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

export const useUserMode = create<UserModeState>((set) => ({
  mode: (localStorage.getItem("user_mode") as UserMode) || "client",
  setMode: (mode) => {
    localStorage.setItem("user_mode", mode);
    set({ mode });
  },
}));


=== FILE: lib/viewModels/option/Option.view-model.ts
LANG: ts
SIZE:      116 bytes
----------------------------------------
export interface OptionViewModel {
    id: string;
    label: string;
    price: number;
    type: "monthly";
  }
  

=== FILE: lib/viewModels/product/Product.view-model.ts
LANG: ts
SIZE:     1557 bytes
----------------------------------------
/**
 * ======================================================
 * FE || Product — VIEW MODEL (PUBLIC)
 * ======================================================
 *
 * RUOLO:
 * - Modello dati usato dalla UI pubblica
 * - Source of truth FE per il comportamento del Product
 *
 * USATO DA:
 * - Catalogo
 * - ProductCard
 * - Cart
 * - Checkout
 *
 * DECISIONE DI DOMINIO (CRITICA):
 * - È il Product a decidere il flusso utente
 * - requiresConfiguration = false → checkout diretto
 * - requiresConfiguration = true  → configuratore
 *
 * NOTE:
 * - UI-first
 * - Nessuna conoscenza del backend
 * - Nessuna logica di business complessa
 * ======================================================
 */

export interface ProductPricingVM {
  /**
   * Prezzo ricorrente annuale
   * (mostrato a UI, NON calcolato qui)
   */
  yearly: number;

  /**
   * Prezzo ricorrente mensile
   */
  monthly: number;
}
export type RecurringType = "monthly"|"yearly"|"one_time";
export interface ProductOptionVM {
  id: string;
  label: string;
  price: number;
  description:string; 

  /**
   * Dominio PUBLIC:
   * - tutte le option sono recurring
   * - billing mensile
   */
  type: RecurringType;
}

export interface ProductVM {
  /**
   * Identificativo univoco prodotto
   */
  id: string;

  /**
   * Copy marketing
   */
  name: string;
  description: string;

  /**
   * Costo di avvio una tantum
   */
  startupFee: number;

  /**
   * Pricing ricorrente
   */
  pricing: ProductPricingVM;

  options?: ProductOptionVM[];
  requiresConfiguration: boolean;
}


=== FILE: lib/viewModels/solution/SolutionEditor.view-model.ts
LANG: ts
SIZE:      631 bytes
----------------------------------------
/**
 * ======================================================
 * FE || SolutionEditor — VIEW MODEL
 * ======================================================
 *
 * RUOLO:
 * - Modello dati usato dall’EDITOR ADMIN
 *
 * NOTE:
 * - UI-first
 * - Può divergere dal backend
 * ======================================================
 */

export type SolutionEditorDTO = {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    icon?: string;
    industries?: string[];
    productIds: string[];
    createdAt: string;
    updatedAt?: string;
  };
  

=== FILE: lib/viewModels/solution/solution.responses.ts
LANG: ts
SIZE:      507 bytes
----------------------------------------
/**
 * ======================================================
 * FE || Solution — API RESPONSES
 * ======================================================
 *
 * RUOLO:
 * - Union response per endpoint admin solution
 * ======================================================
 */

import type { SolutionEditorDTO } from "./SolutionEditor.view-model";

export type AdminSolutionDetailResponse =
  | {
      ok: true;
      solution: SolutionEditorDTO;
    }
  | {
      ok: false;
      error: string;
    };


=== FILE: terms/index.tsx
LANG: tsx
SIZE:     1562 bytes
----------------------------------------
// ======================================================
// FE || pages/terms/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina informativa "Termini & Condizioni"
// - Renderizza POLICY scope=general
//
// INVARIANTI:
// - NON blocca flussi
// - NON richiede accettazione
// - Read-only
//
// ======================================================

import { useEffect, useState } from "react";

type PolicyGeneral = {
  title: string;
  version: string;
  updatedAt?: string;
  content: string;
};

export default function TermsPage() {
  const [policy, setPolicy] = useState<PolicyGeneral | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/version/latest?scope=general`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.content) {
          setPolicy(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Caricamento termini…</p>;
  }

  if (!policy) {
    return <p>Policy non disponibile.</p>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1>{policy.title}</h1>
      <p>
        <strong>Versione:</strong> {policy.version}
      </p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          marginTop: 24,
          lineHeight: 1.6,
        }}
      >
        {policy.content}
      </pre>
    </main>
  );
}


=== FILE: terms/policy/policy.tsx
LANG: tsx
SIZE:      526 bytes
----------------------------------------
// ======================================================
// FE || pages/policy/policy.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina legale Policy / Termini
//
// INVARIANTI:
// - Read-only
// - Contenuto dal BE
// - Usa PolicyViewer
//
// ======================================================

import { PolicyViewer } from "../../../marketing/components/policy/policyViewer";

export default function PolicyPage() {
  return <PolicyViewer scope="general" />;
}


=== FILE: terms/policy/privacy.tsx
LANG: tsx
SIZE:      439 bytes
----------------------------------------
// ======================================================
// FE || pages/policy/privacy.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina Privacy Policy
//
// ======================================================

import { PolicyViewer } from "../../../marketing/components/policy/policyViewer";


export default function Privacy() {
  return <PolicyViewer scope="general" />;
}


=== FILE: terms/policy/terms.tsx
LANG: tsx
SIZE:      439 bytes
----------------------------------------
// ======================================================
// FE || pages/policy/terms.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina Termini di Servizio
//
// ======================================================

import { PolicyViewer } from "../../../marketing/components/policy/policyViewer";

export default function Terms() {
  return <PolicyViewer scope="general" />;
}


=== FILE: utils/admin.ts
LANG: ts
SIZE:      350 bytes
----------------------------------------
export function getAdminToken(): string | null {
    return sessionStorage.getItem("ADMIN_TOKEN");
  }
  
  export function requireAdminToken(): string {
    const token = sessionStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      window.location.href = "/admin/login";
      throw new Error("Missing admin token");
    }
    return token;
  }
  

=== FILE: utils/assets.ts
LANG: ts
SIZE:      954 bytes
----------------------------------------
// ======================================================
// FE || shared/utils/assets.ts
// ======================================================
// RUOLO:
// - Costruzione URL asset pubblici (prompt / upload)
//
// PERCHE:
// - FE non deve hardcodare path
// - Bucket pubblico, nessuna API necessaria
// - Helper di sola presentazione
// ======================================================

export const PROMPT_IMAGES_BASE =
  "https://promptimg.webonday.it";

export type PromptImageKey =
  | "document-front"
  | "document-back"
  | "business-certificate"
  | "business-image";

const PROMPT_IMAGE_MAP: Record<PromptImageKey, string> = {
  "document-front": "prompt-cdi-fronte.png",
  "document-back": "prompt-cdi-retro.png",
  "business-certificate": "certi-business.png",
  "business-image": "upload-img.png",
};

export function getPromptImageUrl(
  key: PromptImageKey
): string {
  return `${PROMPT_IMAGES_BASE}/${PROMPT_IMAGE_MAP[key]}`;
}


=== FILE: utils/cookieConsent.ts
LANG: ts
SIZE:     1234 bytes
----------------------------------------
// src/utils/cookieConsent.ts

const CONSENT_KEY = "webonday_cookie_consent_v1";

export type LocalConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

/**
 * Legge il consenso locale (localStorage)
 */
export function getLocalConsent(): LocalConsent | null {
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LocalConsent;
  } catch {
    return null;
  }
}

/**
 * Salva il consenso locale (NON ritorna nulla)
 */
export function saveLocalConsent(params: {
  analytics: boolean;
  marketing: boolean;
}) {
  const payload: LocalConsent = {
    necessary: true,
    analytics: params.analytics,
    marketing: params.marketing,
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
}

/* =========================
   Helpers opzionali
========================= */

export function hasAnalyticsConsent() {
  return getLocalConsent()?.analytics === true;
}

export function hasMarketingConsent() {
  return getLocalConsent()?.marketing === true;
}

export function clearLocalConsent() {
  localStorage.removeItem(CONSENT_KEY);
}


=== FILE: utils/format.ts
LANG: ts
SIZE:       91 bytes
----------------------------------------
export const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });


=== FILE: utils/seo.ts
LANG: ts
SIZE:      175 bytes
----------------------------------------
export function setDocumentTitle({
    icon = "",
    title = "Webonday",
    suffix = "Espresso digitale"
  }) {
    document.title = `${icon} ${title} – ${suffix}`;
  }
  

=== FILE: utils/slugify.ts
LANG: ts
SIZE:      367 bytes
----------------------------------------
// ======================================================
// FE || UTILS — SLUGIFY
// ======================================================

export function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  

=== FILE: utils/statusUi.ts
LANG: ts
SIZE:      651 bytes
----------------------------------------
/* ======================================================
   FE || UI NORMALIZER — STATUS → WD-STATUS
   ====================================================== */

   const STATUS_CLASS_MAP: Record<string, string> = {
    draft: "draft",
    active: "active",
    pending: "pending",
    confirmed: "active",
    processed: "active",
    completed: "active",
    archived: "archived",
    deleted: "error",
    cancelled: "error",
    suspended: "disabled",
  };
  
  export function getWdStatusClass(status?: string) {
    const key = status?.toLowerCase() ?? "draft";
    return `wd-status wd-status--${STATUS_CLASS_MAP[key] ?? "draft"}`;
  }
  

=== FILE: utils/tags.ts
LANG: ts
SIZE:     1492 bytes
----------------------------------------
// ======================================================
// FE || utils/businessTags.ts
// ======================================================
//
// SINGLE SOURCE OF TRUTH — TAG HANDLING
//
// - Normalizza input umano
// - Deduplica
// - Garantisce formato SEO-safe
// ======================================================

export function normalizeBusinessTags(
  raw: string | string[] | undefined
): string[] {
  if (!raw) return [];

  const items = Array.isArray(raw)
    ? raw
    : raw.split(",");

  const normalized = items
    .map((item) =>
      item
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    )
    .filter(Boolean);

  // dedupe
  return Array.from(new Set(normalized));
}

export function normalizeTags(
    raw: string | string[] | undefined
  ): string[] {
    if (!raw) return [];
  
    const items = Array.isArray(raw)
      ? raw
      : raw.split(",");
  
    const normalized = items
      .map((item) =>
        item
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      )
      .filter(Boolean);
  
    // dedupe
    return Array.from(new Set(normalized));
  }
  

=== FILE: utils/themeSeason.ts
LANG: ts
SIZE:      440 bytes
----------------------------------------
export function applySeasonalTheme(): void {
  const month = new Date().getMonth();
  const isChristmas = month === 11 || month === 0;

  const id = "webonday-theme";
  let link = document.getElementById(id) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = isChristmas ? "/css/christmas.css" : "";
}


=== FILE: utils/visitor.ts
LANG: ts
SIZE:      405 bytes
----------------------------------------
// src/utils/visitor.ts



/**
 * Restituisce un visitorId stabile e persistente nel browser.
 * Evita rigenerazioni accidentali, assicura compatibilità universale.
 */
const KEY = "webonday_visitor_id";

export function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "visitor_" + crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}




francescomaggi@MacBook-Pro shared % 