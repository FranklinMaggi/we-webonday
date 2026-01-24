// ======================================================
// FE || marketing/pages/founder/index.tsx
// ======================================================
// CHI SIAMO — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Shell globale
// - Nessun copy hardcoded
// - i18n fallback IT
// ======================================================

import founderImg from "@src/assets/founder.png";
import { t } from "@shared/aiTranslateGenerator";
import { chiSiamoClasses as cls } from "./chiSiamo.classes";

export default function ChiSiamo() {
  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <header className={cls.heroSection}>
          <h1 className={cls.heroTitle}>
            {t("founder.hero.h1")}
          </h1>

          <p className={cls.heroSubtitle}>
            {t("founder.hero.subtitle")}
          </p>
        </header>

        {/* ================= FOUNDER ================= */}
        <section className={cls.founderSection}>
          <div className={cls.founderLayout}>
            <img
              src={founderImg}
              alt={t("founder.founder.name")}
              className={cls.founderImage}
            />

            <div className={cls.founderContent}>
              <h2 className={cls.founderName}>
                {t("founder.founder.name")}
              </h2>

              <h3 className={cls.founderRole}>
                {t("founder.founder.role")}
              </h3>

              <p className={cls.founderQuote}>
                {t("founder.founder.quote")}
              </p>
            </div>
          </div>
        </section>

        {/* ================= MISSION ================= */}
        <section className={cls.missionSection}>
          <h2 className={cls.missionTitle}>
            {t("founder.mission.title")}
          </h2>

          <p className={cls.missionText}>
            {t("founder.mission.text")}
          </p>
        </section>

        {/* ================= TEAM ================= */}
        <section className={cls.teamSection}>
          <div className={cls.teamGrid}>
            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.coder.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.coder.text")}
              </p>
            </div>

            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.design.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.design.text")}
              </p>
            </div>

            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.comm.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.comm.text")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
