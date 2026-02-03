======================================================
WEBONDAY — E2E DOMAIN MIRROR (CONFIGURATION CENTRIC)
======================================================

PRINCIPIO CARDINE
-----------------
- Configuration è il ROOT AGGREGATE
- Tutti i draft (Business / Owner) sono figli di Configuration
- Ogni read/write è sempre scoped per configurationId
- FE e BE espongono le STESSE operazioni concettuali

------------------------------------------------------
DOMAIN: CONFIGURATION (ROOT)
------------------------------------------------------

[CREATE]
- createConfigurationBase
  BE: POST   /api/configuration/create
  FE: createConfigurationBase()
  OUTPUT: configurationId

[READ]
- getBaseConfiguration
  BE: GET    /api/configuration/:configurationId
  FE: getConfigurationForConfigurator(configurationId)

- listBaseConfigurations (user scoped)
  BE: GET    /api/configurations/list
  FE: listMyConfigurations()

[UPDATE]
- updateConfigurationDraft
  BE: PUT    /api/configuration/:configurationId
  FE: updateConfiguration(configurationId, payload)

------------------------------------------------------
DOMAIN: BUSINESS DRAFT (CHILD OF CONFIGURATION)
------------------------------------------------------

[CREATE / UPDATE]
- createBusinessDraft
  BE: POST   /api/business/create-draft
  INPUT: configurationId (REQUIRED)
  FE: createBusinessDraft(payload)

[READ]
- getBusinessDraft
  BE: GET    /api/business/get-base-draft?configurationId=…
  FE: getBusinessDraft(configurationId)

- listBusinessDrafts (user scoped)
  BE: GET    /api/business/draft/get-list
  FE: listBusinessDrafts()

------------------------------------------------------
DOMAIN: OWNER DRAFT (CHILD OF CONFIGURATION)
------------------------------------------------------

[CREATE / UPDATE]
- createOwnerDraft
  BE: POST   /api/owner/create-draft
  INPUT: configurationId (REQUIRED)
  FE: upsertOwnerDraft(payload)

[READ]
- getOwnerDraft
  BE: GET    /api/owner/get-draft?configurationId=…
  FE: useMyOwnerDraft(configurationId)

- listOwnerDrafts (OPTIONAL / FUTURE)
  BE: GET    /api/owner/draft/list
  FE: listOwnerDrafts()

------------------------------------------------------
DOMAIN: COMMIT / ATTACH
------------------------------------------------------

[COMMIT CONFIGURATION]
- attachOwnerAndBusinessToConfiguration
  BE: POST   /api/business/configuration/attach-owner
  INPUT: configurationId
  EFFECT:
    - Configuration status → COMPLETED
    - OwnerDraft + BusinessDraft locked

------------------------------------------------------
FRONTEND FLOW (E2E)
------------------------------------------------------

1 USER
 └─ 2 CONFIGURATIONS
     ├─ Configuration A
     │   ├─ BusinessDraft A
     │   └─ OwnerDraft A
     │
     └─ Configuration B
         ├─ BusinessDraft B
         └─ OwnerDraft B

- Sidebar, Workspace, Preview leggono SEMPRE:
  → Configuration
  → OwnerDraft(configurationId)
  → BusinessDraft(configurationId)

------------------------------------------------------
NON È PERMESSO
------------------------------------------------------

❌ leggere Owner senza configurationId
❌ usare owner “globale” dell’utente
❌ inferire dati da altre configuration
❌ fetch diretti negli step senza hook

------------------------------------------------------
NOTE FINALI
------------------------------------------------------

- Questo file è la SOURCE OF TRUTH concettuale
- Ogni nuovo endpoint deve mappare qui
- Se una funzione non è mappabile → è sbagliata


# Legal Domain — WebOnDay

## Purpose
Gestire consenso legale GDPR (Privacy, Cookie, Terms)
in modo versionato, auditabile e user-centric.

## Invariants
- Cookie ≠ Privacy ≠ Terms
- Privacy obbligatoria per ogni user
- Cookie opzionale (visitor-first)
- Tutti i documenti sono versionati via BE
- FE non contiene testi legali

## Storage
- POLICY_KV → documenti
- ON_USERS_KV → stato legale user
- USER_LEGAL_LOG_KV → audit append-only

## User Legal Shape
```ts
user.legal = {
  locale,
  privacy,
  terms?,
  cookie?
}