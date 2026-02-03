🔹 DOMAIN: user

Responsabilità

account

ownership

binding legale

User = {
  userId
  email
  legal: {
    privacy: AcceptedPolicy
    terms?: AcceptedPolicy
    cookie?: AcceptedPolicy
  }
}

📌 user:

nasce da auth

eredita visitor (se presente)
USER (identità legale)

Nasce solo dopo consenso Privacy obbligatorio

È l’unica entità che può:

possedere Configuration

inserire Owner / Business

firmare legalmente

Tutto scoped per configurationId (come già deciso).

Cosa è VIETATO (rinforzato)

❌ creare USER con cookie consent
❌ salvare OwnerDraft senza Privacy
❌ accettare Privacy implicitamente
❌ riusare consensi vecchi su versioni nuove
❌ FE che decide se “basta così”