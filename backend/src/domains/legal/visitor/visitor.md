🔹 DOMAIN: visitor

Responsabilità

fingerprint

cookie state

locale

consenso iniziale

Visitor è anonimo ma persistente

Visitor = {
  visitorId
  fingerprint
  locale
  cookies: {
    analytics: boolean
    marketing: boolean
  }
}

📌 visitor:

può esistere senza auth

può accettare legal

può diventare user

VISITOR (anonimo)

Identità tecnica, non personale

Vive prima di USER

Nasce con il Cookie Banner

Non può mai:

creare Configuration

inserire dati personali

procedere oltre nome attività

cookieConsent = {
  necessary: true,          // sempre true
  preferences: boolean,    // opzionale
  analytics: boolean,      // opzionale
  marketing: boolean       // opzionale
}

Effetto

Viene creato (o aggiornato) VISITOR

Salvato in:

cookie/localStorage (FE)

VISITOR_KV (BE)

NON crea USER

Questo è corretto e già coerente con il tuo CookieBanner attuale.

Flow Canonico (E2E)
1️⃣ Visitor entra

Cookie Banner

Nasce VISITOR

Può:

navigare

vedere Solutions

scegliere Solution

2️⃣ Pre-Configuration (safe)

Consentito senza Privacy:

“Come si chiama la tua attività?”

Nome attività è borderline
→ consentito solo come stringa isolata, non associata a persona.
PreConfigurationDraft {
  tempId,
  businessName,
  visitorId
}

3️⃣ Tentativo di avanzare (BLOCCO)

Appena l’utente prova a:

salvare Configuration

inserire Owner

procedere nel configurator

👉 Privacy Gate


Cosa è VIETATO (rinforzato)

❌ creare USER con cookie consent
❌ salvare OwnerDraft senza Privacy
❌ accettare Privacy implicitamente
❌ riusare consensi vecchi su versioni nuove
❌ FE che decide se “basta così”