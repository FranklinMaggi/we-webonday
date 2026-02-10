// ======================================================
// BE || AI || GEMINI CLIENT
// PATH: src/lib/ai/gemini.ts
// ======================================================
//
// RUOLO:
// - Esegue chiamate raw alla Gemini API
// - Isolato, riutilizzabile
//
// INVARIANTI:
// - Usa SOLO env.GEMINI_API_KEY
// - Nessuna logica di business
// ======================================================

import type { Env } from "../../../../types/env";

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
};

export function assertGeminiKey(env: Env) {
    console.log(
      "[GEMINI] key present:",
      Boolean(env.GEMINI_API_KEY),
      env.GEMINI_API_KEY?.slice(0, 6)
    );
  }

export async function geminiGenerateText(
  env: Env,
  prompt: string
): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: `
      Sei un generatore automatico di testi descrittivi per schede business.
      DEVI restituire un testo COMPLETO, grammaticalmente corretto e concluso.
      NON troncare frasi.
      NON fermarti a metà periodo.
      Rispondi SOLO con il testo finale.
      NON usare titoli, elenchi, markdown o virgolette.
      `
            }
          ]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1800,
        },
      }),
    }
  );
  

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[GEMINI] ${err}`);
  }

  const data = (await res.json()) as GeminiResponse;

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return text.trim();
}
