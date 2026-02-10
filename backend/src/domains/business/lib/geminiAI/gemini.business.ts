// ======================================================
// BE || AI || BUSINESS DESCRIPTION GENERATOR
// PATH: src/lib/ai/gemini.business.ts
// ======================================================
//
// RUOLO:
// - Genera descrizione business da tag
//
// INVARIANTI:
// - Testo descrittivo
// - No marketing aggressivo
// - Linguaggio naturale italiano
// ======================================================

import type { Env } from "../../../../types/env";
import { geminiGenerateText } from "./gemini";

type GenerateBusinessDescriptionInput = {
  name: string;
  sector: string;
  businessDescriptionTags: string[];
  businessServiceTags: string[];
};

export async function generateBusinessDescription(
  env: Env,
  input: GenerateBusinessDescriptionInput
): Promise<string> {
  const {
    name,
    sector,
    businessDescriptionTags,
    businessServiceTags,
  } = input;

  const prompt = `
  Scrivi un testo descrittivo naturale e professionale per un'attività.
  
  Nome attività: ${name}
  Settore: ${sector}
  
  Caratteristiche:
  ${businessDescriptionTags.map(t => `- ${t}`).join("\n")}
  
  Servizi offerti:
  ${businessServiceTags.map(t => `- ${t}`).join("\n")}
  
  REGOLE OBBLIGATORIE:
  - restituisci SOLO il testo finale
  - massimo 4 frasi
  - un solo paragrafo
  - niente titoli
  - niente elenchi
  - niente introduzioni o spiegazioni
  - niente emoji
  - niente virgolette
  - lingua italiana
  `;

  return geminiGenerateText(env, prompt);
}
