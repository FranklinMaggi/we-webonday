// ======================================================
// FE || BusinessForm.tsx
// ======================================================
//
// RUOLO (CANONICAL):
// - Raccolta dati Business (FE only)
// - Applica seed da Solution (READ ONLY):
//   • descriptionTags
//   • serviceTags
//   • openingHoursDefault
//
// PRINCIPI:
// - Backend = source of truth per Solution
// - FE Store = source of truth per Business draft
//
// INVARIANTI:
// - ❌ Nessun fetch
// - ❌ Nessuna persistenza backend
// - ❌ Nessuna AI
// ======================================================

import { useEffect } from "react";
import type { OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
import { useAuthStore } from "@src/shared/lib/store/auth.store";
import { OpeningHoursDay } from "./OpeningHoursDay";
import { apiFetch } from "@src/shared/lib/api";
import { type SolutionSeed } from "@src/shared/domain/business/buseinssRead.types";
import { isOpeningHoursEmpty } from "@src/shared/domain/business/openingHours.utils";



type BusinessFormProps = {
  onComplete: () => void;
  solutionSeed: SolutionSeed | null;
};

/* ======================================================
   COSTANTI
====================================================== */
const DAYS = [
  ["monday", "Lunedì"],
  ["tuesday", "Martedì"],
  ["wednesday", "Mercoledì"],
  ["thursday", "Giovedì"],
  ["friday", "Venerdì"],
  ["saturday", "Sabato"],
  ["sunday", "Domenica"],
] as const;

/* ======================================================
   UTILS
====================================================== */
function toggleTag(list: string[] = [], tag: string): string[] {
  return list.includes(tag)
    ? list.filter((t) => t !== tag)
    : [...list, tag];
}

/* ======================================================
   COMPONENT
====================================================== */
// ======================================================
// FE || BusinessForm.tsx (BE-FIRST)
// ======================================================

export default function BusinessForm({
  onComplete,
  solutionSeed,
}: BusinessFormProps) {

  const { data, setField } = useConfigurationSetupStore();
  const user = useAuthStore((s) => s.user);

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
  ====================================================== */
  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email, data.email, setField]);

  /* ======================================================
     APPLY OPENING HOURS SEED (SAFE)
     - SOLO se store vuoto
     - NON distruttivo
  ====================================================== */
      useEffect(() => {
        if (
          solutionSeed?.openingHours &&
          isOpeningHoursEmpty(data.openingHours)
        ) {
          console.log(
            "[BUSINESS_FORM][OPENING_HOURS][PREFILL_FROM_SOLUTION]",
            solutionSeed.openingHours
          );
          setField("openingHours", solutionSeed.openingHours);
        }
      }, [solutionSeed, data.openingHours, setField]);
      
  useEffect(() => {
    console.log("[BUSINESS_FORM][STORE][PRIVACY_STATE]", data.privacy);
  }, [data.privacy]);


  function hasAtLeastOneOpeningRange(
    openingHours: OpeningHoursFE
  ): boolean {
    return Object.values(openingHours).some(
      (ranges) => ranges.length > 0
    );
  }
  /* ======================================================
     SUBMIT — UPSERT BUSINESS DRAFT (BE)
  ====================================================== */
  async function handleSubmit() {
    console.group("[BUSINESS_FORM][SUBMIT]");
  
    console.log("STORE SNAPSHOT", data);
    if (!hasAtLeastOneOpeningRange(data.openingHours)) {
      console.warn(
        "[BUSINESS_FORM][VALIDATION] openingHours empty",
        data.openingHours
      );
      alert("Inserisci almeno un orario di apertura");
      console.groupEnd();
      return;
    }
    /* =========================
       UI GUARDS (FE)
    ========================= */
    if (!data.businessName?.trim()) {
      console.warn("❌ businessName missing");
      alert("Inserisci il nome dell’attività");
      console.groupEnd();
      return;
    }
  
    if (!data.privacy?.accepted) {
      console.warn("❌ privacy not accepted", data.privacy);
      alert("Devi accettare il trattamento dei dati");
      console.groupEnd();
      return;
    }
  
    /* =========================
       MAP FE → BE (CRITICO)
    ========================= */
    const payload = {
      configurationId: data.configurationId,
  
      businessName: data.businessName,
      solutionId: data.solutionId,
      productId: data.productId,
  
      // ⬅️ NOME ATTESO DAL BE
     openingHours: data.openingHours,
  
      contact: {
        mail: data.email,
        phoneNumber: data.phone,
        address: {
          street: data.address,
          city: data.city,
          province: data.state,
          zip: data.zip,
        },
      },
  
      businessDescriptionTags: data.businessDescriptionTags,
      businessServiceTags: data.businessServiceTags,
  
      // ⬅️ REQUIRED DAL BE
      privacy: {
        accepted: data.privacy.accepted,
        acceptedAt: data.privacy.acceptedAt,
        policyVersion: data.privacy.policyVersion,
      },
    };
  
    console.log("PAYLOAD SENT TO BE", payload);
  
    /* =========================
       HARD VALIDATION LOG
    ========================= */
    if (!payload.openingHours) {
      console.error("❌ businessOpeningHour is undefined");
    }
  
    if (!payload.privacy) {
      console.error("❌ privacy is undefined");
    }
  
    try {
      const result = await apiFetch<{
        ok: true;
        businessDraftId: string;
      }>("/api/business/create-draft", {
        method: "POST",
        body: JSON.stringify(payload),
      });
  
      console.log("BE RESPONSE", result);
  
      if (!result?.businessDraftId) {
        throw new Error("BUSINESS_UPSERT_FAILED");
      }
  
      setField("businessDraftId", result.businessDraftId);
  
      console.groupEnd();
      onComplete();
    } catch (err) {
      console.error("[BUSINESS_FORM][ERROR]", err);
      alert("Errore nel salvataggio del business");
      console.groupEnd();
    }
  }
  

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step">
      <h2>Configuriamo il tuo business</h2>

      {/* ================= ANAGRAFICA ================= */}
      <input
        placeholder="Nome attività"
        value={data.businessName}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={data.email}
        disabled
      />

      <input
        placeholder="Telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

