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

import {
  OwnerVerificationStep1,
  OwnerVerificationStep2,
} from "./verification";
import type { ConfigurationReadDTO } from "./DataTransferObject/configuration-read.type";

/* ======================================================
   VIEW
====================================================== */
export function ProfileView({
  owner,
  reloadProfile,
  configuration,
}: {
  owner: OwnerDraftReadDTO | null;
  configuration: ConfigurationReadDTO | null;
  reloadProfile: () => Promise<void>;
}) {
  
  const [showVerification, setShowVerification] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

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
  const status = configuration?.status;

  const canStartVerification =
  status === "CONFIGURATION_IN_PROGRESS" ||
  status === "REJECTED";

/**
 * Step 2 DEVE essere possibile
 * finché la configuration NON è locked
 */
const canUploadBusinessDocs =
  status === "CONFIGURATION_IN_PROGRESS" ||
  status === "REJECTED";

  
  const isLocked =
    status === "CONFIGURATION_READY" ||
    status === "ACCEPTED";
  
  
  
  /* =====================
     RENDER
  ====================== */
  return (
    <section className={profileClasses.root}>
      {/* HEADER */}
      <header className={profileClasses.header}>
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </header>

      <div className={profileClasses.card}>
  <h3>Stato profilo</h3>

  <div className={profileClasses.row}>
    <span className={profileClasses.label}>
      Stato verifica
    </span>

    <span className={profileClasses.value}>
      {status === "CONFIGURATION_IN_PROGRESS" &&
        "Profilo da verificare"}

      {status === "BUSINESS_READY" &&
        "Carica visura camerale"}

      {status === "CONFIGURATION_READY" &&
        "Documenti in verifica"}

      {status === "ACCEPTED" && "Profilo verificato"}

      {status === "REJECTED" &&
        "Verifica respinta — ricarica documenti"}
    </span>
  </div>

  {canStartVerification && (
    <button
      className="wd-btn wd-btn--primary wd-btn--sm"
      onClick={() => {
        setStep(1);
        setShowVerification(true);
      }}
    >
      Avvia verifica
    </button>
  )}

  {status === "CONFIGURATION_READY" && (
    <p className={profileClasses.verifyHint}>
      Stiamo verificando i tuoi documenti.
    </p>
  )}
</div>


      {/* VERIFICATION FLOW */}
      {showVerification && !isLocked && (
  <div className={profileClasses.card}>
    {step === 1 && canStartVerification && (
      <OwnerVerificationStep1
        data={data}
        setField={setField}
        onComplete={async () => {
       
          setStep(2);
        }}
      />
    )}

{step === 2 &&
  canUploadBusinessDocs &&
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
