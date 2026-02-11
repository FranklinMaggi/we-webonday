// ======================================================
// FE || marketing/pages/vision/index.tsx
// ======================================================
// VISION — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Applicazione shell globale
// - Separazione layout / sezioni
// - Nessun contenuto modificato
// ======================================================

import { useEffect } from "react";
import { initWhatsAppScrollWatcher } from "@src/shared/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";
import { visionClasses as cls } from "./vision.classes";

export default function Vision() {
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <section className={cls.heroSection}>
          <h1>{t("vision.hero.h1")}</h1>
          <p className={cls.heroSubtitle}>
            {t("vision.hero.subtitle")}
          </p>
        </section>

        {/* ================= VOICE ================= */}
        <section className={cls.section}>
          <h2>{t("vision.section.voice.h2")}</h2>
          <p>{t("vision.section.voice.p")}</p>
        </section>

        {/* ================= REGISTRY ================= */}
        <section className={cls.section}>
          <h2>{t("vision.section.registry.h2")}</h2>

          <p>{t("vision.section.registry.p1")}</p>
          <p>{t("vision.section.registry.p2")}</p>

          <div className={cls.sectionLinks}>
            <a href="/registro-pubblico">
              {t("vision.section.registry.link.registry")}
            </a>
            <a href="/archivio-pubblico">
              {t("vision.section.registry.link.archive")}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
