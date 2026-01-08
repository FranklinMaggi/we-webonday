// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP 1 — BUSINESS CHECKOUT (INFORMATIVO)
//
// RUOLO:
// - Primo step del wizard di configurazione
// - Raccolta dati minimi del business
// - Checkout informativo post-login / post-carrello
//
// COSA FA:
// - Legge e scrive SOLO nello store FE (Zustand)
// - Mostra un form semplice, progressivo
//
// COSA NON FA:
// - NON salva su backend
// - NON valida in modo bloccante
// - NON crea Business / Configuration
//
// CONCETTO CHIAVE:
// - Tutti i dati qui sono EDITABILI
// - Nulla è definitivo
// - Il prefill è solo UX, non stato persistente
// ======================================================

import { useConfigurationSetupStore } from "../configurationSetup.store";

type StepBusinessInfoProps = {
  onNext: () => void;
};

export default function StepBusinessInfo({ onNext }: StepBusinessInfoProps) {
  /**
   * SOURCE OF TRUTH:
   * - data     → stato corrente del wizard (FE)
   * - setField → mutazione atomica di un singolo campo
   */
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Iniziamo la configurazione per il tuo business</h2>

      {/* ======================================================
         NOME ATTIVITÀ
         PREFILL POSSIBILE DA:
         - configuration esistente (post-cart)
         - input manuale utente
         NOTE:
         - campo centrale, sempre modificabile
      ====================================================== */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      {/* ======================================================
         EMAIL
         PREFILL AUTOMATICO DA:
         - sessione utente (authStore)
         MOTIVO:
         - l’utente è loggato
         - l’email è già nota e affidabile
         SCELTA UX:
         - disabilitata per evitare errori
      ====================================================== */}
      <input
        placeholder="Email"
        value={data.email ?? ""}
        disabled
      />

      {/* ======================================================
         TELEFONO
         PREFILL:
         - NO (dato sensibile)
         NOTE UX:
         - opzionale
         - usato solo su richiesta utente
         - comunicazione “privacy friendly”
      ====================================================== */}
      <input
        placeholder="Numero di telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

      {/* ======================================================
         CONSENSO PRIVACY
         PREFILL:
         - NO (deve essere azione esplicita)
         NOTE:
         - booleano semplice
         - nessuna validazione bloccante qui
      ====================================================== */}
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

      /* ======================================================
   INDIRIZZO ATTIVITÀ — ADDRESS ASSISTANT (FE-ONLY)
   
   AI-SUPERCOMMENT — ADDRESS INPUT BLOCK

   RUOLO:
   - Raccolta indirizzo fisico del business
   - Supporto UX alla corretta localizzazione
   - Base per SEO locale, mappe e contatti

   SOURCE OF TRUTH:
   - Stato FE → configurationSetup.store (Zustand)

   PREFILL:
   - ❌ Nessun prefill automatico lato indirizzo
   - ✅ Compilazione manuale sempre consentita
   - 🔮 Autocomplete futuro (Google Places)

   NOTE ARCHITETTURALI:
   - Questo blocco NON valida l’indirizzo
   - NON fa fetch
   - NON salva su backend
   - Tutti i campi restano SEMPRE editabili
   - placeId verrà valorizzato solo se autocomplete attivo

   FUTURO:
   - useAddressAssistant.search(query)
   - dropdown suggerimenti
   - setField multiplo (address, city, state, zip, placeId)
====================================================== */

/* Hook FE — attualmente noop, pronto per Google Places 
{/* const { search } = useAddressAssistant();*/}

/* =========================
   INDIRIZZO (CAMPO PRINCIPALE)
   SIGNIFICATO:
   - Via + numero civico
   - Punto di partenza per eventuale autocomplete
========================= */
<input
  placeholder="Indirizzo attività (es. Via Roma 10)"
  value={data.address ?? ""}
  onChange={(e) =>
    setField("address", e.target.value)
  }
/>

/* =========================
   METADATI INDIRIZZO
   NOTE:
   - Possono essere compilati a mano
   - In futuro derivabili da autocomplete
========================= */
<div className="address-grid">
  {/* CITTÀ */}
  <input
    placeholder="Città"
    value={data.city ?? ""}
    onChange={(e) =>
      setField("city", e.target.value)
    }
  />

  {/* STATO / PROVINCIA */}
  <input
    placeholder="Provincia / Stato"
    value={data.state ?? ""}
    onChange={(e) =>
      setField("state", e.target.value)
    }
  />

  {/* CAP */}
  <input
    placeholder="CAP"
    value={data.zip ?? ""}
    onChange={(e) =>
      setField("zip", e.target.value)
    }
  />
</div>


      {/* ======================================================
         IMMAGINE ATTIVITÀ (OPZIONALE)
         USO FUTURO:
         - logo
         - verifica attività
         - materiale AI
         NOTE:
         - File salvato SOLO nello store FE
         - upload backend avverrà più avanti
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
         AZIONE
         SIGNIFICATO:
         - passaggio allo step successivo
         - nessun salvataggio
      ====================================================== */}
      <div className="actions">
        <button onClick={onNext}>
          Continua
        </button>
      </div>
    </div>
  );
}
