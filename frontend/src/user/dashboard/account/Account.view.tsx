// ======================================================
// FE || USER DASHBOARD || ACCOUNT — VIEW
// ======================================================
//
// RUOLO:
// - Rendering dati tecnici account
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================

import { t } from "@shared/aiTranslateGenerator";
import { accountClasses } from "./account.classes";
import type { AccountVM } from "./Account.container";

interface Props {
  account: AccountVM | null;
}

export function AccountView({ account }: Props) {
  if (!account) {
    return (
      <section className={accountClasses.root}>
        <p>{t("account.not_logged")}</p>
      </section>
    );
  }

  return (
    <section className={accountClasses.root}>
      {/* ================= HEADER ================= */}
      <header className={accountClasses.header}>
        <h1>{t("account.title")}</h1>
        <p>{t("account.subtitle")}</p>
      </header>

      {/* ================= ACCOUNT CARD ================= */}
      <div className={accountClasses.card}>
        {/* EMAIL */}
        <div className={accountClasses.row}>
          <span className={accountClasses.label}>
            {t("account.email")}
          </span>
          <span>{account.email}</span>
        </div>

        {/* PROVIDER */}
        <div className={accountClasses.row}>
          <span className={accountClasses.label}>
            {t("account.provider")}
          </span>
          <span>{account.provider}</span>
        </div>

        {/* PRIVACY */}
        <div className={accountClasses.row}>
          <span className={accountClasses.label}>
            {t("account.privacy")}
          </span>
          <span>
            {account.privacyAccepted
              ? t("account.privacy.accepted")
              : t("account.privacy.missing")}
          </span>
        </div>
      </div>

      {/* ================= HINT ================= */}
      <p className={accountClasses.hint}>
        {t("account.security_hint")}
      </p>
    </section>
  );
}
