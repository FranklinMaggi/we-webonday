// ======================================================
// FE || StepBusinessInfo.tsx
// ======================================================
// STEP: BUSINESS SETUP
// Source of truth: Zustand
// ======================================================

import { useEffect } from "react";

import { useConfigurationSetupStore } from "../../pages/user/dashboard/configurator/store/configurationSetup.store";
import { useAuthStore } from "../../lib/store/auth.store";

import { createBusiness } from "../buyflow/api/business/business.user.api";
import { upsertConfigurationFromBusiness } from "../../pages/user/dashboard/configurator/api/configuration.user.api";

import { OpeningHoursDay } from "./openingHours/OpeningHoursDay";

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
   PROPS
====================================================== */
type StepBusinessInfoProps = {
  onComplete: () => void;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function StepBusinessInfo({
  onComplete,
}: StepBusinessInfoProps) {
  /* =========================
     STORE
  ========================= */
  const {
    data,
    setField,
    businessId,
    setBusinessId,
  } = useConfigurationSetupStore();

  const user = useAuthStore((s) => s.user);

  /* ======================================================
     SAFE DERIVATIONS (NO TS ERRORS)
  ====================================================== */
  const descriptionTags: string[] =
    data.solutionDescriptionTags ?? [];

  const serviceTags: string[] =
    data.solutionServiceTags ?? [];

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
  ====================================================== */
  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email, data.email, setField]);

  /* ======================================================
     PREFILL OPENING HOURS
     source: solutionOpeningHoursDefault (KV → store)
     rules:
     - una sola volta
     - solo se l’utente non ha già scritto
  ====================================================== */
  useEffect(() => {
    if (
      data.openingHours &&
      Object.keys(data.openingHours).length > 0
    ) {
      return;
    }

    if (!data.solutionOpeningHoursDefault) {
      return;
    }

    setField(
      "openingHours",
      data.solutionOpeningHoursDefault
    );
  }, [
    data.openingHours,
    data.solutionOpeningHoursDefault,
    setField,
  ]);

  /* ======================================================
     SUBMIT
  ====================================================== */
  async function handleSubmit() {
    if (!data.businessName) {
      alert("Inserisci il nome dell’attività");
      return;
    }

    if (!data.solutionId || !data.productId) {
      alert("Configurazione commerciale mancante");
      return;
    }

    // CREA BUSINESS (solo la prima volta)
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

  /* ======================================================
     RENDER
  ====================================================== */
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
      {descriptionTags.length > 0 && (
        <>
          <h4>Descrizione attività</h4>
          <div className="tag-pills">
            {descriptionTags.map((tag) => (
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
      {serviceTags.length > 0 && (
        <>
          <h4>Servizi offerti</h4>
          <div className="tag-pills">
            {serviceTags.map((tag) => (
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
              ...(data.openingHours ?? {}),
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
