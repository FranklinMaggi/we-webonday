// ======================================================
// FE || USER DASHBOARD || YOU — VIEW (FINAL)
// ======================================================
//
// RUOLO:
// - Dashboard di orientamento Business
// - Stato business + CTA di upgrade
//
// INVARIANTI:
// - SOLO lettura
// - Niente configurazione
// - Niente checkout
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
    navigate(`/user/dashboard/you/upgrade/${b.configurationId}`)
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
              className={youClasses.card}
            >
              {/* ---------- HEADER CARD ---------- */}
              <header className={youClasses.cardHeader}>
                <h3>{b.businessName}</h3>

                <span className={getWdStatusClass(b.status)}>
                  {b.status === "ACTIVE"
                    ? "COMPLETATO"
                    : b.status}
                </span>
              </header>

              {/* ---------- META ---------- */}
              <div className={youClasses.meta}>
                <strong>Piano attuale</strong>
                <p className={youClasses.planMuted}>
                  {b.activePlan?.name ??
                    "Iscrizione gratuita"}
                </p>
              </div>

              {/* ---------- OPTIONS (READ ONLY) ---------- */}
              {b.activePlan?.options?.length ? (
                <ul className="you-plan-options">
                  {b.activePlan.options.map((o) => (
                    <li
                      key={o.id}
                      className="you-plan-option"
                    >
                      <strong>
                        {o.label}
                      </strong>

                      {o.description && (
                        <p className="you-plan-option__description">
                          {o.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={youClasses.optionsHint}>
                  Funzionalità base attive
                </p>
              )}

              {/* ---------- CTA ---------- */}
              <div className={youClasses.cardActions}>
              <button
  className="wd-btn wd-btn--secondary"
  onClick={() =>
    navigate(`/user/dashboard/you/upgrade/${b.configurationId}`)
  }
>
  🚀 Upgrade Business
</button>

              </div>
            </div>
          ))
        )}
      </section>
    </section>
  );
}
