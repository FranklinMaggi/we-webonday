Queste vanno dette chiaramente nel codice (commenti + invarianti).

✅ 1. OwnerDraft è per user, non per business

✔️ chiave KV: BUSINESS_OWNER_DRAFT:${userId}
✔️ GET owner → solo da session
✔️ Attach → verifica ownership via businessDraft

👉 Non cambiare mai questo

✅ 2. complete = funzione della privacy

La regola corretta è questa (e tu l’hai già capita):

complete === privacy.accepted === true


Non:

form compilato

nome/cognome presenti

👉 privacy è il gate legale, non i campi anagrafici.

✅ 3. verified è uno stato successivo (manuale / esterno)

complete = utente ha accettato

verified = noi (o terzi) abbiamo verificato

Ottimo che siano separati.