// ======================================================
// FE || PROFILE || OWNER VERIFICATION — STEP 1 (REVIEW)
// ======================================================
//
// OWNER È USER-SCOPED
// - I dati anagrafici appartengono all’utente
// - I documenti sono user-scoped
// - configurationId serve SOLO come ownership guard
// ======================================================

import { useState, useEffect, useRef } from "react";
import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "../profile.classes";
import { getPromptImageUrl } from "@shared/utils/assets";

import { useConfigurationSetupStore } from
  "@src/user/editor/api/type/configurator/configurationSetup.store";

import type { OwnerReadDTO } from
  "../DataTransferObject/owner.read.types";

import { createOwnerDraft } from "./OwnerDraftUpsert";
import { uploadOwnerDocument } from "./ownerDocuments.upload";
import { normalizeOwnerAddress } from "./adrress-normalizer";

/* ======================================================
   COMPONENT
====================================================== */
export function OwnerVerificationReview({
  owner,
  onComplete,
}: {
  owner: OwnerReadDTO;
  onComplete: () => Promise<void>;
}) {
  const { data, setField } = useConfigurationSetupStore((s) => ({
    data: s.data,
    setField: s.setField,
  }));

  /* =====================
     LOCAL STATE
  ====================== */
  const [selectedFiles, setSelectedFiles] = useState<{
    front?: File;
    back?: File;
  }>({});

  const [previews, setPreviews] = useState<{
    front?: string;
    back?: string;
  }>({});

  const hasPrefilledRef = useRef(false);

  /* =====================
     PREFILL OWNER DATA
  ====================== */
  useEffect(() => {
    if (hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    setField("ownerFirstName", owner.firstName ?? "");
    setField("ownerLastName", owner.lastName ?? "");
    setField("ownerBirthDate", owner.birthDate ?? "");

    setField(
      "ownerSecondaryMail",
      owner.contact?.mail ?? ""
    );
    setField(
      "ownerPhone",
      owner.contact?.phoneNumber ?? ""
    );

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
     SUBMIT
  ====================== */
  async function handleSubmit() {
    /* --- privacy --- */
    if (!data.ownerPrivacy.accepted) {
      alert("Devi accettare la privacy");
      return;
    }

    /* --- documents --- */
    if (!selectedFiles.front || !selectedFiles.back) {
      alert("Carica fronte e retro del documento");
      return;
    }

    /* --- configuration guard --- */
    const configurationId = data.configurationId;
    if (!configurationId) {
      alert("Configuration mancante");
      return;
    }

    /* =====================
       1️⃣ UPSERT OWNER (USER)
    ====================== */
    await createOwnerDraft({
      firstName: data.ownerFirstName.trim(),
      lastName: data.ownerLastName.trim(),
      birthDate: data.ownerBirthDate || undefined,
      address: normalizeOwnerAddress(data.ownerAddress),
      contact: {
        secondaryMail: data.ownerSecondaryMail || undefined,
        phoneNumber: data.ownerPhone || undefined,
      },
    });

    /* =====================
       2️⃣ UPLOAD DOCUMENTS
       (configurationId = guard)
    ====================== */
    await uploadOwnerDocument(
      configurationId,
      "front",
      selectedFiles.front
    );

    await uploadOwnerDocument(
      configurationId,
      "back",
      selectedFiles.back
    );

    setField("ownerStepCompleted", true);
    await onComplete();
  }

  /* =====================
     FILE SELECT
  ====================== */
  function handleSelect(
    side: "front" | "back",
    file?: File
  ) {
    if (!file) return;

    setSelectedFiles((s) => ({
      ...s,
      [side]: file,
    }));

    setPreviews((p) => ({
      ...p,
      [side]: URL.createObjectURL(file),
    }));
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <>
      {/* ================= FORM ================= */}
      <div className={profileClasses.formGrid}>
        <Input
          label={t("profile.firstName")}
          value={data.ownerFirstName}
          onChange={(v) =>
            setField("ownerFirstName", v)
          }
        />
        <Input
          label={t("profile.lastName")}
          value={data.ownerLastName}
          onChange={(v) =>
            setField("ownerLastName", v)
          }
        />
        <Input
          type="date"
          label={t("profile.birthDate")}
          value={data.ownerBirthDate ?? ""}
          onChange={(v) =>
            setField("ownerBirthDate", v)
          }
        />
      </div>

      {/* ================= UPLOAD ================= */}
      <div className={profileClasses.uploadGrid}>
        {(["front", "back"] as const).map(
          (side) => (
            <label
              key={side}
              className={profileClasses.uploadBox}
            >
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleSelect(
                    side,
                    e.target.files?.[0]
                  )
                }
              />
              <img
                src={
                  previews[side] ??
                  getPromptImageUrl(
                    side === "front"
                      ? "document-front"
                      : "document-back"
                  )
                }
                className={
                  profileClasses.uploadImage
                }
              />
              <span>
                Documento ({side})
              </span>
            </label>
          )
        )}
      </div>

      {/* ================= PRIVACY ================= */}
      <label className={profileClasses.privacyHint}>
        <input
          type="checkbox"
          checked={data.ownerPrivacy.accepted}
          onChange={(e) =>
            setField("ownerPrivacy", {
              accepted: e.target.checked,
              acceptedAt: e.target.checked
                ? new Date().toISOString()
                : "",
              policyVersion: "v1",
            })
          }
        />
        {t("profile.privacy.accepted")}
      </label>

      {/* ================= ACTIONS ================= */}
      <div className={profileClasses.verifyActions}>
        <button
          className="wd-btn wd-btn--primary"
          onClick={handleSubmit}
        >
          {t("profile.verify.next")}
        </button>
      </div>
    </>
  );
}

/* =====================
   INPUT
===================== */
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className={profileClasses.formRow}>
      <label
        className={profileClasses.formLabel}
      >
        {label}
      </label>
      <input
        className={profileClasses.formInput}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}
