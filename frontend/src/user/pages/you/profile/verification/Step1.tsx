// ======================================================
// FE || PROFILE || VERIFICATION || STEP 1 — OWNER DATA + DOCS
// ======================================================
//
// RUOLO:
// - Compilazione dati anagrafici Owner
// - Upload documenti (fronte / retro)
// - Creazione OwnerDraft
// - Avvio verifica
//
// DOMINIO:
// - ConfigurationSetupDTO (CHIUSO)
// ======================================================

import type { ConfigurationSetupDTO } from
  "@src/shared/domain/user/configurator/configurationSetup.types";

import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "../profile.classes";
import { useState } from "react";
import { createOwnerDraft } from "./owner-draft.functions";

import { uploadOwnerDocument } from "./owner-upload.functions";
import { normalizeOwnerAddress } from "./adrress-normalizer";
import type { ConfigurationSetField } from "./types";
import { getPromptImageUrl } from "@shared/utils/assets";



/* =====================
   PROPS
===================== */
interface Props {
  data: ConfigurationSetupDTO;
  setField: ConfigurationSetField;
  onComplete: () => Promise<void>;
}

/* ======================================================
   COMPONENT
====================================================== */
export function OwnerVerificationStep1({
  data,
  setField,
  onComplete,
}: Props) {
    
    const [uploads,setUploads] = useState<{
        front: boolean;
        back: boolean;
      }>({
        front: false,
        back: false,
      });

      const [selectedFiles, setSelectedFiles] = useState<{
        front?: File;
        back?: File;
      }>({});


      const [previews, setPreviews] = useState<{
        front?: string;
        back?: string;
      }>({});
      
  /* =====================
     SUBMIT
  ====================== */
  async function handleSubmit() {
    if (!data.ownerPrivacy.accepted) {
      alert("Devi accettare la privacy");
      return;
    }
  
    if (!data.configurationId) {
      alert("Configuration mancante");
      return;
    }
  
    if (!selectedFiles.front || !selectedFiles.back) {
      alert("Carica fronte e retro del documento");
      return;
    }
  
    const configurationId = data.configurationId;
  
    await createOwnerDraft({
      configurationId,
      firstName: data.ownerFirstName.trim(),
      lastName: data.ownerLastName.trim(),
      birthDate: data.ownerBirthDate || undefined,
      address: normalizeOwnerAddress(data.ownerAddress),
      contact: {
        secondaryMail: data.ownerSecondaryMail || undefined,
        phoneNumber: data.ownerPhone || undefined,
      },
      privacy: {
        accepted: true,
        acceptedAt: new Date().toISOString(),
        policyVersion: "v1",
        subject: "owner",
        source: "owner-form",
      },
    });
  
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
  
    // ⬅️ SOLO passaggio allo step 2
    await onComplete();
  // ✅ SEGNA STEP 1 COMPLETATO (FE ONLY)
    setField("ownerStepCompleted", true);
  }
  

  function handleSelect(
  side: "front" | "back",
  file?: File
) {
    
  if (!file) return;

  // preview immediata
  const previewUrl = URL.createObjectURL(file);
  setPreviews((p) => ({ ...p, [side]: previewUrl }));

  // memorizzo il File per il click su "Continua"
  setSelectedFiles((s) => ({ ...s, [side]: file }));

  // opzionale: reset check verde finché non fai upload reale
  setUploads((u) => ({ ...u, [side]: false }));
}

  /* =====================
     UPLOAD HANDLER
  ====================== 
  async function handleUpload(
    side: "front" | "back",
    file?: File
  ) {
    
    if (!file || !data.configurationId) return;

    // 🔍 ANTEPRIMA FE
  const previewUrl = URL.createObjectURL(file);
  setPreviews((p) => ({ ...p, [side]: previewUrl }));

  // ⬆️ UPLOAD BACKEND
  await uploadOwnerDocument(
    data.configurationId,
    side,
    file
  );

  // ✔ STATO UI
  setUploads((u) => ({ ...u, [side]: true }));
}
*/
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
          onChange={(v) => setField("ownerFirstName", v)}
        />

        <Input
          label={t("profile.lastName")}
          value={data.ownerLastName}
          onChange={(v) => setField("ownerLastName", v)}
        />

        <Input
          type="date"
          label={t("profile.birthDate")}
          value={data.ownerBirthDate ?? ""}
          onChange={(v) => setField("ownerBirthDate", v)}
        />

        <Input
          type="email"
          label={t("profile.secondaryMail")}
          value={data.ownerSecondaryMail ?? ""}
          onChange={(v) => setField("ownerSecondaryMail", v)}
        />

        <Input
          label="Telefono"
          value={data.ownerPhone ?? ""}
          onChange={(v) => setField("ownerPhone", v)}
        />

        <Input
          label="Via"
          value={data.ownerAddress?.street ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              street: v,
            })
          }
        />

        <Input
          label="Numero civico"
          value={data.ownerAddress?.number ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              number: v,
            })
          }
        />

        <Input
          label="Città"
          value={data.ownerAddress?.city ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              city: v,
            })
          }
        />

        <Input
          label="Provincia"
          value={data.ownerAddress?.province ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              province: v,
            })
          }
        />

        <Input
          label="CAP"
          value={data.ownerAddress?.zip ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              zip: v,
            })
          }
        />
      </div>

    
      {/* ============ UPLOAD DOCUMENTI OWNER ============ */}
      <div className={profileClasses.uploadGrid}>
        {/* FRONTE */}
        <label
          className={`${profileClasses.uploadBox} ${
            
            uploads.front ? profileClasses.stepCompleted : ""
          }`}
        >
          <input
            type="file"
            hidden
            accept="image/*,.pdf"
            onChange={(e) =>
              handleSelect("front", e.target.files?.[0])
            }
          />
          <img
            src={ previews.front ??getPromptImageUrl("document-front")}
            className={profileClasses.uploadImage}
          />
          <span>
            Documento (fronte)
            {uploads.front && " ✔"}
          </span>
        </label>

        {/* RETRO */}
        <label
          className={`${profileClasses.uploadBox} ${
            uploads.back ? profileClasses.stepCompleted : ""
          }`}
        >
          <input
            type="file"
            hidden
            accept="image/*,.pdf"
            onChange={(e) =>
              handleSelect("back", e.target.files?.[0])
            }
          />
          <img
            src={ previews.back ??getPromptImageUrl("document-back")}
            className={profileClasses.uploadImage}
          />
          <span>
            Documento (retro)
            {uploads.back && " ✔"}
          </span>
        </label>
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

/* ======================================================
   INPUT HELPER (identico a Profile.view)
====================================================== */
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
      <label className={profileClasses.formLabel}>
        {label}
      </label>
      <input
        className={profileClasses.formInput}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
