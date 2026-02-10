// GET /api/test/gemini

import {Env} from "../../../../types/env";
export async function testGemini(
    request: Request,
    env: Env
  ): Promise<Response> {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: "Scrivi una descrizione per uno studio medico accogliente" },
                ],
              },
            ],
          }),
        }
      );
      
  
    const jsonRes = await res.json();
    console.log("[GEMINI RAW]", JSON.stringify(jsonRes, null, 2));
  
    return new Response(JSON.stringify(jsonRes), {
      headers: { "content-type": "application/json" },
    });
  }
  