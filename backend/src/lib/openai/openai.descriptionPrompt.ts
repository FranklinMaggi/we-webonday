export function businessDescriptionPrompt(input: {
    name: string;
    sector: string;
    descriptionTags?: string[];
    serviceTags?: string[];
  }) {
    return [
      {
        role: "system" as const,
        content:
          "Sei un copywriter professionista specializzato in siti web per attività locali.",
      },
      {
        role: "user" as const,
        content: `
  Scrivi una descrizione professionale per il sito web di un'attività.
  
  Nome attività: ${input.name}
  Settore: ${input.sector}
  
  Servizi principali: ${input.serviceTags?.join(", ") ?? "non specificati"}
  Caratteristiche: ${input.descriptionTags?.join(", ") ?? "non specificate"}
  
  Regole:
  - massimo 3 frasi
  - italiano
  - tono professionale e accogliente
  - niente elenchi
  - niente emoji
  - niente virgolette
  - niente CTA
  
  Testo:
        `.trim(),
      },
    ];
  }
  