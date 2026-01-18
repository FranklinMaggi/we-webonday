import { useEffect } from "react";
import { initWhatsAppScrollWatcher } from "../../../lib/ui/scrollWatcher";
import SolutionsSection from "../../../domains/buyflow/solutions/SolutionSection";

export default function Solutions() {
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className="solutions-page">
      {/* ================= INTRO ================= */}
      <section className="solutions-intro section">
        <h1>Le nostre soluzioni</h1>

        <p className="solutions-intro-text">
          Le Solutions WebOnDay sono modelli di sito pensati per
          rispondere a esigenze specifiche di attività diverse.
          Ogni solution fornisce una base strutturata, pronta
          per essere adattata e realizzata attraverso i prodotti
          disponibili.
        </p>

        <p className="solutions-intro-text">
          Scegli la solution più vicina alla tua attività per
          capire come possiamo costruire il tuo sito in modo
          semplice e guidato.
        </p>
      </section>

      {/* ================= CATALOG ================= */}
      <SolutionsSection />
    </main>
  );
}
