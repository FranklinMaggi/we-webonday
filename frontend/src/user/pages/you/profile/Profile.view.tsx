// ======================================================
// FE || USER DASHBOARD || PROFILE — VIEW
// ======================================================
//
// RUOLO:
// - Rendering PROFILO OWNER
// - READ ONLY
// ======================================================

import { useState } from "react";
import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "./profile.classes";

/* ======================================================
   UI ATOMS
====================================================== */

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`status-dot ${active ? "is-active" : "is-inactive"}`}
      aria-label={active ? "verificato" : "non verificato"}
    />
  );
}

/* ======================================================
   TYPES
====================================================== */

type OwnerProfileDTO = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;

  contact?: {
    secondaryMail?: string;
  };

  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  verified?: boolean;
  complete?: boolean;
  createdAt?: string;
};

interface Props {
  user: OwnerProfileDTO | null;
}

/* ======================================================
   VIEW
====================================================== */

export function ProfileView({ user }: Props) {
  // ✅ STATO LOCALE CORRETTO
  const [showVerification, setShowVerification] = useState(false);

  if (!user) {
    return (
      <section className={profileClasses.root}>
        <p>{t("profile.not_available")}</p>
      </section>
    );
  }

  return (
    <section className={profileClasses.root}>
      <header className={profileClasses.header}>
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </header>

      {/* ================= ANAGRAFICA ================= */}
      <div className={profileClasses.card}>
        <h3>{t("profile.section.identity")}</h3>

        {user.firstName && (
          <div className={profileClasses.row}>
            <span className={profileClasses.label}>
              {t("profile.firstName")}
            </span>
            <span>{user.firstName}</span>
          </div>
        )}

        {user.lastName && (
          <div className={profileClasses.row}>
            <span className={profileClasses.label}>
              {t("profile.lastName")}
            </span>
            <span>{user.lastName}</span>
          </div>
        )}

        {user.birthDate && (
          <div className={profileClasses.row}>
            <span className={profileClasses.label}>
              {t("profile.birthDate")}
            </span>
            <span>
              {new Date(user.birthDate).toLocaleDateString("it-IT")}
            </span>
          </div>
        )}
      </div>

      {/* ================= STATO PROFILO ================= */}
      <div className={profileClasses.card}>
        <h3>{t("profile.section.status")}</h3>

        {/* COMPLETE — SEMPRE TRUE (LOCK UI) */}
        <div className={profileClasses.row}>
          <span className={profileClasses.label}>
            {t("profile.status")}
          </span>
          <span className="status-complete">
            {t("profile.status.complete")}
          </span>
        </div>

        {/* VERIFIED */}
        <div className={profileClasses.row}>
          <span className={profileClasses.label}>
            {t("profile.verified")}
          </span>

          <span className="status-verified">
            <StatusDot active={!!user.verified} />
            {user.verified
              ? t("profile.verified.yes")
              : t("profile.verified.no")}
          </span>
        </div>

        {!user.verified && (
          <div className="profile-verify-cta">
            <button
              type="button"
              className="wd-btn wd-btn--secondary wd-btn--sm"
              onClick={() => setShowVerification(true)}
            >
              {t("profile.verify.cta")}
            </button>
          </div>
        )}
      </div>

      {/* ================= VERIFICA IDENTITÀ ================= */}
      {showVerification && (
        <div className={profileClasses.card}>
          <h3>{t("profile.verify.title")}</h3>
          <p className="profile-verify-hint">
            {t("profile.verify.subtitle")}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: handleSubmit (definiremo dopo)
            }}
            className="profile-verify-form"
          >
            <div className="form-grid">
              <label>
                {t("profile.firstName")}
                <input
                  type="text"
                  defaultValue={user.firstName}
                />
              </label>

              <label>
                {t("profile.lastName")}
                <input
                  type="text"
                  defaultValue={user.lastName}
                />
              </label>
            </div>

            <label>
              {t("profile.verify.idFront")}
              <input type="file" accept="image/*" />
            </label>

            <label>
              {t("profile.verify.idBack")}
              <input type="file" accept="image/*" />
            </label>

            <label>
              {t("profile.verify.vat")}
              <input type="text" />
            </label>

            <label>
              {t("profile.verify.chamber")}
              <input type="file" accept="application/pdf,image/*" />
            </label>

            <label>
              {t("profile.verify.pec")}
              <input type="email" />
            </label>

            <label>
              {t("profile.verify.address")}
              <input type="text" />
            </label>

            <div className="profile-verify-actions">
              <button
                type="button"
                className="wd-btn wd-btn--ghost"
                onClick={() => setShowVerification(false)}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="wd-btn wd-btn--primary"
              >
                {t("profile.verify.submit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
