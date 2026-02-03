Privacy ≠ Cookie → GATE BLOCCANTE
Dati considerati sensibili (blocking)

Nome attività

Nome titolare

Email

Telefono

Documenti

Qualsiasi Owner / Business draft

👉 Tutti questi richiedono Privacy accettata

user.legal = {
  locale: "it-IT",

  privacy: {
    accepted: boolean,
    version: string,
    acceptedAt: ISODate,
    source: "signup" | "checkout" | "configurator"
  },

  terms?: {
    accepted: boolean,
    version: string,
    acceptedAt: ISODate
  },

  cookie?: {
    analytics: boolean,
    marketing: boolean,
    version: string,
    acceptedAt: ISODate
  }
}

Storage (come già definito, confermato)

POLICY_KV

privacy_v1

privacy_v2

terms_v3

ON_USERS_KV

stato corrente user

USER_LEGAL_LOG_KV

append-only

mai riscritto

UserLegalLog = {
  userId | visitorId,
  policyType: "privacy" | "terms" | "cookie",
  version,
  accepted: true,
  timestamp,
  ipHash,
  userAgent
}


4️⃣ Privacy Gate (bloccante)

UI:

testo Privacy dal BE

checkbox non preselezionata

CTA unica:
“Accetto la Privacy Policy”
Effetto:

Creazione USER

Log audit

User.legal.privacy = accepted

Cosa è VIETATO (rinforzato)

❌ creare USER con cookie consent
❌ salvare OwnerDraft senza Privacy
❌ accettare Privacy implicitamente
❌ riusare consensi vecchi su versioni nuove
❌ FE che decide se “basta così”