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

import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import { useAuthStore } from "../../../../../../lib/store/auth.store";
import { OpeningHoursDay } from "./openingHours/OpeningHoursDay";
import { apiFetch } from "../../../../../../lib/api";

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
      !data.openingHours &&
      solutionSeed?.openingHoursDefault
    ) {
      setField(
        "openingHours",
        solutionSeed.openingHoursDefault
      );
    }
  }, [solutionSeed, data.openingHours, setField]);
  useEffect(() => {
    console.log("[BUSINESS_FORM][STORE][PRIVACY_STATE]", data.privacy);
  }, [data.privacy]);
  /* ======================================================
     SUBMIT — UPSERT BUSINESS DRAFT (BE)
  ====================================================== */
  async function handleSubmit() {
    console.log("[BUSINESS_FORM][SUBMIT]", {
      businessDraftId: data.businessDraftId,
      configurationId: data.configurationId,
    });

    /* =========================
       UI GUARDS
    ========================= */
    if (!data.businessName?.trim()) {
      alert("Inserisci il nome dell’attività");
      return;
    }

    if (!data.privacy.accepted) {
      alert("Devi accettare il trattamento dei dati");
      return;
    }

    try {
      const payload =
        buildBusinessCreateSchedaPayload(data);

      console.log(
        "[BUSINESS_FORM] POST /api/business/create-draft",
        payload
      );

      const result = await apiFetch<{
        ok: true;
        businessDraftId: string;
      }>("/api/business/create-draft", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!result?.businessDraftId) {
        throw new Error("BUSINESS_UPSERT_FAILED");
      }

      // 🔑 sincronizza FE con BE
      setField("businessDraftId", result.businessDraftId);

      onComplete();
    } catch (err) {
      console.error("[BUSINESS_FORM][ERROR]", err);
      alert("Errore nel salvataggio del business");
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

