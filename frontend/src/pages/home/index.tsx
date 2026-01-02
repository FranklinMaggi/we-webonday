// ======================================================
// FE || pages/home/index.tsx
// ======================================================
// HOME PAGE — SAAS LANDING
//
// RUOLO:
// - Landing marketing WebOnDay
// - Punto di ingresso del funnel
//
// MOSTRA:
// - Hero SaaS
// - Sezione Solutions (come componente)
//
// NON FA:
// - NON carica dati direttamente
// - NON gestisce stato solutions
// - NON conosce il backend
// ======================================================

import { useEffect } from "react";

import SolutionsSection from "../../components/solutions/SolutionSection";
import { initWhatsAppScrollWatcher } from "../../lib/ui/scrollWatcher";
import HomeHero from "../../components/hero/home/HomeHero";



export default function Home() {
  /* ===========================
     WHATSAPP VISIBILITY (SCROLL)
     (in futuro andrà nel layout)
  =========================== */
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className="home-saas">
      {/* ================= HERO ================= */}
      <HomeHero/>

      {/* ================= SOLUTIONS ================= */}
      <SolutionsSection />
    </main>
  );
}
