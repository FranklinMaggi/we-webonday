🔁 FLOW COMPLETO (END-TO-END)
1️⃣ User compila Business

Inserisce:

settore

description tags

service tags

2️⃣ BE → genera testo (una volta)

Nel dominio Business:

if (business.descriptionTagsChanged) {
  business.descriptionText =
    await generateBusinessDescription({
      name,
      sector,
      serviceTags,
      descriptionTags,
    });
}


📌 NON a ogni refresh
📌 SOLO se cambiano i dati

3️⃣ BE salva
business.descriptionText = "Scopri Treccine, un punto di riferimento..."

4️⃣ FE Preview legge
adaptFrontendPreviewInput.ts
business: {
  name: business.name,
  slug: slugify(business.name),
  sector: business.sector ?? "generic",
  address: business.address ?? "",
  openingHours: business.openingHours,

  descriptionText: business.descriptionText, // ⬅️
},

5️⃣ buildCanvas usa SOLO quello

📁 buildCanvas.ts

const description: CanvasSection | null =
  business.descriptionText
    ? {
        type: "description",
        text: business.descriptionText,
      }
    : null;


E nella sections:

...(description ? [description] : []),


👉 se non esiste → non mostra nulla
👉 preview sempre pulita

🔒 REGOLE IMPORTANTI (NON NEGOZIABILI)

❌ NIENTE fallback finto se OpenAI non ha ancora girato

❌ NIENTE chiamate OpenAI dal FE

❌ NIENTE prompt hardcoded nel FE

✅ Testo sempre salvato nel Business

✅ Preview = read-only

🧪 VERSIONE 1 (MINIMA)

Per partire subito, puoi:

generare 1 sola volta

lingua: italiano

1 paragrafo

Poi in v2:

multilingua

SEO mode

long / short description