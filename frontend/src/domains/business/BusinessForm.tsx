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

import { useConfigurationSetupStore } from "../../pages/user/dashboard/configurator/store/configurationSetup.store";
import { useAuthStore } from "../../lib/store/auth.store";
import { OpeningHoursDay } from "./openingHours/OpeningHoursDay";
import { apiFetch } from "../../lib/api";

import { buildBusinessCreateSchedaPayload } from "./normalizers/business.base.create";
/* ======================================================
   TYPES
====================================================== */
export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHoursDefault: Record<string, string> | null;
};

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
export default function BusinessForm({
  onComplete,
  solutionSeed,
}: BusinessFormProps) {
  /* =========================
     STORE (SOURCE OF TRUTH)
  ========================= */
  const { data, setField } = useConfigurationSetupStore();
  const user = useAuthStore((s) => s.user);

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
     - una sola volta
  ====================================================== */
  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email, data.email, setField]);

  /* ======================================================
     APPLY SOLUTION SEED (ONCE)
     REGOLA FERREA:
     - se store è vuoto → seed
     - se utente ha scritto → NON toccare
  ====================================================== */
  useEffect(() => {
    if (!solutionSeed) return;

    if (
      data.businessDescriptionTags.length === 0 &&
      solutionSeed.descriptionTags.length > 0
    ) {
      setField(
        "businessDescriptionTags",
        solutionSeed.descriptionTags
      );
    }

    if (
      data.businessServiceTags.length === 0 &&
      solutionSeed.serviceTags.length > 0
    ) {
      setField(
        "businessServiceTags",
        solutionSeed.serviceTags
      );
    }

    if (
      !data.openingHours &&
      solutionSeed.openingHoursDefault
    ) {
      setField(
        "openingHours",
        solutionSeed.openingHoursDefault
      );
    }
  }, [solutionSeed, data, setField]);

  /* ======================================================
     SUBMIT (FE ONLY)
  ====================================================== */
/* ======================================================
   SUBMIT — CREATE BUSINESS (BE)
====================================================== */
async function handleSubmit() {
  console.log("[BUSINESS_FORM][SUBMIT] start", {
    businessId: data.businessId,
    businessName: data.businessName,
  });

  /* =========================
     HARD GUARDS (UI ONLY)
  ========================= */
  if (data.businessId) {
    console.warn(
      "[BUSINESS_FORM] business already exists",
      data.businessId
    );
    onComplete();
    return;
  }

  if (!data.businessName?.trim()) {
    alert("Inserisci il nome dell’attività");
    return;
  }

  if (!data.privacyAccepted) {
    alert("Devi accettare il trattamento dei dati");
    return;
  }

  try {
    /* =========================
       BUILD PAYLOAD (CANONICAL)
       ⛔ BusinessForm NON conosce
          la shape del backend
    ========================= */
    const payload =
      buildBusinessCreateSchedaPayload(data);

    console.log(
      "[BUSINESS_FORM] POST /api/business/create-schede",
      payload
    );

    const result = await apiFetch<{
      ok: true;
      draftId: string;
    }>("/api/business/create-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!result?.draftId) {
      throw new Error("BUSINESS_CREATE_EMPTY_RESPONSE");
    }

    console.log(
      "[BUSINESS_FORM] business created",
      result.draftId
    );

    setField("draftId", result.draftId);
    onComplete();
  } catch (err) {
    console.error("[BUSINESS_FORM][ERROR]", err);
    alert("Errore nella creazione del business");
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
          checked={data.privacyAccepted}
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

      {/* ================= DESCRIZIONE (TAG) ================= */}
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

      {/* ================= SERVIZI (TAG) ================= */}
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

      {/* ================= CTA ================= */}
      <div className="actions">
        <button onClick={handleSubmit}>
          Continua
        </button>
      </div>
    </div>
  );
}
