// ======================================================
// FE || marketing/pages/index.tsx
// ======================================================
// MARKETING LANDING — SINGLE PAGE APPLICATION
//
// RUOLO:
// - Landing principale WebOnDay
// - Composizione verticale delle sezioni chiave
//
// STRUTTURA:
// 1. Solutions
// 2. Mission
// 3. Vision
//
// NOTE:
// - Navbar e Footer sono GLOBALI (fuori da questo file)
// - Nessuna logica nuova
// - Nessuna fetch duplicata
// ======================================================

import HomeHeroConfigurator from "./HomeHeroConfigurator";
export default function MarketingIndex() {
  return (
    <main className="page-shell page-marketing">
      <div className="page-layout page-layout--vertical">

       {/* ================= HERO ================= */}
       <HomeHeroConfigurator />

      </div>
    </main>
  );
}
