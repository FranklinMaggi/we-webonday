// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP — BUSINESS SETUP (SPORCO MA FUNZIONALE)
//
// RUOLO:
// - Raccolta completa dei dati del business
// - FE + BE (volutamente accoppiato)
// - Punto unico di verità per:
//   • anagrafica
//   • tag
//   • orari
//   • creazione business
//   • sync configuration
//
// INVARIANTI (ACCETTATI):
// - Usa Zustand come source of truth
// - Fa fetch e persistenza
// - È wizard-aware
//
// ======================================================

import { useEffect } from "react";

import { useConfigurationSetupStore } from "../../lib/store/configurationSetup.store";
import { useAuthStore } from "../../lib/store/auth.store";

import { createBusiness } from "../../lib/userApi/business.user.api";
import { upsertConfigurationFromBusiness } from "../../lib/userApi/configuration.user.api";

import { OpeningHoursDay } from "../openingHours/OpeningHoursDay";

/* =========================
   COSTANTI
========================= */
const DAYS = [
  ["monday", "Lunedì"],
  ["tuesday", "Martedì"],
  ["wednesday", "Mercoledì"],
  ["thursday", "Giovedì"],
  ["friday", "Venerdì"],
  ["saturday", "Sabato"],
  ["sunday", "Domenica"],
] as const;

/* =========================
   UTILS
========================= */
function toggleTag(current: string[] = [], tag: string): string[] {
  return current.includes(tag)
    ? current.filter((t) => t !== tag)
    : [...current, tag];
}

/* =========================
   PROPS
========================= */
type StepBusinessInfoProps = {
  onComplete: () => void;
};

export default function StepBusinessInfo({
  onComplete,
}: StepBusinessInfoProps) {
  /* =========================
     STORE + AUTH
  ========================= */
  const {
    data,
    setField,
    businessId,
    setBusinessId,
  } = useConfigurationSetupStore();
 
 
  const safeOpeningHoursDefault =
  data.solutionOpeningHoursDefault &&
  typeof data.solutionOpeningHoursDefault === "object"
    ? data.solutionOpeningHoursDefault
    : undefined;
  const user = useAuthStore((s) => s.user);

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
  ====================================================== */
  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email]);

  /* ======================================================
     PREFILL OPENING HOURS (SOLUTION → STORE)
  ====================================================== */
  useEffect(() => {
    // se l’utente ha già toccato gli orari → STOP
    if (data.openingHours && Object.keys(data.openingHours).length > 0) {
      return;
    }
  
    // se non esistono default → STOP
    if (!safeOpeningHoursDefault) {
      return;
    }
  
    // PREFILL FE-ONLY
    setField("openingHours", safeOpeningHoursDefault);
  }, [safeOpeningHoursDefault]);
  
  /* =========================
     SUBMIT HANDLER
  ========================= */
  async function handleSubmit() {
    if (!data.businessName) {
      alert("Inserisci il nome dell’attività");
      return;
    }

    if (!data.solutionId || !data.productId) {
      alert("Configurazione commerciale mancante");
      return;
    }

    if (!businessId) {
      const res = await createBusiness({
        name: data.businessName,
        address: [
          data.address,
          data.city,
          data.state,
          data.zip,
        ]
          .filter(Boolean)
          .join(", "),
        phone: data.phone,
        openingHours: data.openingHours,

        solutionId: data.solutionId,
        productId: data.productId,
        optionIds: data.optionIds ?? [],
      });

      if (!res?.ok) {
        alert("Errore creazione attività");
        return;
      }

      setBusinessId(res.businessId);

      await upsertConfigurationFromBusiness({
        businessId: res.businessId,
        productId: data.productId,
        optionIds: data.optionIds ?? [],
        businessDescriptionTags:
          data.businessDescriptionTags ?? [],
        businessServiceTags:
          data.businessServiceTags ?? [],
      });
    }

    onComplete();
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="step">
      <h2>Configuriamo il tuo business</h2>

      {/* ================= ANAGRAFICA ================= */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={data.email ?? ""}
        disabled
      />

      <input
        placeholder="Numero di telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

      <label>
        <input
          type="checkbox"
          checked={data.privacyAccepted ?? false}
          onChange={(e) =>
            setField("privacyAccepted", e.target.checked)
          }
        />
        Accetto il trattamento dei dati personali
      </label>

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

      {/* ================= TAG DESCRITTIVI ================= */}
      {(data.solutionDescriptionTags?.length ?? 0) > 0 && (
        <>
          <h4>Descrizione attività</h4>
          <div className="tag-pills">
            {data.solutionDescriptionTags!.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`pill ${
                  data.businessDescriptionTags?.includes(tag)
                    ? "active"
                    : ""
                }`}
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
            ))}
          </div>
        </>
      )}

      {/* ================= TAG SERVIZI ================= */}
      {(data.solutionServiceTags?.length ?? 0) > 0 && (
        <>
          <h4>Servizi offerti</h4>
          <div className="tag-pills">
            {data.solutionServiceTags!.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`pill ${
                  data.businessServiceTags?.includes(tag)
                    ? "active"
                    : ""
                }`}
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
            ))}
          </div>
        </>
      )}

      {/* ================= ORARI ================= */}
      <h3>Orari di apertura</h3>
      {DAYS.map(([dayKey, label]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={label}
          value={data.openingHours?.[dayKey] ?? ""}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      {/* ================= AZIONE ================= */}
      <div className="actions">
        <button onClick={handleSubmit}>
          Continua
        </button>
      </div>
    </div>
  );
}
