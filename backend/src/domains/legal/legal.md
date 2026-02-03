🔹 DOMAIN: legal

Responsabilità ESCLUSIVE

versioning policy

registrare accettazioni

audit log

Input SEMPRE neutri

LegalAcceptanceInput = {
  subject: {
    type: "visitor" | "user"
    id?: string        // opzionale
    fingerprint: string
  }
  policy: {
    scope: "privacy" | "cookie" | "terms"
    version: string
  }
  payload: any
}

❗ legal non importa:

UserSchema

VisitorSchema

AuthContext