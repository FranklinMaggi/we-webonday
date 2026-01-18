
# AUTH_INVARIANTS.md

## Dominio: AUTH  
Sistema di autenticazione e identità — WebOnDay
WebOnDay usa autenticazione stateless basata su cookie.
Logout invalida esclusivamente il cookie.
Non esiste invalidazione server-side delle sessioni.
---

## 🎯 OBIETTIVO DEL DOMINIO

Il dominio **AUTH** gestisce:

- Identità utente (provider-based)
- Autenticazione HARD (user loggato)
- Sessione stateless via cookie
- Visitor identity (SOFT, anonima)
- Separazione rigorosa tra identity / session / guard

Il dominio **NON** gestisce:
- business logic
- autorizzazioni applicative complesse
- ACL / ruoli dinamici
- permessi granulari

---

## 🧱 PRINCIPI ARCHITETTURALI (NON NEGOZIABILI)

### 1. Autenticazione **STATELESS**
- Non esistono sessioni server-side
- Non esiste `SESSION:{id}` in KV
- Non esiste invalidazione lato backend

➡️ L’unica fonte di verità della sessione è il **cookie**

---

### 2. Cookie di sessione = userId puro

Cookie:

Invarianti:
- contiene **SOLO** `userId`
- NON contiene JWT
- NON contiene payload
- NON contiene metadata
- NON contiene expiry logica

---

### 3. Logout = distruzione cookie

Logout:
- NON invalida nulla in KV
- NON invalida user
- NON invalida identity
- NON scrive su storage

Logout = `Set-Cookie` con `Max-Age=0`

---

### 4. HARD AUTH ≠ VISITOR

| Concetto | Persistenza | Cookie | Uso |
|--------|-------------|--------|-----|
| Visitor | soft | `webonday_visitor` | browsing, analytics |
| User | hard | `webonday_session` | checkout, business |

I due flussi:
- sono **indipendenti**
- non si sovrascrivono
- possono coesistere

---

## 🔐 PROVIDER DI AUTENTICAZIONE

### Provider supportati

- `google` (PRIMARY)
- `password` (DEV / legacy)

Ogni provider produce una **AuthIdentity** normalizzata.

---
FUTURE EVOLUZIONI (NON ATTIVE)

Multi-device session

Session revoke

Magic link

Apple login

WebAuthn

## 🧠 AUTH IDENTITY (INTERNAL ONLY)

```ts
interface AuthIdentity {
  provider: "google" | "password";
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  profile?: {...}
}
Se un endpoint richiede requireAuthUser,
deve funzionare anche dopo un refresh di pagina
senza dipendere da stato server-side.