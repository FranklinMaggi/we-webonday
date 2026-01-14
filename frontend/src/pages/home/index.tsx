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
      {/* ======================================================
   SECTION — PERCHÉ WEBONDAY
   ====================================================== */}
<section className="section section-why-webonday">
  <h2>Perché WebOnDay</h2>

  <p>
    WebOnDay nasce come progetto artigianale digitale.
    Non vendiamo semplicemente siti web:
    aiutiamo le attività a farsi conoscere online
    senza dover affrontare subito costi, complessità
    o scelte irreversibili.
  </p>

  <p>
    Oggi esistono molte soluzioni gratuite per creare un sito.
    Il vero problema, però, non è lo strumento,
    ma il tempo, l’esperienza e l’energia necessari
    per usarlo davvero nel modo giusto.
  </p>

  <p>
    Per questo abbiamo scelto un approccio diverso:
    partire dall’essenziale, accompagnarti passo dopo passo
    e lasciarti il tempo di capire cosa ti serve davvero.
  </p>

  <ul className="why-list">
    <li>Struttura pronta, senza configurazioni tecniche</li>
    <li>Anteprime reali, non promesse</li>
    <li>Nessun obbligo immediato di acquisto</li>
    <li>Servizi aggiuntivi solo se e quando servono</li>
  </ul>

  <p className="why-footer">
    WebOnDay non è una scorciatoia.
    È un punto di partenza semplice,
    pensato per crescere insieme alla tua attività.
  </p>

  <div className="section-links">
    <a href="/pricing">Scopri i servizi disponibili</a>
    <a href="/referral">Come funziona il referral</a>
  </div>
</section>


    </main>
  );
}
