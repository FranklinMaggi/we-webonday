// ======================================================
// FE || USER DASHBOARD || PROFILE VIEW
// ======================================================
//
// COSA FA:
// - mostra stato profilo e verifica utente
//
// COSA NON FA:
// - non carica dati
// - non chiama API
// ======================================================
import { useEffect, useState } from "react";
import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "./profile.classes";
import type { OwnerDraftReadDTO } from
  "@src/user/dashboard/you/profile/DataTransferObject/owner.read.types";
import { useConfigurationSetupStore } from
  "@src/shared/domain/user/configurator/configurationSetup.store";
  import { useOwnerVerificationStatus } from
  "@src/user/dashboard/sidebar/api/owner/verify/read-owner-verification";
import {
  OwnerVerificationStep1,
  OwnerVerificationStep2,
} from "./verification";

/* ======================================================
   VIEW
====================================================== */
export function ProfileView({
  owner,
  reloadProfile,
}: {
  owner: OwnerDraftReadDTO | null;
  reloadProfile: () => Promise<void>;
})
{
  
  const [showVerification, setShowVerification] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { verification, canStartVerification } =
  useOwnerVerificationStatus();
  /* =====================
     STORE (OWNER DRAFT)
  ====================== */
  const { data, setField } = useConfigurationSetupStore();

  useEffect(() => {
    if (!owner) return;
  
    setField("ownerFirstName", owner.firstName ?? "");
    setField("ownerLastName", owner.lastName ?? "");
    setField("ownerBirthDate", owner.birthDate ?? "");
    setField(
      "ownerSecondaryMail",
      owner.contact?.secondaryMail ?? ""
    );
    setField("ownerPhone", owner.contact?.phoneNumber ?? "");
  
    if (owner.address) {
      setField("ownerAddress", {
        street: owner.address.street ?? "",
        number: owner.address.number ?? "",
        city: owner.address.city ?? "",
        province: owner.address.province ?? "",
        region: owner.address.region ?? "",
        zip: owner.address.zip ?? "",
        country: owner.address.country ?? "Italia",
      });
    }
  }, [owner, setField]);
  /* =====================
     HARD GUARD
  ====================== */
  if (!owner) {
    return (
      <section className={profileClasses.root}>
        <p>{t("profile.not_available")}</p>
      </section>
    );
  }

/* =====================
     RENDER
  ====================== */
  return (
    <section className={profileClasses.root}>
      {/* ================= HEADER ================= */}
      <header className={profileClasses.header}>
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </header>
  
      {/* ================= STATUS CARD ================= */}
      <div className={profileClasses.card}>
        <h3>{t("profile.status.title")}</h3>
  
        <div className={profileClasses.row}>
          <span className={profileClasses.label}>
            {t("profile.status.label")}
          </span>
  
          <span className={profileClasses.value}>
            {verification === "PENDING" &&
              t("profile.status.pending")}
            {verification === "ACCEPTED" &&
              t("profile.status.accepted")}
            {verification === "REJECTED" &&
              t("profile.status.rejected")}
          </span>
        </div>
  
        {/* CTA */}
        {canStartVerification && (
          <button
            className="wd-btn wd-btn--primary wd-btn--sm"
            onClick={() => {
              setStep(1);
              setShowVerification(true);
            }}
          >
            {t("profile.verify.start")}
          </button>
        )}
      </div>
  
      {/* ================= VERIFICATION FLOW ================= */}
      {showVerification && verification !== "ACCEPTED" && (
        <div className={profileClasses.card}>
          {/* STEP 1 — OWNER DATA */}
          {step === 1 && canStartVerification && (
            <OwnerVerificationStep1
              data={data}
              setField={setField}
              onComplete={async () => {
                setStep(2);
              }}
            />
          )}
  
          {/* STEP 2 — DOCUMENTI BUSINESS (temporaneamente qui) */}
          {step === 2 &&
            data.configurationId &&
            data.ownerStepCompleted && (
              <OwnerVerificationStep2
                configurationId={data.configurationId}
                onCompleted={reloadProfile}
              />
            )}
        </div>
      )}
    </section>
  );
}  