<label>
  <input
    type="checkbox"
    checked={data.privacy.accepted}
    onChange={(e) => {
      const accepted = e.target.checked;

      console.log("[BUSINESS_FORM][PRIVACY][TOGGLE]", {
        accepted,
        previous: data.privacy,
        next: {
          ...data.privacy,
          accepted,
          acceptedAt: accepted
            ? new Date().toISOString()
            : "",
          policyVersion: "v1",
        },
      });

      setField("privacy", {
        ...data.privacy,
        accepted,
        acceptedAt: accepted
          ? new Date().toISOString()
          : "",
        policyVersion: "v1",
      });
    }}
  />
  Accetto il trattamento dei dati personali
</label>

<p className="privacy-link">
  <a
    href="/privacy"
    target="_blank"

  >
    Leggi l’informativa privacy
  </a>
</p>

      {/* ================= INDIRIZZO ================= */}
      <input
        placeholder="Indirizzo"
        value={data.address ?? ""}
        onChange={(e) =>
          setField("address", e.target.value)
        }
      />

      <div className="address-grid">
        <input
          placeholder="Città"
          value={data.city ?? ""}
          onChange={(e) =>
            setField("city", e.target.value)
          }
        />
        <input
          placeholder="Provincia"
          value={data.state ?? ""}
          onChange={(e) =>
            setField("state", e.target.value)
          }
        />
        <input
          placeholder="CAP"
          value={data.zip ?? ""}
          onChange={(e) =>
            setField("zip", e.target.value)
          }
        />
      </div>

      {/* ================= TAG DESCRIZIONE ================= */}
      {solutionSeed?.descriptionTags.length ? (
        <>
          <h4>Descrizione attività</h4>
          <div className="tag-pills">
            {solutionSeed.descriptionTags.map((tag) => {
              const active =
                data.businessDescriptionTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  className={`pill ${active ? "active" : ""}`}
                  onClick={() =>
                    setField(
                      "businessDescriptionTags",
                      toggleTag(
                        data.businessDescriptionTags,
                        tag
                      )
                    )
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {/* ================= TAG SERVIZI ================= */}
      {solutionSeed?.serviceTags.length ? (
        <>
          <h4>Servizi offerti</h4>
          <div className="tag-pills">
            {solutionSeed.serviceTags.map((tag) => {
              const active =
                data.businessServiceTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  className={`pill ${active ? "active" : ""}`}
                  onClick={() =>
                    setField(
                      "businessServiceTags",
                      toggleTag(
                        data.businessServiceTags,
                        tag
                      )
                    )
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {/* ================= ORARI ================= */}
      <h3>Orari di apertura</h3>

      {DAYS.map(([dayKey, label]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={label}
          value={data.openingHours?.[dayKey]}
          onChange={(value) =>
            setField("openingHours", {
              ...(data.openingHours ?? {}),
              [dayKey]: value,
            })
          }
        />
      ))}

      <div className="actions">
        <button onClick={handleSubmit}>
          Continua
        </button>
      </div>
    </div>
  );
}

