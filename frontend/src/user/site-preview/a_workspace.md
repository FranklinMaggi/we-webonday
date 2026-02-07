Workspace = ambiente di lavoro dell’utente dove vede, modifica e previsualizza il proprio sito, indipendentemente dallo stato (draft / accepted / rejected).

Quindi:

❌ NON è il sito pubblico

❌ NON è il wizard

❌ NON è l’admin

✅ È un simulatore del sito

✅ La preview non sparisce mai


Ti riscrivo come dovrebbe essere letta, non come va rifatta.

1️⃣ workspace.shell.tsx → OK, È IL CONTENITORE
workspace.shell.tsx

RUOLO CORRETTO

Layout a due colonne

Sidebar + Preview

ZERO logica

👉 Questo file non si tocca più.
È corretto.

2️⃣ workspace.state.ts → STATO MINIMO (VA BENE)

Serve solo a dire:

“Su quale attività sto lavorando adesso”

👉 Corretto che sia minuscolo e stupido.
Non aggiungere status, configurazione, owner qui.


3️⃣ workspace.sidebar.tsx → QUI NASCE LA CONFUSIONE
ERRORE ATTUALE (concettuale, non tecnico)

La sidebar legge dallo store di configurazione, quindi:

dipende dal wizard

dipende dagli status

sparisce quando cambia fase

REGOLA NUOVA (SEMPLICE)

La sidebar del workspace NON dipende dallo status.

Deve mostrare:

nome attività

strumenti disponibili

stato informativo (badge)

MA MAI NASCONDERE LA PREVIEW

👉 Gli if tipo:

if (configuration.status !== "ARCHIVED")

sono vietati nel workspace.

4️⃣ site-preview/ → È IL CUORE (ED È GIÀ QUASI GIUSTO)

Questa è la parte che non hai capito perché nessuno te l’ha mai spiegata.

Verità semplice:

Tu hai già costruito un mini CMS + site renderer.




site-loader.ts
useBusinessPreview(businessId)

RUOLO

carica i dati necessari a simulare il sito

oggi: da /preview

domani: da /public

👉 È corretto.
👉 Va solo documentato, non rifatto.

site.adapter.ts

Questo file è oro.

Trasforma dati “sporchi” → input pulito per l’engine.

Qui deciderai in futuro:

nome

slug

indirizzo

orari

servizi

👉 Questo è il punto dove attaccherai AI e CMS, non altrove.


engine.builder.ts

Questo NON è workspace.
Questo è motore di rendering.

👉 Sta bene dov’è.
👉 Non deve sapere nulla di:

utenti

status

configurazioni


5️⃣ SiteContainer → IL VERO REGISTA

Qui nasce la preview.

Oggi fa:

prende activeBusinessId

carica dati

costruisce canvas

renderizza

MANCAVA SOLO UNA COSA (ed è qui che ti sei perso)

Non avevi una frase mentale chiara.

La frase giusta è:

“Sto guardando una simulazione del sito, non una configurazione.”

Una volta capita questa frase, tutto torna.


🖼️ IMMAGINI, HERO, LOGO, GALLERY (CHIARIAMO SUBITO)
Regola fondamentale (IMPORTANTISSIMA)

La preview NON ha bisogno delle immagini vere.

Usa:

placeholder prevedibili

slot chiari

path finti

Esempio (già giusto nel tuo codice):backgroundImage: `/img/hero-${business.slug}.png`

Questo significa:

oggi → placeholder

domani → R2 / CDN / upload

sempre → stessa struttura


Hero

1 immagine

fallback gradient / colore

Logo

se non c’è → testo nome attività

se c’è → img

Gallery

array vuoto = placeholder

array pieno = immagini vere

👉 Non bloccare la preview per le immagini. Mai.

🌍 PUBBLICAZIONE SU nomesito.webonday.it (TRANQUILLO)

Non serve risolverla ora, ma ti do la mappa mentale giusta:

Il canvas che stai generando è già la source of truth

Pubblicare significa:

servire lo stesso canvas

con dati “live”

Il dominio è solo:

un resolver → businessId → canvas

Quindi:

Workspace preview = /preview

Sito pubblico = /public

Stesso renderer

👉 Se la preview funziona bene, la pubblicazione è già vinta.


🔧 COSA FACCIAMO ORA (PIANO CALMO, IN ORDINE)

Ti propongo questo percorso sicuro:

STEP 1

📌 Revisione completa commentata di workspace/

aggiungiamo AI-SUPERCOMMENT

dichiariamo i ruoli

togliamo ambiguità

STEP 2

📌 Stabilizziamo la preview

sempre visibile

empty state bello

loading pulito

STEP 3

📌 Definiamo slot immagini

hero

logo

gallery

STEP 4

📌 Prepariamo mentalmente la pubblicazione
(senza implementarla)

DIMMI SOLO QUESTO (UNA RISPOSTA SECCA)

Vuoi che partiamo dallo STEP 1 e io:

ti riscrivo tutta la cartella workspace

con commenti AI

senza cambiare il comportamento

Ogni nuovo section.type → 3 posti

engine.schema.fe.ts

engine.builder.ts

EnginePreview.tsx

❝ Il preview non appartiene al Business.
Appartiene alla Configuration. ❞