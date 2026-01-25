// ======================================================
// FE || USER DASHBOARD || YOU — VIEW (FINAL)
// ======================================================

import { t } from "@src/shared/aiTranslateGenerator";
import { getWdStatusClass } from "@src/shared/utils/statusUi";
import type { YouDashboardVM } from "./You.container";
import { youClasses } from "./you.classes";
import { useNavigate } from "react-router-dom";

export function YouDashboardView({
  configurations,
  businesses,
}: YouDashboardVM) {
  const navigate = useNavigate();

  const totalConfigs = configurations.length;
  const activeBusinesses = businesses.length;

  return (
    <section className={youClasses.root}>
      {/* ================= HEADER ================= */}
      <header className={youClasses.header}>
        <h1>{t("you.title")}</h1>

        <p className={youClasses.subtitle}>
          Business attivi: {activeBusinesses} / {totalConfigs}
        </p>

        <button
          className="wd-btn wd-btn--secondary"
          onClick={() =>
            navigate("/user/dashboard/you/upgrade/")
          }
        >
          🚀 Upgrade Business
        </button>
      </header>

      {/* ================= BUSINESS LIST ================= */}
      <section className={youClasses.section}>
        <h2>I tuoi Business</h2>

        {businesses.length === 0 ? (
          <p>{t("you.business.empty")}</p>
        ) : (
          businesses.map((b) => (
            <div
              key={b.configurationId}
              className={youClasses.businessRow}
            >
              {/* ================= BUSINESS CARD ================= */}
              <div className={youClasses.card}>
                <header className={youClasses.cardHeader}>
                  <h3>{b.businessName}</h3>

                  <span className={getWdStatusClass(b.status)}>
                    {b.status === "ACTIVE"
                      ? "ATTIVO"
                      : b.status}
                  </span>
                </header>

                <div className={youClasses.meta}>
                  <strong>Stato</strong>
                  <p className={youClasses.planMuted}>
                    Business configurato
                  </p>
                </div>

                {/* ---------- CTA ---------- */}
                <div className={youClasses.cardActions}>
                  <button
                    className="wd-btn wd-btn--secondary"
                    onClick={() =>
                      navigate(
                        `/user/dashboard/you/upgrade/${b.configurationId}`
                      )
                    }
                  >
                    🚀 Upgrade Business
                  </button>
                </div>
              </div>

              {/* ================= BUSINESS PREVIEW ================= */}
              <aside className={youClasses.preview}>
                <h4 className={youClasses.previewTitle}>
                  Anteprima anagrafica
                </h4>

                <div className={youClasses.previewBlock}>
                  <strong>Indirizzo</strong>
                  <p>
                    {b.preview?.address?.street ?? "—"}
                  </p>
                  <p>
                    {b.preview?.address?.zip ?? ""}{" "}
                    {b.preview?.address?.city ?? ""}{" "}
                    {b.preview?.address?.province ?? ""}
                  </p>
                </div>

                <div className={youClasses.previewBlock}>
                  <strong>Contatti</strong>
                  <p>
                    📞 {b.preview?.phoneNumber ?? "—"}
                  </p>
                  <p>
                    ✉️ {b.preview?.mail ?? "—"}
                  </p>
                </div>

                <div className={youClasses.previewBlock}>
                  <strong>Orari</strong>

                  {b.preview?.openingHours ? (
                    Object.entries(
                      b.preview.openingHours
                    ).map(([day, slots]) => (
                      <p key={day}>
                        {day}:{" "}
                        {slots.length
                          ? slots
                              .map(
                                (s) =>
                                  `${s.from}–${s.to}`
                              )
                              .join(", ")
                          : "Chiuso"}
                      </p>
                    ))
                  ) : (
                    <p>Non disponibili</p>
                  )}
                </div>
              </aside>
            </div>
          ))
        )}
      </section>
    </section>
  );
}
