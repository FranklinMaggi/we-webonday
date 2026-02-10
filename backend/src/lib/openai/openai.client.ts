import { getOpenAIKey } from "./openai";
import type { Env } from "../../types/env";

type OpenAIChatResponse = {
    choices: {
      message: {
        content: string;
      };
    }[];
  };

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export async function openAIChat(
  env: Env,
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = getOpenAIKey(env);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      max_tokens: 200,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }
  const data = (await res.json()) as OpenAIChatResponse;
  console.log("[OPENAI] response OK");
  console.log(
    "[OPENAI TEXT]",
    data.choices[0].message.content
  );
  return data.choices[0].message.content.trim();
  
}
