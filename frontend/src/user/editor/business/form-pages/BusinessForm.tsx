// ======================================================
// FE || BusinessForm.tsx
// ======================================================
//
// RUOLO (CANONICAL):
// - Raccolta dati Business (FE only)
// - Applica seed da Solution (READ ONLY):
//   • descriptionTags
//   • serviceTags
//   • openingHours
//
// PRINCIPI:
// - Backend = source of truth per Solution
// - FE Store = source of truth per Business draft
//
// INVARIANTI:
// - ❌ Nessun fetch extra
// - ❌ Nessuna AI
// ======================================================

import { useEffect } from "react";
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
import { useConfigurationSetupStore } from "@src/user/editor/api/type/configurator/configurationSetup.store";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { OpeningHoursDay } from "./OpeningHoursDay";
import { apiFetch } from "@shared/lib/api";
import type { SolutionSeed } from "@shared/domain/business/buseinssRead.types";
import { isOpeningHoursEmpty } from "@shared/domain/business/openingHours.utils";
import { useCityAutocomplete } from "@shared/lib/geo/useCityAutocomplete";

/* ======================================================
   TYPES
====================================================== */

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
  const { data, setField } = useConfigurationSetupStore();
  const user = useAuthStore((s) => s.user);

  const { suggestions, hasSuggestions } = useCityAutocomplete(
    data.businessAddress?.city ?? ""
  );

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
  ====================================================== */

  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email, data.email, setField]);

  /* ======================================================
     PREFILL OPENING HOURS FROM SOLUTION (SAFE)
  ====================================================== */

  useEffect(() => {
    if (
      solutionSeed?.openingHours &&
      isOpeningHoursEmpty(data.openingHours)
    ) {
      setField("openingHours", solutionSeed.openingHours);
    }
  }, [solutionSeed, data.openingHours, setField]);

  /* ======================================================
     HELPERS
  ====================================================== */

  function hasAtLeastOneOpeningRange(
    openingHours: OpeningHoursFE
  ): boolean {
    return Object.values(openingHours).some(
      (ranges) => ranges.length > 0
    );
  }

  /* ======================================================
     SUBMIT — UPSERT BUSINESS DRAFT
  ====================================================== */
  console.log("[DEBUG][BUSINESS_ADDRESS]", data.businessAddress);
  async function handleSubmit() {
    console.group("[BUSINESS_FORM][SUBMIT]");
    console.log("STORE SNAPSHOT", data);

    /* =========================
       VALIDAZIONI FE
    ========================= */

    if (!data.businessName?.trim()) {
      alert("Inserisci il nome dell’attività");
      console.groupEnd();
      return;
    }

    if (!data.email?.trim()) {
      alert("Completa il campo Email");
      console.groupEnd();
      return;
    }

   

    if (!hasAtLeastOneOpeningRange(data.openingHours)) {
      alert("Inserisci almeno un orario di apertura");
      console.groupEnd();
      return;
    }

    const a = data.businessAddress;

    if (!a?.street?.trim()) {
      alert("Completa il campo Indirizzo (via)");
      console.groupEnd();
      return;
    }

    if (!a?.number?.trim()) {
      alert("Completa il campo Numero civico");
      console.groupEnd();
      return;
    }

    if (!a?.city?.trim()) {
      alert("Completa il campo Città");
      console.groupEnd();
      return;
    }

    if (!data.phone?.trim()) {
      const proceed = confirm(
        "Non hai inserito un numero di telefono. Vuoi continuare?"
      );
      if (!proceed) {
        console.groupEnd();
        return;
      }
    }

    /* =========================
       MAP FE → BE (CANONICAL)
    ========================= */

    const payload = {
      configurationId: data.configurationId,
      solutionId: data.solutionId,
      productId: data.productId,

      businessName: data.businessName,
      openingHours: data.openingHours,

      contact: {
        mail: data.email,
        phoneNumber: data.phone,
      },

      address: {
        street: a.street,
        number: a.number,
        city: a.city,
        province: a.province,
        region: a.region,
        zip: a.zip,
        country: a.country,
      },

      businessDescriptionTags: data.businessDescriptionTags,
      businessServiceTags: data.businessServiceTags,

    
    };

    console.log("PAYLOAD → BE", payload);

    try {
      // NOTA:
// - Questa operazione NON crea Business
// - Scrive solo BusinessDraft
// - La creazione BUsiness avviene SOLO via attachOwnerToConfiguration
      const res = await apiFetch<{
        ok: true;
        businessDraftId: string;
      }>("/api/business/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res?.businessDraftId) {
        throw new Error("BUSINESS_DRAFT_UPSERT_FAILED");
      }

      setField("businessDraftId", res.businessDraftId);
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

      <input placeholder="Email" value={data.email} disabled />

      <input
        placeholder="Telefono"
        value={data.phone ?? ""}
        onChange={(e) => setField("phone", e.target.value)}
      />


      {/* ================= INDIRIZZO ================= */}
      <fieldset className="business-address">
  <legend>Indirizzo dell’attività</legend>

  {/* VIA */}
  <div className="form-field">
    <label htmlFor="business-address-street">Via / Indirizzo *</label>
    <input
      id="business-address-street"
      className="input-address-street"
      placeholder="Es. Via Roma"
      value={data.businessAddress?.street ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          street: e.target.value,
        })
      }
    />
  </div>

  {/* NUMERO CIVICO */}
  <div className="form-field">
    <label htmlFor="business-address-number">Numero civico *</label>
    <input
      id="business-address-number"
      className="input-address-number"
      placeholder="Es. 12"
      value={data.businessAddress?.number ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          number: e.target.value,
        })
      }
    />
  </div>

  {/* CITTÀ + AUTOCOMPLETE */}
  <div className="form-field city-autocomplete">
    <label htmlFor="business-address-city">
      Città *
      <span className="hint"> (suggerimenti automatici)</span>
    </label>

    <input
      id="business-address-city"
      className="input-address-city"
      placeholder="Inizia a scrivere…"
      value={data.businessAddress?.city ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          city: e.target.value,
        })
      }
    />

    {hasSuggestions && (
      <ul className="autocomplete-list">
        {suggestions.map((c) => (
          <li
            key={`${c.city}-${c.province}`}
            className="autocomplete-item"
            onClick={() =>
              setField("businessAddress", {
                ...data.businessAddress,
                city: c.city,
                province: c.province,
                region: c.region,   // FE-only
                country: c.state,   // FE-only
              })
            }
          >
            <strong>{c.city}</strong>
            <span className="meta">
              {c.province} · {c.region}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* PROVINCIA */}
  <div className="form-field">
    <label htmlFor="business-address-province">Provincia</label>
    <input
      id="business-address-province"
      className="input-address-province"
      placeholder="Es. BA"
      value={data.businessAddress?.province ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          province: e.target.value.toUpperCase(),
        })
      }
    />
  </div>

  {/* CAP */}
  <div className="form-field">
    <label htmlFor="business-address-zip">CAP</label>
    <input
      id="business-address-zip"
      className="input-address-zip"
      placeholder="Es. 70100"
      value={data.businessAddress?.zip ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          zip: e.target.value,
        })
      }
    />
  </div>
</fieldset>

     {/* ================= TAG ================= */}

{solutionSeed?.descriptionTags?.length ? (
  <>
    <h4>Descrizione attività</h4>
    <div className="tag-pills">
      {solutionSeed.descriptionTags
        .filter((t): t is string => Boolean(t))
        .map((tag) => (
          <button
            key={`desc-${tag}`}
            type="button"
            className={
              data.businessDescriptionTags.includes(tag)
                ? "pill active"
                : "pill"
            }
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
) : null}

{solutionSeed?.serviceTags?.length ? (
  <>
    <h4>Servizi offerti</h4>
    <div className="tag-pills">
      {solutionSeed.serviceTags
        .filter((t): t is string => Boolean(t))
        .map((tag) => (
          <button
            key={`service-${tag}`}
            type="button"
            className={
              data.businessServiceTags.includes(tag)
                ? "pill active"
                : "pill"
            }
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
) : null}


      {/* ================= ORARI ================= */}

      <h3>Orari di apertura</h3>

      {DAYS.map(([dayKey, label]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={label}
          value={data.openingHours[dayKey]}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      <div className="actions">
        <button onClick={handleSubmit}>Continua</button>
      </div>
    </div>
  );
}
