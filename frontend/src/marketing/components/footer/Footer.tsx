// ======================================================
// FE || components/footer/Footer.tsx
// ======================================================
// FOOTER — GLOBAL (MARKETING / PRE-LOGIN)
//
// AI COMMENT (STRUTTURA):
// - Incapsulamento semantico del footer globale
// - Separazione: shell → layout → sections → items
// - Nessuna modifica UX o logica
// ======================================================

import { Link } from "react-router-dom";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { t } from "@shared/aiTranslateGenerator";
import { footerClasses as cls } from "./footer.classes";

export default function Footer() {
  const year = new Date().getFullYear();
  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);

  return (
    <footer className={cls.footerShell} role="contentinfo">
      <nav className={cls.footerLayout} aria-label="Footer navigation">
        {/* ================= POLICY ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.policy.title")}
          </h4>
          <Link className={cls.footerLink} to="/policy/cookies">
          {t("footer.policy.cookies")}
        </Link>
        <Link className={cls.footerLink} to="/policy/terms">
          {t("footer.policy.terms")}
        </Link>

        <Link className={cls.footerLink} to="/policy/privacy">
          {t("footer.policy.privacy")}
        </Link>

       
          </section>

        {/* ================= IDENTITY ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.about.title")}
          </h4>

          <Link className={cls.footerLink} to="/founder">
            {t("footer.about.founder")}
          </Link>

          <Link className={cls.footerLink} to="/mission">
            {t("footer.about.mission")}
          </Link>

          <Link className={cls.footerLink} to="/vision">
            {t("footer.about.vision")}
          </Link>
        </section>

        {/* ================= ACCESS ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.access.title")}
          </h4>

          {ready && user ? (
            <Link className={cls.footerLink} to="/user/dashboard">
              {t("footer.access.dashboard")}
            </Link>
          ) : (
            <>
              <Link className={cls.footerLink} to="/user/login">
                {t("footer.access.login")}
              </Link>

              <Link className={cls.footerLink} to="/solution">
                {t("footer.access.explore")}
              </Link>
            </>
          )}
        </section>
      </nav>

      {/* ================= META ================= */}
      <div className={cls.footerMeta}>
        © {year} WebOnDay — {t("footer.rights")}
      </div>
    </footer>
  );
}
