// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP — BUSINESS SETUP (ANAGRAFICA + CONTENUTI)
//
// RUOLO:
// - Raccolta completa dei dati del business
// - Include:
//   • anagrafica
//   • contatti
//   • indirizzo
//   • contenuti testuali
//   • TAG DESCRITTIVI (descriptionTags)
//   • TAG SERVIZI (serviceTags)
//   • orari di apertura
//
// INVARIANTI CRITICHE:
// - FE ONLY (Zustand store)
// - Nessuna fetch
// - Nessuna persistenza backend
// - Nessuna validazione bloccante
// - Nessuna creazione Business / Configuration
//
// SCOPO:
// - Preparare TUTTI i dati necessari
//   allo step successivo
//
// ======================================================

import { upsertConfigurationFromBusiness } from "../../lib/userApi/configuration.user.api";
import { useConfigurationSetupStore } from "../../lib/store/configurationSetup.store";
import { OpeningHoursDay } from "../openingHours/OpeningHoursDay";
import { createBusiness } from "../../lib/userApi/business.user.api";
import { normalizeTags } from "../../utils/tags";
import { useAuthStore } from "../../lib/store/auth.store";
import { useEffect } from "react";

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

/**
 * Toggle puro di una tag
 * (nessuna normalizzazione qui)
 */
function toggleTag(
  current: string[] = [],
  tag: string
): string[] {
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
  /**
   * SOURCE OF TRUTH:
   * - data     → stato corrente wizard (FE)
   * - setField → mutazione atomica
   */
  const {
    data,
    setField,
    businessId,
    setBusinessId,
  } = useConfigurationSetupStore();

  const user = useAuthStore((s) => s.user);

  /* ======================================================
     PREFILL EMAIL (DA AUTH)
     - Avviene una sola volta
     - Non sovrascrive input manuale
  ====================================================== */
  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email]);

  return (
    <div className="step">
      <h2>Configuriamo il tuo business</h2>

      {/* ======================================================
         ANAGRAFICA BUSINESS
      ====================================================== */}
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

      {/* ======================================================
         INDIRIZZO BUSINESS (FE-ONLY)
      ====================================================== */}
      <input
        placeholder="Indirizzo attività (es. Via Roma 10)"
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
          placeholder="Provincia / Stato"
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

      {/* ======================================================
         IMMAGINE BUSINESS (FE-ONLY)
      ====================================================== */}
      <label>
        Immagine dell’attività (opzionale)
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setField(
              "businessImage",
              e.target.files?.[0] ?? null
            )
          }
        />
      </label>

      {/* ======================================================
         CONTENUTI SITO
      ====================================================== */}
      <h3>Contenuti del sito</h3>

      {/* ======================================================
         DESCRIPTION TAGS
         - Derivano da Solution.descriptionTags
         - Selezione tramite pills
         - FE-only
      ====================================================== */}
 {(data.solutionDescriptionTags?.length ?? 0) > 0 && (

        <>
          <h4>Descrivi la tua attività con dei tag</h4>

          <div className="tag-pills">
            {data.solutionDescriptionTags ?? [] .map((tag) => {
              const active =
                data.businessDescriptionTags?.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  className={`pill ${active ? "active" : ""}`}
                  onClick={() =>
                    setField(
                      "businessDescriptionTags",
                      normalizeTags(
                        toggleTag(
                          data.businessDescriptionTags,
                          tag
                        )
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
      )}

      {/* ======================================================
         SERVICE TAGS
         - Derivano da Solution.serviceTags
         - Selezione tramite pills
         - FE-only
      ====================================================== */}
      {(data.solutionServiceTags?.length ?? 0 ) > 0 && (
        <>
          <h4>I servizi che offri</h4>

          <div className="tag-pills">
            {data.solutionServiceTags ?? [].map((tag) => {
              const active =
                data.businessServiceTags?.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  className={`pill ${active ? "active" : ""}`}
                  onClick={() =>
                    setField(
                      "businessServiceTags",
                      normalizeTags(
                        toggleTag(
                          data.businessServiceTags,
                          tag
                        )
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
      )}

      {/* ======================================================
         COPY TESTUALE (ANCORA UTILE)
         - usato per hero / about
      ====================================================== */}
      <textarea
        placeholder="Descrizione dell’attività"
        value={data.description ?? ""}
        onChange={(e) =>
          setField("description", e.target.value)
        }
      />

      <input
        placeholder="Call to action (es. Contattaci ora)"
        value={data.cta ?? ""}
        onChange={(e) =>
          setField("cta", e.target.value)
        }
      />

      {/* ======================================================
         ORARI DI APERTURA (FE-ONLY)
      ====================================================== */}
      <h3>Orari di apertura</h3>
      {DAYS.map(([dayKey, dayLabel]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={dayLabel}
          value={data.openingHours?.[dayKey] ?? ""}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      {/* ======================================================
         AZIONE
      ====================================================== */}
      <div className="actions">
        <button
          onClick={async () => {
            // ============================================
            // STEP 2 — CREATE BUSINESS (ONCE)
            // ============================================

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

              if (!res || !res.ok) {
                alert("Errore creazione attività");
                return;
              }

              // TECH STATE (FE-only)
              setBusinessId(res.businessId);

              await upsertConfigurationFromBusiness({
                businessId: res.businessId,
                productId: data.productId,
                optionIds: data.optionIds ?? [],
              });
            }

            onComplete();
          }}
        >
          Continua
        </button>
      </div>
    </div>
  );
}
