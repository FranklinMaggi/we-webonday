// ======================================================
// FE || USER DASHBOARD || YOU — VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro dashboard utente
// - Nessuna fetch
// - Nessuna mutazione
//
// INVARIANTI:
// - Usa solo ViewModel
// - Stato > Azione
//
// ======================================================

import { t } from "@src/shared/aiTranslateGenerator/translateFe/helper/i18n";
import { getWdStatusClass } from "@src/shared/utils/statusUi";
import type { YouDashboardVM } from "./You.container";
import { youClasses } from "./you.classes";

export function YouDashboardView({
  configurations,
  businesses,
  products,
  hasBusiness,
}: YouDashboardVM) {
  return (
    <section className={youClasses.root}>
      {/* ================= HEADER ================= */}
      <header className={youClasses.header}>
        <h1>{t("you.title")}</h1>
        <p>{t("you.subtitle")}</p>
      </header>

      {/* ================= CONFIGURATIONS ================= */}
      <section className={youClasses.section}>
        <h2>{t("you.configurations.title")}</h2>

        {configurations.length === 0 ? (
          <p>{t("you.configurations.empty")}</p>
        ) : (
          configurations.map((cfg) => (
            <div
              key={cfg.id}
              className={youClasses.card}
            >
              <header className={youClasses.cardHeader}>
                <h3>
                  {cfg.prefill?.businessName ??
                    t("you.configurations.default")}
                </h3>
                <span className={getWdStatusClass(cfg.status)}>
                  {cfg.status}
                </span>
              </header>

              <div className={youClasses.meta}>
                <span>
                  <strong>Solution:</strong> {cfg.solutionId}
                </span>
                <span>
                  <strong>Product:</strong> {cfg.productId}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ================= BUSINESS & PLANS ================= */}
      {hasBusiness && (
        <section className={youClasses.section}>
          <h2>{t("you.business.title")}</h2>

          {businesses.map((b) => (
            <div key={b.configurationId} className={youClasses.card}>
              <header className={youClasses.cardHeader}>
                <h3>{b.businessName}</h3>
                <span className={getWdStatusClass("ACTIVE")}>
                  ACTIVE
                </span>
              </header>

              <div className={youClasses.meta}>
                <strong>{t("you.business.plans")}</strong>

                <ul>
                  {products.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}
    </section>
  );
}
