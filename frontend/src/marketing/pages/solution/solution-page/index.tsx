import { useEffect } from "react";

import { initWhatsAppScrollWatcher } from "@shared/lib/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";

import SolutionsSection from "../../buyflow/solutions/SolutionSection";

export default function Solutions() {
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className="solutions-page">
      {/* ================= INTRO ================= */}
      <section className="solutions-intro section">
        <h1>{t("solutions.h1")}</h1>

        <p className="solutions-intro-text">
          {t("solutions.intro.p1")}
        </p>

        <p className="solutions-intro-text">
          {t("solutions.intro.p2")}
        </p>
      </section>

      {/* ================= CATALOG ================= */}
      <SolutionsSection />

      
    </main>
  );
}
