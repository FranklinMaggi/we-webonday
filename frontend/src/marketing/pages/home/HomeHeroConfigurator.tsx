// ======================================================
// FE || marketing/pages/home/HomeHeroConfigurator.tsx
// ======================================================
//
// RUOLO:
// - Hero principale Home
// - Primo punto di ingresso del flusso
//
// INVARIANTI:
// - Nessuna auth
// - Nessuna creazione configuration
// - Solo raccolta intent
// ======================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "@src/user/editor/api/type/configurator/configurationSetup.store";
import { getLocalConsent } from "@shared/utils/cookieConsent";
import { t } from "@shared/aiTranslateGenerator";
import { homePageClasses as cls } from "./home.classes";
import { CookieBanner } from "@src/marketing/components/cookie/CookieBanner";
export default function HomeHeroConfigurator() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [businessName, setBusinessName] = useState("");
 /* ================= COOKIE ================= */
  const consent = getLocalConsent();
  const cookieAccepted = Boolean(consent);
  const [cookieIntent, setCookieIntent] = useState(false);
  const setField = useConfigurationSetupStore(
    (s) => s.setField
  );
  /* ================= ACTION ================= */
  function handleContinue() {
    if (!cookieAccepted) return;
    if (!businessName.trim()) return;
    setField("businessName", businessName.trim());
    navigate("/solution", {
      state: {
        businessName: businessName.trim(),
      },
    });
  }

  return (

    <>
    <section className={cls.section.hero}>
      <div className={`${cls.hero.content} hero-inner`}>

        {/* ================= TITLE ================= */}
        <h1 className={cls.hero.title}>
          {t("home.hero.configurator.title")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </h1>

        {/* ================= SUBTITLE ================= */}
        <p className={cls.hero.subtitle}>
          {t("home.hero.configurator.subtitle")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </p>

        {/* ================= FORM ================= */}
        <div className={cls.hero.form.wrapper}>
          <label className="wd-field">
            <span className="wd-field__label">
              {t("home.hero.configurator.label")}
            </span>

            <input
  className="wd-input wd-input--xl home-hero-input"
  placeholder={t("home.hero.configurator.placeholder")}
  value={businessName}
  onChange={(e) => setBusinessName(e.target.value)}
/>
          </label>

          {/* ================= HINT / CTA ================= */}
          <button
  className={cls.hero.form.cta}
  disabled={!businessName.trim()}
  onClick={() => {
    if (!cookieAccepted) {
      setCookieIntent(true);
      return;
    }
    handleContinue();
  }}
>
  {t("home.hero.configurator.cta")}
</button>
          
        </div>
      </div>
    </section>
   {cookieIntent && <CookieBanner />} </>
  );
}