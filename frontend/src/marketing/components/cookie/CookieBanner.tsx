// ======================================================
// FE || marketing/components/cookie/CookieBanner.tsx
// ======================================================
//
// RUOLO:
// - Raccogliere consenso cookie lato FE
// - Permettere scelta granulare GDPR-driven
// - Sbloccare il flusso HomeHero
//
// INVARIANTI:
// - NON usa userId
// - NON crea visitor
// - SINCRONIZZA con backend
// ======================================================

import { useEffect, useState } from "react";
import { cookiesClasses as cls } from "./cookies.classes";
import { t } from "@shared/aiTranslateGenerator";
import {
  getLocalConsent,
  saveLocalConsent,
} from "@shared/utils/cookieConsent";
import { acceptCookies } from "@shared/lib/api";
import { PolicyView } from "../policy/PolicyViewer";




type CookieCategory = "preferences" | "analytics" | "marketing";

export function CookieBanner() {
  /* ================= STATE ================= */
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [categories, setCategories] = useState({
    necessary: true, // GDPR: sempre true
    preferences: false,
    analytics: false,
    marketing: false,
  });

  /* ================= INIT ================= */
  useEffect(() => {
    if (!getLocalConsent()) setVisible(true);
  }, []);

  /* ================= TOGGLE ================= */
  function toggleCategory(key: CookieCategory) {
    setCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  /* ================= BACKEND SYNC ================= */
  async function syncBackend(
    analytics: boolean,
    marketing: boolean
  ) {
    try {
      setLoading(true);
      await acceptCookies(analytics, marketing);
    } catch (err) {
      console.warn("[CookieBanner] sync failed", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= HANDLERS ================= */

  // Accetta TUTTO
  async function handleAcceptAll() {
    const all = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };

    setCategories(all);

    saveLocalConsent({
      analytics: true,
      marketing: true,
    });

    await syncBackend(true, true);
    setVisible(false);
  }

  // Salva solo le preferenze scelte
  async function handleSavePreferences() {
    saveLocalConsent({
      analytics: categories.analytics,
      marketing: categories.marketing,
    });

    await syncBackend(
      categories.analytics,
      categories.marketing
    );

    setVisible(false);
  }

  // Solo necessari (rifiuta tutto il resto)
  async function handleRejectAll() {
    setCategories({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    });

    saveLocalConsent({
      analytics: false,
      marketing: false,
    });

    await syncBackend(false, false);
    setVisible(false);
  }

  if (!visible) return null;

  /* ================= RENDER ================= */
  return (
    <div className={cls.banner}>
      <div className={cls.content}>
  
        {/* TEXT */}
        <div className={cls.text.wrapper}>
          <strong className={cls.text.title}>
            {t("cookie.banner.title")}
          </strong>
          <p className={cls.text.description}>
            {t("cookie.banner.text")}
          </p>
        </div>
  
        <div className={cls.options.wrapper}>

  {/* NECESSARY */}
  <label className={`${cls.options.option} ${cls.options.locked}`}>
    <input type="checkbox" checked disabled className={cls.options.checkbox} />
    <span className={cls.options.label}>
      {t("cookie.banner.necessary")}
    </span>
  </label>

  {/* TOGGLE COOKIE POLICY */}
  <button
    type="button"
    className={cls.text.link}
    onClick={() => setShowPolicy(v => !v)}
  >
    {t("cookie.banner.link")}
  </button>

  {/* POLICY PREVIEW */}
  {showPolicy && (
  <div className={cls.policyPreview}>
    <PolicyView type="cookie" scope="general" />
  </div>

  )}

  {/* PREFERENCES */}
  <label className={cls.options.option}>
    <input
      type="checkbox"
      checked={categories.preferences}
      onChange={() => toggleCategory("preferences")}
      className={cls.options.checkbox}
    />
    <span className={cls.options.label}>
      {t("cookie.banner.preferences")}
    </span>
  </label>

  {/* ANALYTICS */}
  <label className={cls.options.option}>
    <input
      type="checkbox"
      checked={categories.analytics}
      onChange={() => toggleCategory("analytics")}
      className={cls.options.checkbox}
    />
    <span className={cls.options.label}>
      {t("cookie.banner.analytics")}
    </span>
  </label>

  {/* MARKETING */}
  <label className={cls.options.option}>
    <input
      type="checkbox"
      checked={categories.marketing}
      onChange={() => toggleCategory("marketing")}
      className={cls.options.checkbox}
    />
    <span className={cls.options.label}>
      {t("cookie.banner.marketing")}
    </span>
  </label>

</div>
        {/* ACTIONS */}
        <div className={cls.actions.wrapper}>
          <button
            disabled={loading}
            className={`${cls.actions.button} ${cls.actions.secondary}`}
            onClick={handleRejectAll}
          >
            {t("cookie.banner.reject")}
          </button>
  
          <button
            disabled={loading}
            className={`${cls.actions.button} ${cls.actions.secondary}`}
            onClick={handleSavePreferences}
          >
            {t("cookie.banner.save")}
          </button>
  
          <button
            disabled={loading}
            className={`${cls.actions.button} ${cls.actions.primary}`}
            onClick={handleAcceptAll}
          >
            {t("cookie.banner.accept")}
          </button>
        </div>
      </div>
      
    </div>
  );
}