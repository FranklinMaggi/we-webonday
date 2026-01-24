// ======================================================
// FE || marketing/pages/mission/index.tsx
// ======================================================
// MISSION — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Page shell standard
// - Roadmap data-driven via i18n
// - Nessun contenuto hardcoded
// ======================================================

import { t } from "@shared/aiTranslateGenerator";
import { missionClasses as cls } from "./mission.classes";

type RoadmapStatus = "done" | "in-progress" | "pending";

function getStepIcon(status: RoadmapStatus, index: number) {
  switch (status) {
    case "done":
      return <div className={cls.stepIconDone}>✔</div>;
    case "in-progress":
      return <div className={cls.stepIconProgress}>⏳</div>;
    default:
      return <div className={cls.stepIconPending}>{index + 1}</div>;
  }
}

export default function Mission() {
  const roadmap = Array.from({ length: 10 }).map((_, i) => ({
    text: t(`mission.roadmap.${i + 1}.text`),
    status: t(`mission.roadmap.${i + 1}.status`) as RoadmapStatus,
  }));

  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <header className={cls.heroSection}>
          <h1>{t("mission.hero.h1")}</h1>
          <p>{t("mission.hero.subtitle")}</p>
        </header>

        {/* ================= CORE ================= */}
        <section className={cls.section}>
          <p>{t("mission.core.p1")}</p>
          <p>{t("mission.core.p2")}</p>
        </section>

        {/* ================= REFERRAL ================= */}
        <section className={cls.section}>
          <h2>{t("mission.referral.h2")}</h2>
          <p>{t("mission.referral.p1")}</p>
          <p>{t("mission.referral.p2")}</p>
        </section>

        {/* ================= ARCHIVE ================= */}
        <section className={cls.section}>
          <h2>{t("mission.archive.h2")}</h2>
          <p>{t("mission.archive.p1")}</p>
          <p>{t("mission.archive.p2")}</p>
          <p>{t("mission.archive.p3")}</p>
        </section>

        {/* ================= ROADMAP ================= */}
        <section className={cls.roadmapSection}>
          <h2>{t("mission.roadmap.h2")}</h2>
          <p className={cls.roadmapIntro}>
            {t("mission.roadmap.intro")}
          </p>

          <ul className={cls.timelineList}>
            {roadmap.map((step, i) => (
              <li
                key={i}
                className={`${cls.timelineItem} ${
                  i % 2 === 0 ? cls.timelineLeft : cls.timelineRight
                }`}
              >
                <div className={cls.timelineIconWrapper}>
                  {getStepIcon(step.status, i)}
                </div>

                <div
                  className={`${cls.timelineCard} ${
                    i % 2 === 0
                      ? cls.timelineCardLeft
                      : cls.timelineCardRight
                  }`}
                >
                  <h3 className={cls.timelineStepTitle}>
                    Step {i + 1}
                  </h3>
                  <p className={cls.timelineStepText}>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
