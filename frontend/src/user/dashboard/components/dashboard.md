## Dashboard User — Linee Guida Ufficiali

Obiettivo: realizzare una dashboard dinamica che rifletta lo stato reale del dominio WebOnDay, senza stati inventati lato frontend.

### Regole di Dominio
- Un Business è visibile solo se la Configuration è in stato `BUSINESS_READY`.
- La preview del Business è disponibile solo se `business.complete === true`.
- Le Configuration con `business.complete === false` sono considerate “in corso”.

### Sidebar
- Sezione Business:
  - Mostra solo Business completi.
  - Supporta più Business per lo stesso owner.
  - Ogni Business ha accesso alla preview.
- Sezione Configurazioni:
  - Mostra solo configurazioni non ancora diventate Business.
  - Permette di continuare o completare la configurazione.
- CTA “Nuova configurazione” sempre visibile.

### Profile
- Area dedicata all’Owner.
- Contiene dati personali e stato di verifica (PENDING / ACCEPTED / REJECTED).
- Non contiene logiche di business o configurazione.

### Account
- Area tecnica dell’utente.
- Mostra userId, email, reset password, provider auth, cookie e policy.

### Configuration Page
- Non è una dashboard gestionale.
- Mostra solo:
  - Inizio nuova configurazione
  - Configurazioni attive non ancora complete

### Note Operative
- I fallback i18n sono temporaneamente secondari.
- Il frontend non introduce stati propri: legge e riflette il backend.