// ======================================================
// FE || USER DASHBOARD || ACCOUNT — VIEW
// ======================================================
//
// RUOLO:
// - Rendering dati tecnici account
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================

import { t } from "@src/shared/aiTranslateGenerator";

import { accountClasses } from "./account.classes";
import type {AccountVM} from "./Account.container"

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
        <header className={accountClasses.header}>
          <h1>{t("account.title")}</h1>
          <p>{t("account.subtitle")}</p>
        </header>
  
        <div className={accountClasses.row}>
  <span className={accountClasses.label}>
    {t("account.email.primary")}
  </span>
  <span>{account.email}</span>
</div>

<div className={accountClasses.row}>
  <span className={accountClasses.label}>
    {t("account.provider")}
  </span>
  <span>{account.provider}</span>
</div>

      </section>
    );
  }
  