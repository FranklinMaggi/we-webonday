// ======================================================
// FE || USER DASHBOARD || VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro Dashboard
// - Nessuna logica di fetch
// - Usa solo ViewModel
// - i18n tramite chiavi
//
// ======================================================

import { getWdStatusClass } from "@shared/utils/statusUi";
import { t } from "@shared/aiTranslateGenerator/translateFe/helper/i18n";
import type { DashboardVM } from "./Dashboard.container";
import { dashboardClasses } from "./dashboard.classes";

export function DashboardView({
  configs,
  loading,
  error,
  onOpenConfig,
}: DashboardVM) {
  if (loading) {
    return <p>{t("dashboard.loading")}</p>;
  }

  if (error) {
    return (
      <p className={dashboardClasses.error}>
        {t(error)}
      </p>
    );
  }

  return (
    <section className={dashboardClasses.root}>
      <header className={dashboardClasses.header}>
        <h1>{t("dashboard.title")}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </header>

      <section className={dashboardClasses.list}>
        {configs.length === 0 ? (
          <div className={dashboardClasses.empty}>
            <h2>{t("dashboard.empty.title")}</h2>
            <p>{t("dashboard.empty.text")}</p>

            <button
              className={dashboardClasses.cta}
              onClick={() => onOpenConfig("new")}
            >
              {t("dashboard.cta.start")}
            </button>
          </div>
        ) : (
          configs.map((cfg) => (
            <div
              key={cfg.id}
              className={dashboardClasses.card}
              onClick={() => onOpenConfig(cfg.id)}
              role="button"
              tabIndex={0}
            >
              <div className={dashboardClasses.cardHeader}>
                <h2>
                  {cfg.prefill?.businessName ??
                    t("dashboard.config.default")}
                </h2>

                <span
                  className={getWdStatusClass(cfg.status)}
                >
                  {cfg.status}
                </span>
              </div>

              <div className={dashboardClasses.meta}>
                <span>
                  <strong>Solution:</strong>{" "}
                  {cfg.solutionId}
                </span>
                <span>
                  <strong>Product:</strong>{" "}
                  {cfg.productId}
                </span>
              </div>

              <div
                className={dashboardClasses.divider}
              />
            </div>
          ))
        )}
      </section>
    </section>
  );
}
