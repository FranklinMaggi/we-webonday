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

import Solutions from "../solution/soltuionpage";
import Mission from "../mission";
import Vision from "../vision";

export default function MarketingIndex() {
  return (
    <main className="page-shell page-marketing">
      <div className="page-layout page-layout--vertical">

        {/* ================= SOLUTIONS ================= */}
        <section id="solutions">
          <Solutions />
        </section>

        {/* ================= MISSION ================= */}
        <section id="mission">
          <Mission />
        </section>

        {/* ================= VISION ================= */}
        <section id="vision">
          <Vision />
        </section>

      </div>
    </main>
  );
}
