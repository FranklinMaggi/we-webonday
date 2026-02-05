Domanda **fondamentale**.
Qui ti rispondo senza farti perdere tempo, ma **mettendo in sicurezza il futuro**.

> **Sì: puoi rendere OWNER user-scoped oggi
> e introdurre brokeraggio domani
> SENZA buttare nulla.**

Ma **solo se oggi fai 3 scelte precise**.
Te le spiego, poi ti mostro **cosa accade domani**.

---

# 🎯 Scelta di oggi (OWNER user-scoped)

Oggi dichiari esplicitamente:

```
OWNER.id === userId
OWNER_DRAFT:{userId}
OWNER:{userId}
```

Significa:

* WebOnDay è **self-service**
* ogni account rappresenta **una persona/azienda**
* verifica fatta **una volta**
* Owner = “chi sei”

Fin qui tutto bene.

---

# 🔒 Le 3 scelte OBBLIGATORIE da fare ORA

(se vuoi poter scalare domani)

## 1️⃣ OWNER è **persona verificata**, non ruolo

Nel dominio MD e nel codice:

* **NON chiamare OWNER “titolare di business”**
* chiamalo:

  > *Identità legale dell’account*

Questo è cruciale:
domani potrà rappresentare altri.

---

## 2️⃣ BUSINESS **NON deve assumere** che ownerId === userId

Anche se oggi è vero, **non codificarlo come verità eterna**.

### ❌ NO

```ts
business.ownerId = configuration.userId;
```

### ✅ SÌ

```ts
business.ownerId = owner.id;
```

Oggi:

```
owner.id === userId
```

Domani:

```
owner.id !== userId
```

Il Business **non se ne accorge**.

---

## 3️⃣ Verifica sempre legata a OWNER, non a BUSINESS

Non fare:

```ts
business.verificationStatus
```

Fai:

```ts
owner.verificationStatus
```

Oggi:

* 1 owner → N business

Domani:

* 1 owner → N business (anche se owner non è l’utente)

---

# 🧭 Cosa succede DOMANI quando introduci brokeraggio

### Scenario: un broker entra su WebOnDay

#### Nuove entità (AGGIUNTE, non refactor)

```
USER (broker)
OWNER (persona verificata)
REPRESENTATION (user ↔ owner)
```

### Nuova relazione

```ts
REPRESENTATION {
  userId;     // broker
  ownerId;    // cliente
  role: "BROKER" | "OWNER";
}
```

---

## 🔁 Cosa NON cambia

* `OWNER:{ownerId}`
* documenti
* verifica
* Business → ownerId

---

## 🔁 Cosa cambia (localizzato)

* il broker **crea o collega** un Owner
* la Configuration può indicare:

  ```ts
  configuration.ownerId
  ```
* auth check usa:

  ```ts
  canUserActOnOwner(userId, ownerId)
  ```

---

# 🧱 Migrazione ZERO-PAIN

Il bello è qui:

### Oggi

```
ownerId === userId
```

### Domani

```
ownerId !== userId
```

Ma:

* Business non cambia
* Verification non cambia
* Documenti non cambiano
* KV keys non cambiano

👉 **aggiungi solo una relazione in più**.

---

# 📌 Perché questa strategia è giusta

✔ Parti semplice
✔ Non menti ai dati
✔ Non duplich Owner
✔ Non ti precludi brokeraggio
✔ Non fai refactor traumatici

---

# 🧠 Regola d’oro (questa è la bussola)

> **L’Owner è una persona verificata.
> L’User è chi opera.
> Il brokeraggio è una relazione, non un tipo di owner.**

Se oggi implementi OWNER user-scoped **in questo modo**,
domani il brokeraggio è un *add-on*, non una riscrittura.

---

## 🔚 Risposta secca alla tua domanda

> “Se rendiamo owner user-scoped, cosa accade in futuro?”

✔ **Niente di male**
✔ **Nessun refactor distruttivo**
✔ **Aggiungi solo rappresentanza**
✔ **La scelta è reversibile**

---

Se vuoi, prossimo passo ultra-concreto:

* aggiornare **owner.domain.md** con queste 3 regole
* oppure disegnare **REPRESENTATION schema** (solo concettuale)

